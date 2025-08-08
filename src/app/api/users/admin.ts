import { NextResponse } from 'next/server';
import dbConnect, { User } from '../../../lib/config/mongodb';
import { getServerSession } from 'next-auth';

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
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users.', error: error?.toString() }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!await isAdmin(session)) {
    return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
  }
  try {
    const { id, action } = await request.json();
    if (!id || !['ban', 'unban'].includes(action)) {
      return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findByIdAndUpdate(id, { status: action === 'ban' ? 'banned' : 'active' }, { new: true });
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: `User ${action}ned.`, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update user.', error: error?.toString() }, { status: 500 });
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
      return NextResponse.json({ message: 'User id required.' }, { status: 400 });
    }
    await dbConnect();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete user.', error: error?.toString() }, { status: 500 });
  }
}
