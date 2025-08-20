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
    const { date } = await req.json();
    if (!date) return NextResponse.json({ error: 'date (YYYY-MM-DD) required' }, { status: 400 });

    const day = normalizeDate(date);
    const start = new Date(`${day}T00:00:00.000Z`);
    const end = new Date(`${day}T23:59:59.999Z`);

    const base = (process.env.NEXT_PUBLIC_VOTES_URL || '').trim().replace(/\/+$/g, '');
    if (!base) return NextResponse.json({ error: 'NEXT_PUBLIC_VOTES_URL not set' }, { status: 500 });

    const { db } = await connectToDatabase();
    const appsCol = db.collection('userapps');

    const launched = await appsCol.find({ status: 'approved', launchDate: { $gte: start, $lte: end } }).toArray();
    if (!launched.length) return NextResponse.json({ success: true, updated: 0 });

    const ids = launched.map(a => String(a._id));
    const params = new URLSearchParams();
    ids.forEach(id => params.append('ids[]', id));

    const res = await fetch(`${base}/api/vote/batch-count?${params.toString()}`);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return NextResponse.json({ error: j.error || 'Failed to fetch votes' }, { status: 502 });
    }
    const { counts } = await res.json();

    // Sort by votes desc
    const ranked = launched
      .map(a => ({ app: a, votes: counts[String(a._id)] ?? 0 }))
      .sort((a, b) => b.votes - a.votes);

    const top3Ids = ranked.slice(0, 3).map(r => String(r.app._id));

    // Update all apps: set final likes and votingFlushed true
    const bulk = appsCol.initializeUnorderedBulkOp();
    for (const r of ranked) {
      bulk.find({ _id: new ObjectId(r.app._id) }).updateOne({
        $set: {
          likes: r.votes,
          finalVotes: r.votes,
          votingFlushed: true,
          dofollow: top3Ids.includes(String(r.app._id)),
        },
      });
    }
    await bulk.execute();

    return NextResponse.json({ success: true, updated: ranked.length, top3: top3Ids });
  } catch (e: any) {
    console.error('Finalize route', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}