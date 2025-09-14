import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { headers } from 'next/headers';
import { redis, votingKeys } from '@/lib/voting/redis';
import { isToolInActiveSession } from '@/lib/voting/session';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { toolId } = await req.json();
    const userId = session.user.id;
    const date = new Date().toISOString().split('T')[0];

    // Check if tool is in active voting session
    const canVote = await isToolInActiveSession(toolId);
    if (!canVote) {
      return NextResponse.json(
        { success: false, error: 'Voting is not active for this tool' },
        { status: 400 }
      );
    }

    const redisClient = await redis;
    const userVoteKey = votingKeys.userVotes(userId, date);
    const toolVoteKey = votingKeys.toolVotes(toolId);

    // Check if user already voted for this tool
    const hasVoted = await redisClient.sIsMember(userVoteKey, toolId);
    const multi = redisClient.multi();

    if (hasVoted) {
      // Handle unvote
      multi.sRem(userVoteKey, toolId);
      multi.decr(toolVoteKey);
    } else {
      // Handle vote
      multi.sAdd(userVoteKey, toolId);
      multi.incr(toolVoteKey);
      // Set user vote expiration (slightly longer than session)
      multi.expire(userVoteKey, 36 * 60 * 60); // 36 hours
    }

    // Execute all operations atomically
    const results = await multi.exec();
    
    // Get the new vote count (last operation in the pipeline)
    const newCount = parseInt(results[results.length - 1][1] as string, 10);

    return NextResponse.json({
      success: true,
      alreadyVoted: !hasVoted,
      votes: newCount,
    });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}