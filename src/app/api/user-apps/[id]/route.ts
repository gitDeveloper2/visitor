import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
    }

    const app = await db
      .collection('userapps')
      .findOne({ _id: new ObjectId(params.id) });

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
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
    }

    const { status } = await request.json();

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
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
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update app.', error: error?.toString() }, { status: 500 });
  }
} 