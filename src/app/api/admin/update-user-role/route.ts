import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "../../../../lib/auth";
import { dbObject } from "../../../../lib/mongodb";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check if current user is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userEmail, newRole } = await request.json();

    if (!userEmail || !newRole) {
      return NextResponse.json({ error: 'Missing userEmail or newRole' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['user', 'admin', 'moderator'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update user role in database
    const usersCollection = dbObject.collection('user');
    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: { role: newRole } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${userEmail} role updated to ${newRole}` 
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 