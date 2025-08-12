import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const drafts = await db
      .collection('blog_drafts')
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .project({ premiumReady: 1, title: 1, tags: 1, createdAt: 1, updatedAt: 1 })
      .toArray();

    return NextResponse.json({ drafts }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch drafts:', error);
    return NextResponse.json({ message: 'Failed to fetch drafts.', error: (error as Error)?.toString() }, { status: 500 });
  }
}