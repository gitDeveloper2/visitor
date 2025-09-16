import { NextResponse } from 'next/server';

// This endpoint is deprecated - voting management is now handled by the separate Voting API
// The Voting API has its own cron jobs for launch management

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Voting management moved to separate Voting API',
      message: 'Launch and voting management is now handled by dedicated Voting API cron jobs'
    },
    { status: 410 } // Gone - resource no longer available
  );
}
