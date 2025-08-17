import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'better-auth/react';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      return NextResponse.json(session);
    } else {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
} 