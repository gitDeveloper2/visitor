import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

function normalizeDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00.000Z');
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const da = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json({ error: 'from and to (YYYY-MM-DD) are required' }, { status: 400 });
    }

    const nf = normalizeDate(from);
    const nt = normalizeDate(to);
    const defaultCap = Number(process.env.LAUNCH_DEFAULT_CAP || 3);

    const { db } = await connectToDatabase();
    const col = db.collection('launchslots');

    // Ensure index exists (safe to call repeatedly)
    await col.createIndex({ date: 1 }, { unique: true });

    const docs = await col
      .find({ date: { $gte: nf, $lte: nt } }, { projection: { date: 1, cap: 1, bookings: 1 } })
      .toArray();

    const map = new Map<string, { cap: number; booked: number }>();
    for (const doc of docs) {
      const cap = typeof doc.cap === 'number' ? doc.cap : defaultCap;
      const booked = Array.isArray(doc.bookings) ? doc.bookings.length : 0;
      map.set(doc.date as string, { cap, booked });
    }

    const result: Array<{ date: string; cap: number; booked: number; available: number }> = [];
    const start = new Date(nf + 'T00:00:00.000Z');
    const end = new Date(nt + 'T00:00:00.000Z');
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const da = String(d.getUTCDate()).padStart(2, '0');
      const key = `${y}-${m}-${da}`;
      const s = map.get(key) || { cap: defaultCap, booked: 0 };
      result.push({ date: key, cap: s.cap, booked: s.booked, available: Math.max(0, s.cap - s.booked) });
    }

    return NextResponse.json({ success: true, slots: result });
  } catch (e: any) {
    console.error('LaunchSlots GET', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}