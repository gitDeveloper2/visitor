import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
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
    console.log("🔵 PUT request received for app ID:", params.id);
    
    const session = await getSession();
    console.log("🔵 Session data:", JSON.stringify(session, null, 2));
    
    if (!session?.user) {
      console.log("❌ Unauthenticated User");
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }
    
    console.log("✅ User authenticated:", session.user.id, session.user.email);
    
    const { db } = await connectToDatabase();
    console.log("✅ Database connected");

    if (!ObjectId.isValid(params.id)) {
      console.log("❌ Invalid app ID format:", params.id);
      return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
    }
    
    console.log("✅ App ID is valid ObjectId");
    
    const updateData = await request.json();
    console.log("🔵 Update data received:", JSON.stringify(updateData, null, 2));
    
    // Check if this is a status-only update or full app update
    if (updateData.status && Object.keys(updateData).length === 1) {
      console.log("🔵 Status-only update detected");
      
      const { status } = updateData;
      console.log("🔵 New status:", status);
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        console.log("❌ Invalid status:", status);
        return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
      }

      // Check if app exists and get current data
      const currentApp = await db.collection('userapps').findOne({ _id: new ObjectId(params.id) });
      console.log("🔵 Current app data:", JSON.stringify(currentApp, null, 2));
      
      if (!currentApp) {
        console.log("❌ App not found in database");
        return NextResponse.json({ message: 'App not found' }, { status: 404 });
      }

      console.log("🔵 Attempting to update app status from", currentApp.status, "to", status);
      
      const result = await db
        .collection('userapps')
        .updateOne(
          { _id: new ObjectId(params.id) },
          { $set: { status, updatedAt: new Date() } }
        );

      console.log("🔵 Update result:", JSON.stringify(result, null, 2));

      if (result.matchedCount === 0) {
        console.log("❌ No app found to update");
        return NextResponse.json({ message: 'App not found' }, { status: 404 });
      }

      if (result.modifiedCount === 0) {
        console.log("⚠️ App found but no changes made");
        return NextResponse.json({ message: 'No changes made to app status' }, { status: 400 });
      }

      console.log("✅ App status updated successfully");
      try {
        if (currentApp) {
          revalidateTag('launch:list');
          if (currentApp.category) revalidateTag(`launch:category:${currentApp.category}`);
          revalidateTag(`app:${currentApp._id?.toString?.()}`);
          revalidatePath('/launch');
          revalidatePath(`/launch/${currentApp.slug}`);
          if (currentApp.category) {
            const catSlug = String(currentApp.category).toLowerCase().replace(/\s+/g, '-');
            revalidatePath(`/launch/category/${catSlug}`);
          }
        }
      } catch {}
      return NextResponse.json({ message: 'App status updated successfully' }, { status: 200 });
    } else {
      console.log("🔵 Full app update detected");
      
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
        console.log("❌ Missing required fields - name:", !!name, "description:", !!description);
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
        console.log("❌ App not found or unauthorized for user:", session.user.id);
        return NextResponse.json({ message: 'App not found or unauthorized' }, { status: 404 });
      }

      console.log("✅ Full app update successful");
      try {
        revalidateTag('launch:list');
        if (category) revalidateTag(`launch:category:${category}`);
        revalidateTag(`app:${params.id}`);
        revalidatePath('/launch');
        // app slug may change, we cannot reliably revalidate that path here
      } catch {}
      return NextResponse.json({ message: 'App updated successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error("❌ Error in PUT route:", error);
    console.error("❌ Error stack:", (error as Error)?.stack);
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