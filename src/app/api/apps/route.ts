import { NextRequest, NextResponse } from "next/server";
import dbConnect from '../../../lib/config/mongodb';
import App from '../../../models/App';
import { getServerSession } from "../../../lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
  }
  try {
    const { name, description, badges } = await request.json();
    if (!name || !description) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    await dbConnect();
    const newApp = await App.create({
      name,
      description,
      author: session.user.email || session.user.name,
      badges: badges || [],
      status: 'pending',
    });
    return NextResponse.json({ message: 'App submitted successfully.', app: newApp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'App submission failed.', error: error?.toString() }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const author = url.searchParams.get('author');
    const filter: any = {};
    if (status) filter.status = status;
    if (author) filter.author = author;
    const apps = await App.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ apps }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch apps.', error: error?.toString() }, { status: 500 });
  }
}
