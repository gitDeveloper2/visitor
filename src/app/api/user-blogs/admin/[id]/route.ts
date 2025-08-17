import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';
import { getSession } from '@/features/shared/utils/auth';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    if (!params.id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // Find blog by ObjectId for admin/editing purposes
    const blog = await db
      .collection('userblogs')
      .findOne({ _id: new ObjectId(params.id) });

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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    if (!params.id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const { 
      title, 
      content, 
      subcategories, 
      isInternal,
      author,
      role,
      authorBio,
      founderUrl,
      isFounderStory
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Check if the blog exists and belongs to the user
    const existingBlog = await db
      .collection('userblogs')
      .findOne({ _id: new ObjectId(params.id) });

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
      subcategories: subcategories || [],
      isFounderStory: isFounderStory || false,
      isInternal: isInternal || isFounderStory || false,
      // Additional fields from form
      author: author || session.user.name,
      role: role || 'Author',
      authorBio: authorBio || '',
      founderUrl: founderUrl || '',
      // Update metadata
      readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200),
      updatedAt: new Date(),
    };

    const result = await db
      .collection('userblogs')
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ message: 'Failed to update blog.', error: error?.toString() }, { status: 500 });
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