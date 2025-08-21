import { NextResponse } from 'next/server';

export async function GET() {
  // No-op: cron finalization handled by Voting API directly
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  return NextResponse.json({ success: true, message: 'Finalization handled by Voting API', date: dateStr });
}