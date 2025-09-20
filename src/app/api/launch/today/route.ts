import { NextResponse } from 'next/server';

/**
 * DEPRECATED: This endpoint has been moved to the Voting API
 * 
 * The Voting API now owns the launches collection 100% and handles
 * all launch-related operations including today's launches.
 * 
 * Please use: {VOTING_API_URL}/api/launch/today instead
 */
export async function GET() {
  return NextResponse.json({ 
    error: 'This endpoint has been moved to the Voting API',
    message: 'Please use the Voting API endpoint for today\'s launches',
    votingApiEndpoint: '/api/launch/today'
  }, { 
    status: 410 // Gone
  });
}