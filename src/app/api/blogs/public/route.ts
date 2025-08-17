import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { serializeMongoObject } from '@/lib/utils/serialization';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

// Transform database document to BlogPost interface
const transformBlogDocument = (doc: any) => ({
  _id: doc._id.toString(),
  title: doc.title || '',
  content: doc.content || '',
  tags: doc.tags || [],
  authorId: doc.authorId || '',
  authorName: doc.authorName || '',
  authorEmail: doc.authorEmail || '',
  author: doc.author || doc.authorName || '',
  role: doc.role || 'Author',
  authorBio: doc.authorBio || '',
  founderUrl: doc.founderUrl || '',
  isInternal: doc.isInternal || false,
  isFounderStory: doc.isFounderStory || false,
  status: doc.status || 'pending',
  readTime: doc.readTime || Math.ceil((doc.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200),
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  views: doc.views || 0,
  likes: doc.likes || 0,
  slug: doc.slug || '',
  category: doc.category || 'Technology',
  imageUrl: doc.imageUrl || '',
  imagePublicId: doc.imagePublicId || '',
});

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const tag = url.searchParams.get('tag');
    const category = url.searchParams.get('category');
    const approved = url.searchParams.get('approved');
    const founderStories = url.searchParams.get('founderStories');
    const featured = url.searchParams.get('featured');

    const filter: any = {};
    
    // Only show approved blogs for public access
    filter.status = 'approved';
    
    if (status) filter.status = status;
    if (tag) {
      // Use $in operator to find blogs that contain the specific tag in their tags array
      filter.tags = { $in: [tag] };
    }
    if (category) filter.category = category;
    if (founderStories === 'true') filter.isFounderStory = true;
    if (founderStories === 'false') filter.isFounderStory = false;
    if (featured === 'true') filter.featured = true;

    const skip = (page - 1) * limit;

    const rawBlogs = await db
      .collection('userblogs')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Transform the database documents to match BlogPost interface
    const blogs = rawBlogs.map(transformBlogDocument);

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