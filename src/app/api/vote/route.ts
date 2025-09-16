import { NextResponse } from 'next/server';

// This endpoint is deprecated - voting is now handled by the separate Voting API
// Main app should not handle votes directly anymore

export async function POST(req: Request) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Voting endpoint moved to separate Voting API',
      message: 'Please use the dedicated Voting API for all voting operations'
    },
    { status: 410 } // Gone - resource no longer available
  );
}