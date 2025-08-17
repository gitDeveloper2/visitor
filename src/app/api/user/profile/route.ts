import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { connectToDatabase, dbObject } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {db} = await connectToDatabase();
    const user = await db.collection('user').findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { bio: 1, jobTitle: 1, websiteUrl: 1, twitterUsername: 1, linkedinUsername: 1 } }
    );

    return NextResponse.json({ profile: user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bio, jobTitle, websiteUrl, twitterUsername, linkedinUsername } = await request.json();
    const {db} = await connectToDatabase();
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          bio: bio || "",
          jobTitle: jobTitle || "",
          websiteUrl: websiteUrl || "",
          twitterUsername: twitterUsername || "",
          linkedinUsername: linkedinUsername || "",
          onboardingCompleted: true, // Mark onboarding as complete
          needsOnboarding: false, // Mark that onboarding is no longer needed
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: { bio, jobTitle, websiteUrl, twitterUsername, linkedinUsername }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 