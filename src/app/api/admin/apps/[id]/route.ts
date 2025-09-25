import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

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

    // Check if the app exists
    const existingApp = await db
      .collection('userapps')
      .findOne({ _id: new ObjectId(params.id) });

    if (!existingApp) {
      return NextResponse.json({ message: 'App not found' }, { status: 404 });
    }

    // Update the status and set launchDate for approved apps
    const updateFields: any = { status, updatedAt: new Date() };
    
    // If approving an app: only set a launchDate if it doesn't already exist.
    // Do NOT override an existing scheduled date to avoid corrupting launch schedules.
    if (status === 'approved' && !existingApp.launchDate) {
      const today = new Date();
      const y = today.getUTCFullYear();
      const m = String(today.getUTCMonth() + 1).padStart(2, '0');
      const d = String(today.getUTCDate()).padStart(2, '0');
      updateFields.launchDate = new Date(`${y}-${m}-${d}T00:00:00.000Z`);
    }
    
    const result = await db
      .collection('userapps')
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updateFields }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'App not found' }, { status: 404 });
    }

    // Revalidate launch page when approving apps
    if (status === 'approved') {
      try {
        revalidatePath('/launch');
        console.log('✅ Launch page revalidated after app approval');
      } catch (revalidateError) {
        console.error('❌ Failed to revalidate launch page:', revalidateError);
        // Don't fail the request if revalidation fails
      }
    }

    return NextResponse.json({ message: 'App status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating app status:', error);
    return NextResponse.json({ message: 'Failed to update app status.', error: error?.toString() }, { status: 500 });
  }
}
