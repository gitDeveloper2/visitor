import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { verifyPendingApps, verifyAppBadge } from '../../../../utils/verificationService';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

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
    const user = await db.collection('users').findOne({ _id: session.user.id });
    console.log('✅ User from DB:', user);

    const { appId, action } = await request.json();
    console.log('📌 Step 4: Request body:', { appId, action });

    if (action === 'verify-single' && appId) {
      console.log('📌 Step 5: Verifying single app...');
      if (!ObjectId.isValid(appId)) {
        console.warn('❌ Invalid ObjectId:', appId);
        return NextResponse.json({ message: 'Invalid app ID' }, { status: 400 });
      }

      console.log('📌 Step 6: Calling verifyAppBadge...');
      const result = await verifyAppBadge(appId);
      console.log('✅ verifyAppBadge result:', result);

      return NextResponse.json({
        message: 'Verification completed',
        appId,
        result
      });

    } else if (action === 'verify-all') {
      console.log('📌 Step 5: Verifying all pending apps...');
      const results = await verifyPendingApps();
      console.log(`✅ verifyPendingApps processed ${results.length} apps`, results);

      return NextResponse.json({
        message: 'Batch verification completed',
        totalProcessed: results.length,
        results
      });

    } else {
      console.warn('❌ Invalid action:', action);
      return NextResponse.json({ 
        message: 'Invalid action. Use "verify-single" or "verify-all"' 
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
    const user = await db.collection('users').findOne({ _id: session.user.id });
    console.log('✅ User from DB:', user);

    if (!user?.isAdmin) {
      console.warn('❌ User is not admin:', user);
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    console.log('📌 Step 4: Aggregating verification stats...');
    const stats = await db.collection('userapps').aggregate([
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    console.log('✅ Stats aggregation result:', stats);

    console.log('📌 Step 5: Fetching pending apps...');
    const pendingApps = await db.collection('userapps').find({
      verificationStatus: 'pending',
      requiresVerification: true
    }, {
      projection: {
        name: 1,
        verificationUrl: 1,
        verificationSubmittedAt: 1,
        verificationAttempts: 1,
        pricing: 1
      }
    }).toArray();
    console.log(`✅ Found ${pendingApps.length} pending apps`, pendingApps);

    return NextResponse.json({
      stats: stats.reduce((acc, stat) => {
        acc[stat._id || 'not_required'] = stat.count;
        return acc;
      }, {}),
      pendingApps: pendingApps.length,
      pendingAppsList: pendingApps
    });

  } catch (error) {
    console.error('💥 Admin verification stats error:', error);
    return NextResponse.json(
      { message: 'Failed to get verification stats' },
      { status: 500 }
    );
  }
}
