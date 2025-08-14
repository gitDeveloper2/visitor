import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateVerificationBadgeHtml } from '@/components/badges/VerificationBadge';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const appId = params.id;
    if (!ObjectId.isValid(appId)) {
      return NextResponse.json({ message: 'Invalid app ID format' }, { status: 400 });
    }

    const { verificationUrl } = await request.json();
    
    if (!verificationUrl) {
      return NextResponse.json({ message: 'Verification URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(verificationUrl);
    } catch {
      return NextResponse.json({ message: 'Invalid URL format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Find the app and verify ownership
    const app = await db.collection('userapps').findOne({
      _id: new ObjectId(appId),
      authorId: session.user.id,
    });

    if (!app) {
      return NextResponse.json({ message: 'App not found or access denied' }, { status: 404 });
    }

    // Check if app requires verification (free apps only)
    if (app.pricing !== 'Free' && app.pricing !== 'free') {
      return NextResponse.json({ 
        message: 'Verification is only required for free apps' 
      }, { status: 400 });
    }

    // Check if already verified
    if (app.verificationStatus === 'verified') {
      return NextResponse.json({ 
        message: 'App is already verified' 
      }, { status: 400 });
    }

    // Generate verification badge HTML
    const appUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launch/${app.slug}`;
    const badgeHtml = generateVerificationBadgeHtml(app.name, appUrl, 'default', 'light');

    // Update app with verification request
    const updateResult = await db.collection('userapps').updateOne(
      { _id: new ObjectId(appId) },
      {
        $set: {
          verificationStatus: 'pending',
          verificationUrl: verificationUrl,
          verificationSubmittedAt: new Date(),
          verificationBadgeHtml: badgeHtml,
          requiresVerification: true,
          updatedAt: new Date(),
        },
        $inc: { verificationAttempts: 1 }
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: 'Failed to update app' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Verification request submitted successfully',
      verificationUrl: verificationUrl,
      badgeHtml: badgeHtml,
      status: 'pending'
    });

  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json(
      { message: 'Failed to submit verification request' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const appId = params.id;
    if (!ObjectId.isValid(appId)) {
      return NextResponse.json({ message: 'Invalid app ID format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get verification status
    const app = await db.collection('userapps').findOne(
      { _id: new ObjectId(appId), authorId: session.user.id },
      { 
        projection: { 
          verificationStatus: 1, 
          verificationUrl: 1, 
          verificationSubmittedAt: 1,
          verificationCheckedAt: 1,
          verificationAttempts: 1,
          verificationBadgeHtml: 1,
          requiresVerification: 1,
          name: 1,
          slug: 1,
          pricing: 1
        } 
      }
    );

    if (!app) {
      return NextResponse.json({ message: 'App not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      verificationStatus: app.verificationStatus || 'not_required',
      verificationUrl: app.verificationUrl,
      verificationSubmittedAt: app.verificationSubmittedAt,
      verificationCheckedAt: app.verificationCheckedAt,
      verificationAttempts: app.verificationAttempts || 0,
      verificationBadgeHtml: app.verificationBadgeHtml,
      requiresVerification: app.requiresVerification || false,
      appName: app.name,
      appSlug: app.slug,
      pricing: app.pricing
    });

  } catch (error) {
    console.error('Error getting verification status:', error);
    return NextResponse.json(
      { message: 'Failed to get verification status' },
      { status: 500 }
    );
  }
}
