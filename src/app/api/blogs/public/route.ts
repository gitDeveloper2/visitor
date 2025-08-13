import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const tag = url.searchParams.get('tag');
    const approved = url.searchParams.get('approved');
    const founderStories = url.searchParams.get('founderStories');

    const filter: any = {};
    
    // Only show approved blogs for public access
    filter.status = 'approved';
    
    if (status) filter.status = status;
    if (tag) filter.tags = { $in: [tag] };
    if (founderStories === 'true') filter.isFounderStory = true;
    if (founderStories === 'false') filter.isFounderStory = false;

    const skip = (page - 1) * limit;

    const blogs = await db
      .collection('userblogs')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('userblogs').countDocuments(filter);

    return NextResponse.json({ 
      blogs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public blogs:', error);
    return NextResponse.json({ message: 'Failed to fetch blogs.', error: error?.toString() }, { status: 500 });
  }
} 