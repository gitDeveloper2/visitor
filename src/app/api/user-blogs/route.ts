import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { title, content, tags, isInternal } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const newBlog = {
      title,
      content,
      tags: tags || [],
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      isInternal: !!isInternal,
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
    const { db } = await connectToDatabase();

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');

    const filter: any = {};
    if (status) filter.status = status;
    if (authorId) filter.authorId = authorId;

    const blogs = await db
      .collection('userblogs')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch blogs.', error: error?.toString() }, { status: 500 });
  }
}
