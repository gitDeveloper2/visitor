import { NextRequest, NextResponse } from "next/server";
import dbConnect from '../../../lib/config/mongodb';
import App from '../../../models/App';
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
    const apps = await App.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ apps }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch apps.', error: error?.toString() }, { status: 500 });
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
    const app = await App.findByIdAndUpdate(id, { status: action === 'approve' ? 'approved' : 'rejected' }, { new: true });
    if (!app) {
      return NextResponse.json({ message: 'App not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: `App ${action}d.`, app }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update app.', error: error?.toString() }, { status: 500 });
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
      return NextResponse.json({ message: 'App id required.' }, { status: 400 });
    }
    await dbConnect();
    await App.findByIdAndDelete(id);
    return NextResponse.json({ message: 'App deleted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete app.', error: error?.toString() }, { status: 500 });
  }
}
