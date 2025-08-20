import { NextResponse } from 'next/server';
import { getVoteSummaryModel } from '@/features/votes/models/VoteSummary';
import { getCachedVoteBatch, setCachedVoteBatch } from '@/features/votes/service/redisSummaries';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const toolIds = searchParams.getAll('ids[]');

  if (!toolIds.length) {
    return NextResponse.json({ success: false, error: 'No toolIds provided' }, { status: 400 });
  }

  // Try Redis first
  const cached = await getCachedVoteBatch(toolIds);
  if (cached) {
    return NextResponse.json({ success: true, counts: cached });
  }

  // Fallback to Mongo
  const VoteSummary = await getVoteSummaryModel();
  const _toolIds = toolIds.map((id: string) => new mongoose.Types.ObjectId(id));
  const summaries = await VoteSummary.find({ toolId: { $in: _toolIds } });

  const counts: Record<string, number> = {};
  for (const summary of summaries) {
    counts[summary.toolId.toString()] = summary.totalVotes;
  }

  // Ensure all requested IDs are present
  for (const id of toolIds) {
    if (!(id in counts)) counts[id] = 0;
  }

  // Cache result
  await setCachedVoteBatch(toolIds, counts);

  return NextResponse.json({ success: true, counts });
}