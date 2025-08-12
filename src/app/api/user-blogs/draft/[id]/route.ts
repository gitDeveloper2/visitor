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

    const draft = await db.collection('blog_drafts').findOne({
      _id: new ObjectId(draftId),
      userId: session.user.id,
    });

    if (!draft) {
      return NextResponse.json({ message: 'Draft not found' }, { status: 404 });
    }

    // Return draft data with _id for proper restoration
    const { userId, createdAt, updatedAt, ...draftData } = draft as any;
    draftData._id = draft._id.toString(); // Include the draft ID as string

    return NextResponse.json(draftData);
  } catch (error) {
    console.error('Error retrieving draft:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve draft.', error: (error as Error)?.toString() },
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

    const result = await db.collection('blog_drafts').deleteOne({
      _id: new ObjectId(draftId),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Draft not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { message: 'Failed to delete draft.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
} 