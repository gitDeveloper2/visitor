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
    if (!formData.name || !formData.description) {
      return NextResponse.json({ message: 'Name and description are required for draft.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const draft = {
      ...formData,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      premiumReady: false,
      status: 'draft',
    };

    const result = await db.collection('app_drafts').insertOne(draft);

    console.log(`📝 App draft saved for user ${session.user.id} with ID ${result.insertedId}`);

    return NextResponse.json(
      { message: 'App draft saved successfully.', draftId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving app draft:', error);
    return NextResponse.json(
      { message: 'Failed to save app draft.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
}

// Clean up old drafts (older than 7 days)
export async function DELETE() {
  try {
    const { db } = await connectToDatabase();

    // Calculate cutoff date (7 days ago)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log(`🧹 Starting automatic app draft cleanup at ${new Date().toISOString()}`);
    console.log(`📅 Deleting app drafts older than: ${sevenDaysAgo.toISOString()}`);

    // Delete expired drafts
    const result = await db.collection('app_drafts').deleteMany({
      createdAt: { $lt: sevenDaysAgo },
      premiumReady: false, // Only delete drafts that weren't used for premium
    });

    console.log(`✅ App draft cleanup completed: ${result.deletedCount} drafts deleted`);

    return NextResponse.json({
      success: true,
      message: `App draft cleanup completed successfully`,
      deletedCount: result.deletedCount,
      cutoffDate: sevenDaysAgo.toISOString(),
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error during app draft cleanup:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to cleanup app drafts', 
        error: (error as Error)?.toString() 
      }, 
      { status: 500 }
    );
  }
} 