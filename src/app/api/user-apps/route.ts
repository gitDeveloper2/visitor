import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }
    
    const { 
      name, 
      description, 
      tags, 
      isInternal,
      // Additional fields for better app data
      website,
      github,
      category,
      techStack,
      pricing,
      features
    } = await request.json();
    
    if (!name || !description) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const newApp = {
      name,
      description,
      tags: tags || [],
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      isInternal: !!isInternal,
      // Additional metadata
      website: website || '',
      github: github || '',
      category: category || 'Other',
      techStack: techStack || [],
      pricing: pricing || 'Free',
      features: features || [],
      // Display metadata
      views: 0,
      likes: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('userapps').insertOne(newApp);
    return NextResponse.json(
      { message: 'App submitted successfully.', app: { _id: result.insertedId, ...newApp } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'App submission failed.', error: error?.toString() }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    console.log("💾 Connected DB:", db.databaseName);
console.log("📚 Collections:", await db.listCollections().toArray());
console.log("🔍 First doc in userapps:", await db.collection('userapps').findOne({}));

    const url = new URL(request.url);

    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const tag = url.searchParams.get('tag');
    const approved = url.searchParams.get('approved');

    // Log incoming query params
    console.log("🔍 Query Params:", {
      status,
      authorId,
      limit,
      page,
      tag,
      approved
    });

    const filter: any = {};
    
    if (status) filter.status = status;
    if (authorId) filter.authorId = authorId;
    if (tag) filter.tags = { $in: [tag] };
    if (approved === 'true') filter.status = 'approved';

    // Log final filter before query
    console.log("🗂️ MongoDB Filter:", JSON.stringify(filter, null, 2));

    const skip = (page - 1) * limit;

    const apps = await db
      .collection('userapps')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log(`📦 Retrieved ${apps.length} apps`);

    // Get total count for pagination
    const totalCount = await db.collection('userapps').countDocuments(filter);
    console.log(`📊 Total Count: ${totalCount}`);

    return NextResponse.json({ 
      apps,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching apps:", error);
    return NextResponse.json({ 
      message: 'Failed to fetch apps.', 
      error: error?.toString() 
    }, { status: 500 });
  }
}

