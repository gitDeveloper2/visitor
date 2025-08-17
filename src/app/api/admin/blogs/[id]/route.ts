import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

async function isAdmin(session: any) {
  return session && session.user && session.user.role === 'admin';
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    if (!await isAdmin(session)) {
      return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
    }

    const { db } = await connectToDatabase();
    
    if (!params.id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const { status } = await request.json();

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status. Must be pending, approved, or rejected.' }, { status: 400 });
    }

    // Check if the blog exists
    const existingBlog = await db
      .collection('userblogs')
      .findOne({ _id: new ObjectId(params.id) });

    if (!existingBlog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    // Update the status
    const result = await db
      .collection('userblogs')
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { status, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog status:', error);
    return NextResponse.json({ message: 'Failed to update blog status.', error: error?.toString() }, { status: 500 });
  }
}
