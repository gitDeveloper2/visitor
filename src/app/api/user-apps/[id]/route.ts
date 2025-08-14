import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSession } from '@/features/shared/utils/auth';

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
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
    }

    const app = await db
      .collection('userapps')
      .findOne({ 
        _id: new ObjectId(params.id),
        authorId: session.user.id // Only allow users to access their own apps
      });

    if (!app) {
      return NextResponse.json({ message: 'App not found' }, { status: 404 });
    }

    return NextResponse.json({ app }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch app.', error: error?.toString() }, { status: 500 });
  }
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

    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
    }

    const updateData = await request.json();
    
    // Check if this is a status-only update or full app update
    if (updateData.status && Object.keys(updateData).length === 2 && updateData.updatedAt) {
      // Status-only update (existing functionality)
      const { status } = updateData;
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
      }

      const result = await db
        .collection('userapps')
        .updateOne(
          { _id: new ObjectId(params.id) },
          { $set: { status, updatedAt: new Date() } }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'App not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'App status updated successfully' }, { status: 200 });
    } else {
      // Full app update
      const {
        name,
        description,
        tags,
        website,
        github,
        category,
        techStack,
        pricing,
        features,
        isInternal,
        premiumPlan
      } = updateData;

      // Validate required fields
      if (!name || !description) {
        return NextResponse.json({ message: 'Name and description are required' }, { status: 400 });
      }

      const result = await db
        .collection('userapps')
        .updateOne(
          { 
            _id: new ObjectId(params.id),
            authorId: session.user.id // Only allow users to update their own apps
          },
          { 
            $set: { 
              name,
              description,
              tags: tags || [],
              website: website || "",
              github: github || "",
              category: category || "",
              techStack: techStack || [],
              pricing: pricing || "Free",
              features: features || [],
              isInternal: isInternal || false,
              premiumPlan: premiumPlan || null,
              updatedAt: new Date()
            } 
          }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'App not found or unauthorized' }, { status: 404 });
      }

      return NextResponse.json({ message: 'App updated successfully' }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update app.', error: error?.toString() }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { id } = params;
    const { premiumStatus } = await request.json();

    if (!premiumStatus) {
      return NextResponse.json({ 
        message: 'Missing premiumStatus field' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Update the app's premium status
    const result = await db.collection('userapps').updateOne(
      { _id: new ObjectId(id), authorId: session.user.id },
      { 
        $set: { 
          premiumStatus,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        message: 'App not found or unauthorized' 
      }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ 
        message: 'No changes made' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Premium status updated successfully',
      appId: id,
      premiumStatus
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error updating premium status:", error);
    return NextResponse.json({ 
      message: 'Failed to update premium status.', 
      error: error?.toString() 
    }, { status: 500 });
  }
} 