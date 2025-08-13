import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';
import { verifyAppPremiumStatus, revokeInvalidPremiumStatus } from '../../../../utils/premiumVerification';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get apps marked as premium and approved
    let featuredApps = await db
      .collection('userapps')
      .find({ 
        isPremium: true, 
        status: 'approved' 
      })
      .sort({ 
        isPremium: -1, // Premium apps first
        createdAt: -1  // Then by creation date
      })
      .limit(6) // Limit to 6 featured apps
      .toArray();

    console.log(`📦 Retrieved ${featuredApps.length} apps before payment verification`);

    // CRITICAL: Verify premium status against actual payment records
    console.log("🔒 Verifying premium status against payment records...");
    
    const verifiedApps = [];
    for (const app of featuredApps) {
      // Check if there's a valid payment record
      const verification = await verifyAppPremiumStatus(db, app._id.toString(), app.authorId);
      if (verification.isValid) {
        verifiedApps.push(app);
      } else {
        console.log(`⚠️ App ${app._id} marked as premium but no valid payment found - removing premium status`);
        // Remove premium status from apps without valid payments
        await revokeInvalidPremiumStatus(db, app._id.toString(), verification.reason || 'No valid payment record found');
      }
    }
    
    featuredApps = verifiedApps;
    console.log(`✅ After payment verification: ${featuredApps.length} apps remain`);

    return NextResponse.json({ 
      apps: featuredApps,
      total: featuredApps.length
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error fetching featured apps:", error);
    return NextResponse.json({ 
      message: 'Failed to fetch featured apps.', 
      error: error?.toString() 
    }, { status: 500 });
  }
} 