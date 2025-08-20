import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSession } from '@/features/shared/utils/auth';

function normalizeDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00.000Z');
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const da = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { appId, newDate } = await req.json();
    if (!appId || !ObjectId.isValid(appId) || !newDate) {
      return NextResponse.json({ error: 'appId and newDate are required' }, { status: 400 });
    }

    const date = normalizeDate(newDate);

    const { db } = await connectToDatabase();
    const apps = db.collection('userapps');
    const slots = db.collection('launchslots');

    // Ensure ownership and fetch app
    const appDoc = await apps.findOne({ _id: new ObjectId(appId), authorId: session.user.id });
    if (!appDoc) return NextResponse.json({ error: 'App not found' }, { status: 404 });
    if (!appDoc.launchDate) return NextResponse.json({ error: 'App is not scheduled' }, { status: 400 });

    // Determine booking type from old slot
    const oldDay = normalizeDate(new Date(appDoc.launchDate).toISOString().slice(0, 10));
    const oldSlot = await slots.findOne({ date: oldDay });
    let wasPremium = false;
    if (oldSlot && Array.isArray(oldSlot.bookings)) {
      const existing = oldSlot.bookings.find((b: any) => String(b.appId) === String(appDoc._id));
      wasPremium = !!existing?.isPremium;
    }

    // Ensure index
    await slots.createIndex({ date: 1 }, { unique: true });

    const defaultCap = Number(process.env.LAUNCH_DEFAULT_CAP || 3);
    let newSlot = await slots.findOne({ date });
    if (!newSlot) {
      await slots.insertOne({ date, cap: defaultCap, bookings: [], numNonPremium: 0, updatedAt: new Date() });
      newSlot = await slots.findOne({ date });
    }

    const bookings = Array.isArray(newSlot?.bookings) ? (newSlot!.bookings as any[]) : [];
    const cap = typeof newSlot?.cap === 'number' ? newSlot!.cap : defaultCap;

    if (!wasPremium && bookings.length >= cap) {
      return NextResponse.json({ error: 'Selected date is fully booked' }, { status: 400 });
    }

    // Remove from old slot
    await slots.updateOne(
      { date: oldDay },
      {
        $pull: { bookings: { appId: new ObjectId(appId) } },
        ...(wasPremium ? {} : { $inc: { numNonPremium: -1 } }),
        $set: { updatedAt: new Date() },
      }
    );

    // Add to new slot
    await slots.updateOne(
      { date },
      {
        $push: { bookings: { appId: new ObjectId(appId), isPremium: wasPremium, bookedAt: new Date() } },
        ...(wasPremium ? {} : { $inc: { numNonPremium: 1 } }),
        $set: { updatedAt: new Date() },
      }
    );

    // Update app launch date
    await apps.updateOne(
      { _id: new ObjectId(appId) },
      { $set: { launchDate: new Date(date + 'T00:00:00.000Z') } }
    );

    return NextResponse.json({ success: true, date });
  } catch (e: any) {
    console.error('RescheduleSlot POST', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

