import { NextResponse } from 'next/server';
import { getUserUpvotedTools } from '@features/votes/service/voteService';
import { auth } from '../../../../../auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tools = await getUserUpvotedTools(userId);
    return NextResponse.json({ success: true, data: tools });
  } catch (error) {
    console.error('[UpvotedTools]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
