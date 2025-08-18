import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';
import { getSession } from '@/features/shared/utils/auth';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    if (!params.slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    // Find blog by slug and only return approved blogs for public access
    console.log("connecting to db",params.slug)

    const blog = await db
      .collection('userblogs')
      .findOne({ 
        slug: params.slug,
        status: 'approved' // Only show approved blogs publicly
      });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch blog.', error: error?.toString() }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    if (!params.slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    const { 
      title, 
      content, 
      tags, 
      isInternal,
      author,
      role,
      authorBio,
      excerpt,
      founderUrl,
      isFounderStory
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Check if the blog exists and belongs to the user
    const existingBlog = await db
      .collection('userblogs')
      .findOne({ slug: params.slug });

    if (!existingBlog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    // Only allow editing if the blog belongs to the current user
    if (existingBlog.authorId !== session.user.id) {
      return NextResponse.json({ message: 'You can only edit your own blogs' }, { status: 403 });
    }

    // Only allow editing if the blog is still pending
    if (existingBlog.status !== 'pending') {
      return NextResponse.json({ message: 'You can only edit blogs that are pending approval' }, { status: 400 });
    }

    const updateData = {
      title,
      content,
      tags: tags || [],
      isInternal: isInternal || isFounderStory || false,
      // Additional fields from form
      author: author || session.user.name,
      role: role || 'Author',
      authorBio: authorBio || '',
      excerpt: excerpt || '',
      founderUrl: founderUrl || '',
      // Update metadata
      readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200),
      updatedAt: new Date(),
    };

    const result = await db
      .collection('userblogs')
      .updateOne(
        { slug: params.slug },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update blog.', error: error?.toString() }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    if (!params.slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    const { status } = await request.json();

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const result = await db
      .collection('userblogs')
      .updateOne(
        { slug: params.slug },
        { $set: { status, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog status updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update blog.', error: error?.toString() }, { status: 500 });
  }
} 