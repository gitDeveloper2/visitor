import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "../../../../lib/auth";
import { dbObject } from "../../../../lib/mongodb";

function requireAdmin(session: any) {
	return session?.user?.role === 'admin';
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession();
		if (!requireAdmin(session)) {
			return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
		}

		const url = new URL(request.url);
		const q = url.searchParams.get('q')?.trim().toLowerCase();
		const limit = Number(url.searchParams.get('limit') || 50);
		const skip = Number(url.searchParams.get('skip') || 0);

		const usersCol = dbObject.collection('user');
		const filter: any = {};
		if (q) {
			filter.$or = [
				{ email: { $regex: q, $options: 'i' } },
				{ name: { $regex: q, $options: 'i' } },
			];
		}

		const cursor = usersCol.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
		const users = await cursor.toArray();
		const total = await usersCol.countDocuments(filter);

		return NextResponse.json({ users, total }, { status: 200 });
	} catch (error) {
		console.error('GET /api/admin/users error:', error);
		return NextResponse.json({ message: 'Failed to fetch users.', error: String(error) }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const session = await getServerSession();
		if (!requireAdmin(session)) {
			return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
		}

		const { email, role, suspended } = await request.json();
		if (!email) {
			return NextResponse.json({ message: 'email is required.' }, { status: 400 });
		}

		const update: any = {};
		if (role) update.role = role;
		if (typeof suspended === 'boolean') update.suspended = suspended;
		if (Object.keys(update).length === 0) {
			return NextResponse.json({ message: 'No updates provided.' }, { status: 400 });
		}

		const usersCol = dbObject.collection('user');
		const result = await usersCol.updateOne({ email }, { $set: update });
		if (result.matchedCount === 0) {
			return NextResponse.json({ message: 'User not found.' }, { status: 404 });
		}

		return NextResponse.json({ message: 'User updated.' }, { status: 200 });
	} catch (error) {
		console.error('PATCH /api/admin/users error:', error);
		return NextResponse.json({ message: 'Failed to update user.', error: String(error) }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession();
		if (!requireAdmin(session)) {
			return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
		}

		const { email } = await request.json();
		if (!email) {
			return NextResponse.json({ message: 'email is required.' }, { status: 400 });
		}

		const usersCol = dbObject.collection('user');
		const result = await usersCol.deleteOne({ email });
		if (result.deletedCount === 0) {
			return NextResponse.json({ message: 'User not found.' }, { status: 404 });
		}

		return NextResponse.json({ message: 'User deleted.' }, { status: 200 });
	} catch (error) {
		console.error('DELETE /api/admin/users error:', error);
		return NextResponse.json({ message: 'Failed to delete user.', error: String(error) }, { status: 500 });
	}
}