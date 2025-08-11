import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { generateUniqueSlug } from '../../../utils/slugGenerator';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { 
      title, 
      content, 
      tags, 
      isInternal,
      author, // from form
      role, // from form
      authorBio, // from form
      founderUrl, // from form
      isFounderStory // from form
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // If not a Founder Story, require an active premium blog subscription
    if (!isFounderStory) {
      console.log('🔒 Checking premium requirement for non-Founder Story blog');
      console.log('👤 User ID:', session.user.id);
      console.log('📧 User Email:', session.user.email);
      
      // Check if the collection exists
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(col => col.name);
      console.log('📚 Available collections:', collectionNames);
      
      if (!collectionNames.includes('blog_premium_access')) {
        console.log('⚠️ blog_premium_access collection not found - creating it');
        await db.createCollection('blog_premium_access');
      }
      
      // Check what's in the collection
      const allSubs = await db.collection('blog_premium_access').find({}).toArray();
      console.log('📊 All subscriptions in collection:', allSubs);
      
      const activeSub = await db.collection('blog_premium_access').findOne({
        userId: session.user.id,
        status: 'active',
        expiresAt: { $gt: new Date() },
      });
      
      console.log('💳 Active subscription found:', activeSub);
      
      if (!activeSub) {
        console.log('❌ No active premium subscription found - blocking submission');
        return NextResponse.json(
          { message: 'Premium subscription required to submit non-Founder Story blogs.' },
          { status: 402 }
        );
      }
      
      console.log('✅ Premium subscription validated - allowing submission');
    } else {
      console.log('🚀 Founder Story detected - no premium required');
    }

    // Generate a unique slug for the blog
    const existingSlugs = await db
      .collection('userblogs')
      .find({}, { projection: { slug: 1 } })
      .toArray();
    
    const existingSlugStrings = existingSlugs.map(blog => blog.slug);
    const slug = generateUniqueSlug(title, existingSlugStrings);

    const newBlog = {
      title,
      slug, // Add the generated slug
      content,
      tags: tags || [],
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      // Additional fields from form
      author: author || session.user.name,
      role: role || 'Author',
      authorBio: authorBio || '',
      founderUrl: founderUrl || '',
      isInternal: isInternal || isFounderStory || false,
      // Metadata for display
      readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200), // ~200 words per minute
      views: 0,
      likes: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('userblogs').insertOne(newBlog);

    return NextResponse.json(
      { message: 'Blog submitted successfully.', blog: { _id: result.insertedId, ...newBlog } },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Blog submission failed.', error: error?.toString() }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const tag = url.searchParams.get('tag');
    const approved = url.searchParams.get('approved');

    const filter: any = {};
    
    // If no specific authorId is provided, filter by current user
    if (authorId) {
      filter.authorId = authorId;
    } else if (approved !== 'true') {
      // Only show user's own blogs unless specifically requesting approved blogs
      filter.authorId = session.user.id;
    }
    
    if (status) filter.status = status;
    if (tag) filter.tags = { $in: [tag] };
    if (approved === 'true') filter.status = 'approved';

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
    return NextResponse.json({ message: 'Failed to fetch blogs.', error: error?.toString() }, { status: 500 });
  }
}
