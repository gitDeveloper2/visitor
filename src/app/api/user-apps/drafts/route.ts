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
      .collection('app_drafts')
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .project({ 
        premiumReady: 1, 
        name: 1, 
        description: 1,
        tagline: 1,
        tags: 1, 
        category: 1,
        techStack: 1,
        pricing: 1,
        features: 1,
        website: 1,
        github: 1,
        authorBio: 1,
        createdAt: 1, 
        updatedAt: 1,
        premiumPlan: 1,
        status: 1
      })
      .toArray();

    // Calculate remaining time for each draft
    const draftsWithExpiry = drafts.map(draft => {
      const createdAt = new Date(draft.createdAt);
      const expiryDate = new Date(createdAt.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      const now = new Date();
      const remainingMs = expiryDate.getTime() - now.getTime();
      const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      
      return {
        ...draft,
        expiryDate,
        remainingDays: Math.max(0, remainingDays),
        isExpired: remainingMs <= 0
      };
    });

    return NextResponse.json({ drafts: draftsWithExpiry }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch app drafts:', error);
    return NextResponse.json({ message: 'Failed to fetch app drafts.', error: (error as Error)?.toString() }, { status: 500 });
  }
}

// This route reads authenticated request context; ensure it's always dynamic
export const dynamic = 'force-dynamic'; 