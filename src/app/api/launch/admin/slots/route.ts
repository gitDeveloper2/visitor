import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@/features/shared/utils/auth';

function isAdmin(session: any) {
  return session && session.user && session.user.role === 'admin';
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!isAdmin(session)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (!from || !to) return NextResponse.json({ error: 'from and to required (YYYY-MM-DD)' }, { status: 400 });

    const { db } = await connectToDatabase();
    const slots = await db.collection('launchslots')
      .find({ date: { $gte: from, $lte: to } })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json({ success: true, slots });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!isAdmin(session)) return NextResponse.json({ error: 'Admin required' }, { status: 403 });

    const { date, cap } = await req.json();
    if (!date || typeof cap !== 'number') return NextResponse.json({ error: 'date and cap required' }, { status: 400 });

    const { db } = await connectToDatabase();
    const col = db.collection('launchslots');
    await col.updateOne(
      { date },
      { $set: { cap, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

