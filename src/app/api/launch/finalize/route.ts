import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // No-op: Finalization is now fully handled by the external Voting API
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ success: true, message: 'Finalization handled by Voting API', received: body });
  } catch {
    return NextResponse.json({ success: true, message: 'Finalization handled by Voting API' });
  }
}