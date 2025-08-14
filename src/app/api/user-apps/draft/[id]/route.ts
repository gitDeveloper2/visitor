import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const draftId = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(draftId)) {
      return NextResponse.json({ message: 'Invalid draft ID format' }, { status: 400 });
    }

    const draft = await db.collection('app_drafts').findOne({
      _id: new ObjectId(draftId),
      userId: session.user.id,
    });

    if (!draft) {
      return NextResponse.json({ message: 'App draft not found' }, { status: 404 });
    }

    // Return draft data with _id for proper restoration
    const { userId, createdAt, updatedAt, ...draftData } = draft as any;
    draftData._id = draft._id.toString(); // Include the draft ID as string

    return NextResponse.json(draftData);
  } catch (error) {
    console.error('Error retrieving app draft:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve app draft.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const draftId = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(draftId)) {
      return NextResponse.json({ message: 'Invalid draft ID format' }, { status: 400 });
    }

    // Verify draft exists and belongs to user
    const draft = await db.collection('app_drafts').findOne({
      _id: new ObjectId(draftId),
      userId: session.user.id,
    });

    if (!draft) {
      return NextResponse.json({ message: 'App draft not found' }, { status: 404 });
    }

    // Delete the draft
    const result = await db.collection('app_drafts').deleteOne({
      _id: new ObjectId(draftId),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Failed to delete app draft' }, { status: 500 });
    }

    console.log(`🗑️ App draft ${draftId} deleted for user ${session.user.id}`);

    return NextResponse.json({ message: 'App draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting app draft:', error);
    return NextResponse.json(
      { message: 'Failed to delete app draft.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
} 