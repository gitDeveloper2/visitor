import { NextRequest, NextResponse } from "next/server";
import { dbObject } from "../../../lib/mongodb";

export async function POST(request: NextRequest) {
  try {
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
      message: `User ${userEmail} role updated to ${newRole}`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 