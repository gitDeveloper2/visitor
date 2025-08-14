import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    console.log('🔄 Starting verification attempts migration...');
    
    // Find all apps with legacy verificationAttempts (number instead of array)
    const legacyApps = await db.collection('userapps').find({
      verificationAttempts: { $type: 'number' }
    }).toArray();
    
    console.log(`📦 Found ${legacyApps.length} apps with legacy verificationAttempts format`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const app of legacyApps) {
      try {
        const legacyAttempts = app.verificationAttempts as number;
        
        // Convert legacy number to empty array (since we can't reconstruct the attempt history)
        await db.collection('userapps').updateOne(
          { _id: app._id },
          { 
            $set: { 
              verificationAttempts: [],
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`✅ Migrated app ${app.name} (${app._id}): ${legacyAttempts} → []`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ Failed to migrate app ${app._id}:`, error);
        errorCount++;
      }
    }
    
    // Also find apps with no verificationAttempts field and initialize them
    const appsWithoutAttempts = await db.collection('userapps').find({
      verificationAttempts: { $exists: false }
    }).toArray();
    
    console.log(`📦 Found ${appsWithoutAttempts.length} apps without verificationAttempts field`);
    
    for (const app of appsWithoutAttempts) {
      try {
        await db.collection('userapps').updateOne(
          { _id: app._id },
          { 
            $set: { 
              verificationAttempts: [],
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`✅ Initialized verificationAttempts for app ${app.name} (${app._id})`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ Failed to initialize app ${app._id}:`, error);
        errorCount++;
      }
    }
    
    // Get final stats
    const totalApps = await db.collection('userapps').countDocuments({});
    const appsWithArrayAttempts = await db.collection('userapps').countDocuments({
      verificationAttempts: { $type: 'array' }
    });
    const appsWithNumberAttempts = await db.collection('userapps').countDocuments({
      verificationAttempts: { $type: 'number' }
    });
    
    console.log('📊 Migration completed');
    console.log(`- Total apps: ${totalApps}`);
    console.log(`- Apps with array attempts: ${appsWithArrayAttempts}`);
    console.log(`- Apps with number attempts: ${appsWithNumberAttempts}`);
    console.log(`- Migrated: ${migratedCount}`);
    console.log(`- Errors: ${errorCount}`);
    
    return NextResponse.json({
      message: 'Verification attempts migration completed',
      summary: {
        totalApps,
        appsWithArrayAttempts,
        appsWithNumberAttempts,
        migratedCount,
        errorCount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
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