import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';

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