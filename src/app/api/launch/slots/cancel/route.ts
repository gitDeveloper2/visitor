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

    const { appId } = await req.json();
    if (!appId || !ObjectId.isValid(appId)) {
      return NextResponse.json({ error: 'Valid appId is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const apps = db.collection('userapps');
    const slots = db.collection('launchslots');

    // Ensure ownership
    const appDoc = await apps.findOne({ _id: new ObjectId(appId), authorId: session.user.id });
    if (!appDoc) return NextResponse.json({ error: 'App not found' }, { status: 404 });
    if (!appDoc.launchDate) return NextResponse.json({ error: 'App is not scheduled' }, { status: 400 });

    const day = normalizeDate(new Date(appDoc.launchDate).toISOString().slice(0, 10));

    // Load the slot to identify booking type
    const slotDoc = await slots.findOne({ date: day });
    if (slotDoc && Array.isArray(slotDoc.bookings)) {
      const existing = slotDoc.bookings.find((b: any) => String(b.appId) === String(appDoc._id));
      if (existing) {
        const isPremium = !!existing.isPremium;
        await slots.updateOne(
          { date: day },
          {
            $pull: { bookings: { appId: new ObjectId(appId) } },
            ...(isPremium ? {} : { $inc: { numNonPremium: -1 } }),
            $set: { updatedAt: new Date() },
          }
        );
      }
    }

    await apps.updateOne({ _id: new ObjectId(appId) }, { $unset: { launchDate: '', votingDurationHours: '' } });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('CancelSlot POST', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

