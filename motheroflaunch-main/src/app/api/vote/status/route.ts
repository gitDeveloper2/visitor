// app/api/vote/status/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { getVoteModel } from '@features/votes/models/Vote';
import { headers } from 'next/headers';
import { auth } from '../../../../../auth';

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });  console.log("auth",session)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  } 

  const { toolIds } = await req.json(); // Expect: string[]

  if (!Array.isArray(toolIds)) {
    return NextResponse.json({ success: false, error: 'Invalid toolIds' }, { status: 400 });
  }

  const _toolIds = toolIds.map((id: string) => new mongoose.Types.ObjectId(id));

  const Vote = await getVoteModel();

  const votes = await Vote.find({
    userId: session.user.id,
    toolId: { $in: _toolIds },
  }).select('toolId');

  const votedToolIds = votes.map((v) => v.toolId.toString());

  return NextResponse.json({ success: true, votedToolIds });
}
