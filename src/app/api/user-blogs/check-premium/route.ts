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

    // Check if user has active premium blog access
    const activeSub = await db.collection('blog_premium_access').findOne({
      userId: session.user.id,
      status: 'active',
      expiresAt: { $gt: new Date() },
    });

    const hasPremium = !!activeSub;

    return NextResponse.json({ hasPremium });
  } catch (error) {
    console.error('Error checking premium status:', error);
    return NextResponse.json(
      { message: 'Failed to check premium status.', error: error?.toString() },
      { status: 500 }
    );
  }
} 

// This route relies on authenticated context; force dynamic rendering.
export const dynamic = 'force-dynamic';