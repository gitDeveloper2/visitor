import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: session.user.id });
    
    // if (!user?.isAdmin) {
    //   return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    // }

    console.log('🔄 Starting verification system migration...');

    // Step 1: Update all free apps to require verification
    const freeAppsUpdate = await db.collection('userapps').updateMany(
      { 
        pricing: { $in: ['Free', 'free', 'FREE'] },
        requiresVerification: { $ne: true }
      },
      { 
        $set: { 
          requiresVerification: true,
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Updated ${freeAppsUpdate.modifiedCount} free apps to require verification`);

    // Step 2: Set verification status for apps that don't have it
    const noStatusUpdate = await db.collection('userapps').updateMany(
      { 
        verificationStatus: { $exists: false },
        requiresVerification: true
      },
      { 
        $set: { 
          verificationStatus: 'pending',
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Set verification status for ${noStatusUpdate.modifiedCount} apps`);

    // Step 3: Update apps that have verification URLs but no status
    const hasUrlUpdate = await db.collection('userapps').updateMany(
      { 
        verificationUrl: { $exists: true, $ne: null, $ne: '' },
        verificationStatus: { $exists: false },
        requiresVerification: true
      },
      { 
        $set: { 
          verificationStatus: 'pending',
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Updated ${hasUrlUpdate.modifiedCount} apps with verification URLs`);

    // Step 4: Set verification scores for apps without them
    const noScoreUpdate = await db.collection('userapps').updateMany(
      { 
        verificationScore: { $exists: false },
        requiresVerification: true
      },
      { 
        $set: { 
          verificationScore: 0,
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Set verification scores for ${noScoreUpdate.modifiedCount} apps`);

    // Step 5: Initialize verification attempts array for apps without it
    const noAttemptsUpdate = await db.collection('userapps').updateMany(
      { 
        verificationAttempts: { $exists: false },
        requiresVerification: true
      },
      { 
        $set: { 
          verificationAttempts: [],
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Initialized verification attempts for ${noAttemptsUpdate.modifiedCount} apps`);

    // Get final counts
    const finalStats = await db.collection('userapps').aggregate([
      {
        $match: { requiresVerification: true }
      },
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const totalRequiringVerification = await db.collection('userapps').countDocuments({
      requiresVerification: true
    });

    console.log('✅ Migration completed successfully');

    return NextResponse.json({
      message: 'Verification system migration completed',
      timestamp: new Date().toISOString(),
      migrationResults: {
        freeAppsUpdated: freeAppsUpdate.modifiedCount,
        statusSet: noStatusUpdate.modifiedCount,
        urlAppsUpdated: hasUrlUpdate.modifiedCount,
        scoresSet: noScoreUpdate.modifiedCount,
        attemptsInitialized: noAttemptsUpdate.modifiedCount
      },
      finalStats: {
        totalRequiringVerification,
        statusBreakdown: finalStats
      }
    });

  } catch (error) {
    console.error('💥 Migration error:', error);
    return NextResponse.json(
      { 
        message: 'Migration failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: session.user.id });
    
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    // Get current state for migration planning
    const currentState = await db.collection('userapps').aggregate([
      {
        $group: {
          _id: null,
          totalApps: { $sum: 1 },
          freeApps: {
            $sum: {
              $cond: [
                { $in: ['$pricing', ['Free', 'free', 'FREE']] },
                1,
                0
              ]
            }
          },
          appsWithVerificationStatus: {
            $sum: {
              $cond: [
                { $exists: ['$verificationStatus', true] },
                1,
                0
              ]
            }
          },
          appsWithRequiresVerification: {
            $sum: {
              $cond: [
                { $eq: ['$requiresVerification', true] },
                1,
                0
              ]
            }
          },
          appsWithVerificationScore: {
            $sum: {
              $cond: [
                { $exists: ['$verificationScore', true] },
                1,
                0
              ]
            }
          }
        }
      }
    ]).toArray();

    return NextResponse.json({
      message: 'Current verification system state',
      timestamp: new Date().toISOString(),
      currentState: currentState[0] || {}
    });

  } catch (error) {
    console.error('💥 Migration status check error:', error);
    return NextResponse.json(
      { 
        message: 'Migration status check failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 