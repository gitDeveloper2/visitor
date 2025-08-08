import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }
    const { name, description, tags, isInternal } = await request.json();
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
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');
    const filter: any = {};
    if (status) filter.status = status;
    if (authorId) filter.authorId = authorId;
    const apps = await db
      .collection('userapps')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ apps }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch apps.', error: error?.toString() }, { status: 500 });
  }
}
