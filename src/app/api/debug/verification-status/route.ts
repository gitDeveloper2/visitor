import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const url = new URL(request.url);
    const appId = url.searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ message: 'App ID is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(appId)) {
      return NextResponse.json({ message: 'Invalid App ID format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get the app directly from database
    const app = await db.collection('userapps').findOne({ 
      _id: new ObjectId(appId),
      authorId: session.user.id // Ensure user can only see their own apps
    });

    if (!app) {
      return NextResponse.json({ 
        message: 'App not found or access denied',
        appId,
        userId: session.user.id
      }, { status: 404 });
    }

    return NextResponse.json({
      app: {
        _id: app._id,
        name: app.name,
        authorId: app.authorId,
        verificationStatus: app.verificationStatus,
        verificationScore: app.verificationScore,
        verificationAttempts: app.verificationAttempts,
        lastVerificationMethod: app.lastVerificationMethod,
        lastVerificationAttempt: app.lastVerificationAttempt,
        updatedAt: app.updatedAt,
        createdAt: app.createdAt
      },
      debug: {
        userId: session.user.id,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Debug verification status error:', error);
    return NextResponse.json(
      { message: 'Failed to get verification status', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 