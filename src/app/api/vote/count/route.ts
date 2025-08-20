import { NextResponse } from 'next/server';
import { getVoteCount } from '@/features/votes/service/redisSummaries';
import { getVoteSummaryModel } from '@/features/votes/models/VoteSummary';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  const { toolId } = await req.json();

  if (!toolId) {
    return NextResponse.json({ success: false, error: 'Missing toolId' }, { status: 400 });
  }

  // Try Redis first
  let count = await getVoteCount(toolId);

  if (count === null) {
    const VoteSummary = await getVoteSummaryModel();
    const summary = await VoteSummary.findOne({ toolId: new mongoose.Types.ObjectId(toolId) }).lean();
    count = summary?.totalVotes ?? 0;
  }

  return NextResponse.json({ success: true, votes: count });
}