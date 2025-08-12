import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const formData = await request.json();

    // Validate required fields
    if (!formData.title || !formData.content) {
      return NextResponse.json({ message: 'Title and content are required for draft.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const draft = {
      ...formData,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      premiumReady: false,
    };

    const result = await db.collection('blog_drafts').insertOne(draft);

    console.log(`📝 Draft saved for user ${session.user.id} with ID ${result.insertedId}`);

    return NextResponse.json(
      { message: 'Draft saved successfully.', draftId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { message: 'Failed to save draft.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
}

// Clean up old drafts (older than 7 days)
export async function DELETE() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await db.collection('blog_drafts').deleteMany({
      userId: session.user.id,
      createdAt: { $lt: sevenDaysAgo },
      premiumReady: false, // Only delete drafts that weren't used for premium
    });

    console.log(`🧹 Cleaned up ${result.deletedCount} old drafts for user ${session.user.id}`);

    return NextResponse.json({
      message: 'Old drafts cleaned up successfully.',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error cleaning up drafts:', error);
    return NextResponse.json(
      { message: 'Failed to clean up drafts.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
}