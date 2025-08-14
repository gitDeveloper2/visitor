import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { verifyPendingApps, verifyAppBadge } from '../../../../utils/verificationService';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

// Import types from verificationService
interface VerificationScore {
  total: number;
  linkScore: number;
  textScore: number;
  dofollowScore: number;
  accessibilityScore: number;
  status: 'pending' | 'verified' | 'needs_review' | 'failed';
  details: {
    hasLink: boolean;
    hasCorrectUrl: boolean;
    hasCorrectText: boolean;
    isDofollow: boolean;
    isAccessible: boolean;
    linkCount: number;
    textMatches: string[];
    errors: string[];
  };
}

interface VerificationAttempt {
  attempt: number;
  method: 'static' | 'rendered' | 'admin_review' | 'admin_override';
  score: VerificationScore;
  timestamp: Date;
  details: string;
}

export async function POST(request: Request) {
  console.log('🔹 POST /api/admin/verify called');

  try {
    console.log('📌 Step 1: Getting session...');
    const session = await getSession();
    console.log('✅ Session result:', session);

    if (!session?.user) {
      console.warn('❌ No authenticated user found.');
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    console.log('📌 Step 2: Connecting to DB...');
    const { db } = await connectToDatabase();

    console.log('📌 Step 3: Fetching user from DB...');
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
    console.log('✅ User from DB:', user);

    // if (!user?.isAdmin) {
    //   console.warn('❌ User is not admin:', user);
    //   return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    // }

    console.log("💾 Admin POST DB:", db.databaseName);
    console.log("🔗 Admin POST DB connection string:", process.env.MONGODB_URI?.split('@')[1] || 'hidden');
    
    const requestBody = await request.json();
    const { appId, action, verificationUrl, overrideStatus, overrideScore, overrideReason } = requestBody;
    console.log('📌 Step 4: Request body:', { appId, action, verificationUrl, overrideStatus, overrideScore, overrideReason });

    if (action === 'verify-single' && appId) {
      console.log('📌 Step 5: Verifying single app...');
      if (!ObjectId.isValid(appId)) {
        console.warn('❌ Invalid ObjectId:', appId);
        return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
      }

      console.log('📌 Step 6: Calling verifyAppBadge...');
      const result = await verifyAppBadge(appId);
      console.log('✅ verifyAppBadge result:', result);

      // Get app details for better response
      const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
      
      return NextResponse.json({
        message: 'Verification completed',
        appId,
        appName: app?.name || 'Unknown App',
        result,
        score: result.score,
        status: result.score.status,
        nextAction: getNextAction(result.score.status, result.attempt)
      });

    } else if (action === 'verify-all') {
      console.log('📌 Step 5: Verifying all pending apps...');
      const results = await verifyPendingApps();
      console.log(`✅ verifyPendingApps processed ${results.length} apps`, results);

      // Calculate summary statistics
      const summary = {
        total: results.length,
        verified: results.filter(r => r.score?.status === 'verified').length,
        needsReview: results.filter(r => r.score?.status === 'needs_review').length,
        failed: results.filter(r => r.score?.status === 'failed').length,
        averageScore: results.reduce((sum, r) => sum + (r.score?.total || 0), 0) / results.length
      };

      return NextResponse.json({
        message: 'Batch verification completed',
        totalProcessed: results.length,
        summary,
        results: results.slice(0, 10) // Return first 10 results for logging
      });

    } else if (action === 'manual-verify' && appId && verificationUrl) {
      console.log('📌 Step 5: Manual verification with custom URL...');
      if (!ObjectId.isValid(appId)) {
        console.warn('❌ Invalid ObjectId:', appId);
        return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
      }

      // Update the app with the new verification URL
      await db.collection('userapps').updateOne(
        { _id: new ObjectId(appId) },
        { 
          $set: { 
            verificationUrl: verificationUrl,
            verificationSubmittedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );

      // Now verify with the new URL
      const result = await verifyAppBadge(appId);
      console.log('✅ Manual verification result:', result);

      const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
      
      return NextResponse.json({
        message: 'Manual verification completed',
        appId,
        appName: app?.name || 'Unknown App',
        verificationUrl,
        result,
        score: result.score,
        status: result.score.status,
        nextAction: getNextAction(result.score.status, result.attempt)
      });

    } else if (action === 'admin-override' && appId) {
      console.log('📌 Step 5: Admin override verification result...');
      if (!ObjectId.isValid(appId)) {
        console.warn('❌ Invalid ObjectId:', appId);
        return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
      }

      // overrideStatus, overrideScore, overrideReason are already extracted from requestBody above
      
      // Validate override parameters
      if (!['verified', 'failed', 'needs_review'].includes(overrideStatus)) {
        return NextResponse.json({ message: 'Invalid override status' }, { status: 400 });
      }

      if (overrideScore && (overrideScore < 0 || overrideScore > 100)) {
        return NextResponse.json({ message: 'Invalid override score (0-100)' }, { status: 400 });
      }

      // Create admin override attempt
      const adminOverrideAttempt: VerificationAttempt = {
        attempt: 999, // Special number for admin overrides
        method: 'admin_override',
        score: {
          total: overrideScore || (overrideStatus === 'verified' ? 100 : 0),
          linkScore: overrideStatus === 'verified' ? 40 : 0,
          textScore: overrideStatus === 'verified' ? 30 : 0,
          dofollowScore: overrideStatus === 'verified' ? 20 : 0,
          accessibilityScore: overrideStatus === 'verified' ? 10 : 0,
          status: overrideStatus,
          details: {
            hasLink: overrideStatus === 'verified',
            hasCorrectUrl: overrideStatus === 'verified',
            hasCorrectText: overrideStatus === 'verified',
            isDofollow: overrideStatus === 'verified',
            isAccessible: overrideStatus === 'verified',
            linkCount: 0,
            textMatches: [],
            errors: []
          }
        },
        timestamp: new Date(),
        details: `Admin override: ${overrideStatus}${overrideScore ? ` (${overrideScore}/100)` : ''}${overrideReason ? ` - ${overrideReason}` : ''}`
      };

      // Update app with admin override
      const updateResult = await db.collection('userapps').updateOne(
        { _id: new ObjectId(appId) },
        { 
          $set: { 
            verificationStatus: overrideStatus,
            verificationScore: overrideScore || (overrideStatus === 'verified' ? 100 : 0),
            isVerified: overrideStatus === 'verified',
            lastVerificationMethod: 'admin_override',
            lastVerificationAttempt: 999,
            updatedAt: new Date()
          },
          $push: { verificationAttempts: adminOverrideAttempt as any }
        }
      );
      
      console.log('✅ Database update result:', updateResult);
      console.log('📝 Modified count:', updateResult.modifiedCount);

      const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
      console.log('🔍 App after update:', {
        _id: app?._id,
        name: app?.name,
        verificationStatus: app?.verificationStatus,
        verificationScore: app?.verificationScore,
        authorId: app?.authorId
      });
      
      return NextResponse.json({
        message: 'Admin override completed',
        appId,
        appName: app?.name || 'Unknown App',
        overrideStatus,
        overrideScore,
        overrideReason,
        nextAction: getNextAction(overrideStatus, 999)
      });

    } else {
      console.warn('❌ Invalid action:', action);
      return NextResponse.json({ 
        message: 'Invalid action. Use "verify-single", "verify-all", "manual-verify", or "admin-override"' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('💥 Admin verification error:', error);
    return NextResponse.json(
      { message: 'Verification failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  console.log('🔹 GET /api/admin/verify called');

  try {
    console.log('📌 Step 1: Getting session...');
    const session = await getSession();
    console.log('✅ Session result:', session);

    if (!session?.user) {
      console.warn('❌ No authenticated user found.');
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    console.log('📌 Step 2: Connecting to DB...');
    const { db } = await connectToDatabase();

    console.log('📌 Step 3: Fetching user from DB...');
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
    console.log('✅ User from DB:', user);

    // if (!user?.isAdmin) {
    //   console.warn('❌ User is not admin:', user);
    //   return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    // }

    console.log('📌 Step 4: Aggregating verification stats...');
    const stats = await db.collection('userapps').aggregate([
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 },
          avgScore: { $avg: '$verificationScore' }
        }
      }
    ]).toArray();
    console.log('✅ Stats aggregation result:', stats);

    console.log('📌 Step 5: Fetching apps by verification status...');
    const [pendingApps, needsReviewApps, failedApps] = await Promise.all([
      // Pending verification
      db.collection('userapps').find({
        verificationStatus: 'pending',
        requiresVerification: true
      }, {
        projection: {
          name: 1,
          verificationUrl: 1,
          verificationSubmittedAt: 1,
          verificationAttempts: 1,
          pricing: 1,
          authorName: 1,
          slug: 1,
          verificationScore: 1
        }
      }).sort({ verificationSubmittedAt: 1 }).limit(50).toArray(),

      // Needs admin review
      db.collection('userapps').find({
        verificationStatus: 'needs_review',
        requiresVerification: true
      }, {
        projection: {
          name: 1,
          verificationUrl: 1,
          verificationSubmittedAt: 1,
          verificationAttempts: 1,
          pricing: 1,
          authorName: 1,
          slug: 1,
          verificationScore: 1,
          lastVerificationMethod: 1,
          lastVerificationAttempt: 1
        }
      }).sort({ verificationScore: -1 }).limit(50).toArray(),

      // Failed verification
      db.collection('userapps').find({
        verificationStatus: 'failed',
        requiresVerification: true
      }, {
        projection: {
          name: 1,
          verificationUrl: 1,
          verificationSubmittedAt: 1,
          verificationAttempts: 1,
          pricing: 1,
          authorName: 1,
          slug: 1,
          verificationScore: 1,
          lastVerificationMethod: 1,
          lastVerificationAttempt: 1
        }
      }).sort({ verificationAttempts: -1 }).limit(50).toArray()
    ]);

    console.log(`✅ Found ${pendingApps.length} pending, ${needsReviewApps.length} needs review, ${failedApps.length} failed apps`);

    // Calculate detailed statistics
    const detailedStats = {
      total: pendingApps.length + needsReviewApps.length + failedApps.length,
      pending: pendingApps.length,
      needs_review: needsReviewApps.length,
      failed: failedApps.length,
      verified: stats.find(s => s._id === 'verified')?.count || 0,
      not_required: stats.find(s => s._id === 'not_required')?.count || 0,
      averageScores: {
        pending: pendingApps.length > 0 ? pendingApps.reduce((sum, app) => sum + (app.verificationScore || 0), 0) / pendingApps.length : 0,
        needs_review: needsReviewApps.length > 0 ? needsReviewApps.reduce((sum, app) => sum + (app.verificationScore || 0), 0) / needsReviewApps.length : 0,
        failed: failedApps.length > 0 ? failedApps.reduce((sum, app) => sum + (app.verificationScore || 0), 0) / failedApps.length : 0
      }
    };

    return NextResponse.json({
      stats: detailedStats,
      apps: {
        pending: pendingApps,
        needsReview: needsReviewApps,
        failed: failedApps
      }
    });

  } catch (error) {
    console.error('💥 Admin verification stats error:', error);
    return NextResponse.json(
      { message: 'Failed to get verification stats' },
      { status: 500 }
    );
  }
}

// Helper function to get next action based on verification status
function getNextAction(status: string, attempt: number): string {
  switch (status) {
    case 'verified':
      return 'App is now verified and will be displayed with verification badge.';
    case 'failed':
      return attempt >= 3 ? 'App has failed verification after multiple attempts. Contact support for manual review.' : 'App will be retried automatically.';
    case 'needs_review':
      return 'App flagged for admin review. Will be processed within 24 hours.';
    default:
      return 'Verification status updated.';
  }
}
