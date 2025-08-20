// app/api/vote/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';

import { getVoteModel } from '@features/votes/models/Vote';
import { getVoteSummaryModel } from '@features/votes/models/VoteSummary';
import { incrementVoteCount, decrementVoteCount } from '@features/votes/service/redisSummaries';
import { auth } from '../../../../auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });  console.log(session)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { toolId } = await req.json();
  const userId = session.user.id;
  const _toolId = new mongoose.Types.ObjectId(toolId);

  const Vote = await getVoteModel();
  const VoteSummary = await getVoteSummaryModel();

  const existingVote = await Vote.findOne({ userId, toolId: _toolId });

  let newCount: number;

  if (existingVote) {
    // UNVOTE
    await Vote.deleteOne({ _id: existingVote._id });
    await VoteSummary.updateOne({ toolId: _toolId }, { $inc: { totalVotes: -1 } }, { upsert: true });
    newCount = await decrementVoteCount(toolId);
  } else {
    // VOTE
    await Vote.create({ userId, toolId: _toolId });
    await VoteSummary.updateOne({ toolId: _toolId }, { $inc: { totalVotes: 1 } }, { upsert: true });
    newCount = await incrementVoteCount(toolId);
  }

  return NextResponse.json({
    success: true,
    alreadyVoted: !existingVote,
    votes: newCount,
  });
}
