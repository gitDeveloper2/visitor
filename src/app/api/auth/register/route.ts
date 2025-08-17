import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { dbObject } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, bio, jobTitle, websiteUrl, twitterUsername, linkedinUsername } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Create user with better-auth
    const result = await auth.signUp.email({
      email,
      password,
      name,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Update user with profile information
    if (result.user) {
      const { db } = await dbObject();
      await db.collection('users').updateOne(
        { _id: result.user.id },
        {
          $set: {
            bio: bio || "",
            jobTitle: jobTitle || "",
            websiteUrl: websiteUrl || "",
            twitterUsername: twitterUsername || "",
            linkedinUsername: linkedinUsername || "",
          }
        }
      );
    }

    return NextResponse.json({ 
      message: 'User registered successfully',
      user: result.user 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 