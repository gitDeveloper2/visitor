import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function normalizeDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00.000Z');
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const da = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

export async function POST(req: Request) {
  try {
    const { appId, preferredDate, isPremium, votingDurationHours } = await req.json();
    if (!appId || !preferredDate) {
      return NextResponse.json({ error: 'appId and preferredDate are required' }, { status: 400 });
    }

    const date = normalizeDate(preferredDate);
    const defaultCap = Number(process.env.LAUNCH_DEFAULT_CAP || 3);

    const { db } = await connectToDatabase();
    const col = db.collection('launchslots');
    const apps = db.collection('userapps');

    // Ensure App exists and not already scheduled
    const appDoc = await apps.findOne({ _id: new ObjectId(appId) });
    if (!appDoc) return NextResponse.json({ error: 'App not found' }, { status: 404 });
    if (appDoc.launchDate) return NextResponse.json({ error: 'App already scheduled' }, { status: 400 });

    // Ensure index
    await col.createIndex({ date: 1 }, { unique: true });

    // Fetch or create slot
    let slot = await col.findOne({ date });
    if (!slot) {
      await col.insertOne({ date, cap: defaultCap, bookings: [], numNonPremium: 0, updatedAt: new Date() });
      slot = await col.findOne({ date });
    }

    const bookings = Array.isArray(slot?.bookings) ? slot!.bookings as any[] : [];
    const cap = typeof slot?.cap === 'number' ? slot!.cap : defaultCap;

    if (!isPremium) {
      if (bookings.length >= cap) {
        return NextResponse.json({ error: 'Day is full. Pick another date.' }, { status: 409 });
      }
      await col.updateOne({ date }, {
        $push: { bookings: { appId: new ObjectId(appId), isPremium: false, bookedAt: new Date() } },
        $inc: { numNonPremium: 1 },
        $set: { updatedAt: new Date() },
      });
      await apps.updateOne({ _id: new ObjectId(appId) }, {
        $set: {
          launchDate: new Date(date + 'T00:00:00.000Z'),
          votingDurationHours: typeof votingDurationHours === 'number' ? votingDurationHours : 24,
        },
      });
      return NextResponse.json({ success: true, date });
    }

    if (bookings.length < cap) {
      await col.updateOne({ date }, {
        $push: { bookings: { appId: new ObjectId(appId), isPremium: true, bookedAt: new Date() } },
        $set: { updatedAt: new Date() },
      });
      await apps.updateOne({ _id: new ObjectId(appId) }, {
        $set: {
          launchDate: new Date(date + 'T00:00:00.000Z'),
          votingDurationHours: typeof votingDurationHours === 'number' ? votingDurationHours : 24,
        },
      });
      return NextResponse.json({ success: true, date });
    }

    // Full: bump non-premium (most recently booked)
    const revIdx = [...bookings].reverse().findIndex((b: any) => !b.isPremium);
    if (revIdx === -1) {
      // No non-premium to bump: allow exceed by 1
      await col.updateOne({ date }, {
        $push: { bookings: { appId: new ObjectId(appId), isPremium: true, bookedAt: new Date() } },
        $set: { updatedAt: new Date() },
      });
      await apps.updateOne({ _id: new ObjectId(appId) }, {
        $set: {
          launchDate: new Date(date + 'T00:00:00.000Z'),
          votingDurationHours: typeof votingDurationHours === 'number' ? votingDurationHours : 24,
        },
      });
      return NextResponse.json({ success: true, date, note: 'Exceeded cap (no non‑premium to bump)' });
    }

    const realIndex = bookings.length - 1 - revIdx;
    const bumped = bookings[realIndex];

    // Pull bumped and push premium in one go
    await col.updateOne({ date }, {
      $pull: { bookings: { appId: new ObjectId(bumped.appId) } },
      $push: { bookings: { appId: new ObjectId(appId), isPremium: true, bookedAt: new Date() } },
      $inc: { numNonPremium: -1 },
      $set: { updatedAt: new Date() },
    });

    // Reschedule bumped to next available day
    const horizonDays = Number(process.env.LAUNCH_HORIZON_DAYS || 30);
    let rescheduledDate: string | null = null;
    for (let i = 1; i <= horizonDays; i++) {
      const d = new Date(date + 'T00:00:00.000Z');
      d.setUTCDate(d.getUTCDate() + i);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const da = String(d.getUTCDate()).padStart(2, '0');
      const key = `${y}-${m}-${da}`;
      let s = await col.findOne({ date: key });
      if (!s) {
        await col.insertOne({ date: key, cap: defaultCap, bookings: [], numNonPremium: 0, updatedAt: new Date() });
        s = await col.findOne({ date: key });
      }
      const bks = Array.isArray(s?.bookings) ? s!.bookings as any[] : [];
      const sc = typeof s?.cap === 'number' ? s!.cap : defaultCap;
      if (bks.length < sc) {
        await col.updateOne({ date: key }, {
          $push: { bookings: { appId: new ObjectId(bumped.appId), isPremium: false, bookedAt: new Date() } },
          $inc: { numNonPremium: 1 },
          $set: { updatedAt: new Date() },
        });
        rescheduledDate = key;
        break;
      }
    }

    // Update premium app
    await apps.updateOne({ _id: new ObjectId(appId) }, {
      $set: {
        launchDate: new Date(date + 'T00:00:00.000Z'),
        votingDurationHours: typeof votingDurationHours === 'number' ? votingDurationHours : 24,
      },
    });

    // Update bumped app
    if (rescheduledDate) {
      await apps.updateOne({ _id: new ObjectId(bumped.appId) }, { $set: { launchDate: new Date(rescheduledDate + 'T00:00:00.000Z') } });
    } else {
      await apps.updateOne({ _id: new ObjectId(bumped.appId) }, { $unset: { launchDate: '' } });
    }

    return NextResponse.json({ success: true, date, bumped: String(bumped.appId), bumpedTo: rescheduledDate });
  } catch (e: any) {
    console.error('BookSlot POST', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}