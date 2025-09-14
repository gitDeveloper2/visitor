import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { endVotingSession, startVotingSession, getTodaysLaunchTools } from '@/lib/voting/session';

// This endpoint is protected by Vercel's cron secret
// https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verify this is a cron job request
    const authHeader = (await headers()).get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // 1. End yesterday's session
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    const endResult = await endVotingSession(yesterdayKey);
    console.log('Ended previous session:', endResult);
    
    // 2. Start today's session
    const toolIds = await getTodaysLaunchTools();
    
    if (toolIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No tools scheduled for launch today',
      });
    }
    
    const session = await startVotingSession(today, toolIds);
    
    return NextResponse.json({
      success: true,
      message: 'Voting session started',
      session: {
        ...session,
        tools: toolIds,
      },
    });
    
  } catch (error) {
    console.error('Error managing voting session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to manage voting session',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

