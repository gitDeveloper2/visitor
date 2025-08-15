import { NextRequest, NextResponse } from "next/server";
import dbConnect from '../../../lib/config/mongodb';
import BlogPost from '../../../models/BlogPost';
import { getServerSession } from "../../../lib/auth";

async function isAdmin(session: any) {
  return session && session.user && session.user.role === 'admin';
}

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!await isAdmin(session)) {
    return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
  }
  try {
    await dbConnect();
    const blogs = await BlogPost.find({}).sort({ date: -1 });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch blogs.', error: error?.toString() }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!await isAdmin(session)) {
    return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
  }
  try {
    const { id, action } = await request.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
    }
    await dbConnect();
    const blog = await BlogPost.findByIdAndUpdate(id, { published: action === 'approve' }, { new: true });
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: `Blog ${action}d.`, blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update blog.', error: error?.toString() }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!await isAdmin(session)) {
    return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
  }
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Blog id required.' }, { status: 400 });
    }
    await dbConnect();
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Blog deleted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete blog.', error: error?.toString() }, { status: 500 });
  }
}
