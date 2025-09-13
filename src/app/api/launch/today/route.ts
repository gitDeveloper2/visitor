import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withDeploymentFlags } from '@/utils/deploymentFlags';

function todayUtcString(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function handleGetToday() {
  try {
    const { db } = await connectToDatabase();
    const col = db.collection('userapps');
    const today = todayUtcString();
    const start = new Date(`${today}T00:00:00.000Z`);
    const end = new Date(`${today}T23:59:59.999Z`);

    // Approved apps launching today
    const apps = await col
      .find({ status: 'approved', launchDate: { $gte: start, $lte: end } })
      .sort({ isPremium: -1, createdAt: -1 })
      .toArray();

    const premium = apps.filter(a => a.isPremium);
    const nonPremium = apps.filter(a => !a.isPremium);

    return NextResponse.json({ success: true, date: today, premium, nonPremium });
  } catch (e: any) {
    console.error('Launch today route', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

export const GET = withDeploymentFlags(handleGetToday, ['appLaunchEnabled']);