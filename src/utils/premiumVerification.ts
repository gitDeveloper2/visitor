/**
 * Premium Verification Utility
 * 
 * This utility ensures that only apps with valid payment records are marked as premium.
 * It's critical for security and preventing fraud.
 */

import { Db } from 'mongodb';

export interface PremiumVerificationResult {
  isValid: boolean;
  reason?: string;
  paymentType?: 'order' | 'subscription' | 'access';
  paymentId?: string;
  expiresAt?: Date;
}

/**
 * Verifies if an app has a valid premium payment record
 * This is critical for security - only apps with actual payments should be premium
 */
export async function verifyAppPremiumStatus(
  db: Db, 
  appId: string, 
  authorId: string
): Promise<PremiumVerificationResult> {
  try {
    console.log(`🔒 Verifying premium status for app ${appId} by user ${authorId}`);

    // 1. Check premium_app_orders collection for valid payment
    const paymentOrder = await db.collection('premium_app_orders').findOne({
      resourceid: appId,
      userId: authorId,
      status: { $in: ['created', 'active'] }
    });

    if (paymentOrder) {
      console.log(`✅ App ${appId} has valid payment order:`, paymentOrder.orderId);
      return {
        isValid: true,
        paymentType: 'order',
        paymentId: paymentOrder.orderId,
        reason: 'Valid payment order found'
      };
    }

    // 2. Check if there's an active subscription for this app
    const subscription = await db.collection('app_premium_access').findOne({
      appId: appId,
      userId: authorId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (subscription) {
      console.log(`✅ App ${appId} has valid subscription:`, subscription.subscriptionId);
      return {
        isValid: true,
        paymentType: 'subscription',
        paymentId: subscription.subscriptionId,
        expiresAt: subscription.expiresAt,
        reason: 'Valid subscription found'
      };
    }

    // 3. Check if there's a recent premium access record
    const premiumAccess = await db.collection('premium_access').findOne({
      userId: authorId,
      type: 'app_listing',
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (premiumAccess) {
      console.log(`✅ App ${appId} has valid premium access:`, premiumAccess.orderId);
      return {
        isValid: true,
        paymentType: 'access',
        paymentId: premiumAccess.orderId,
        expiresAt: premiumAccess.expiresAt,
        reason: 'Valid premium access found'
      };
    }

    // 4. Check if there's a blog subscription that grants app access
    const blogSubscription = await db.collection('blog_premium_access').findOne({
      userId: authorId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (blogSubscription) {
      console.log(`✅ App ${appId} has access via blog subscription:`, blogSubscription.subscriptionId);
      return {
        isValid: true,
        paymentType: 'subscription',
        paymentId: blogSubscription.subscriptionId,
        expiresAt: blogSubscription.expiresAt,
        reason: 'Valid blog subscription grants app access'
      };
    }

    console.log(`❌ App ${appId} has no valid payment records`);
    return {
      isValid: false,
      reason: 'No valid payment records found'
    };

  } catch (error) {
    console.error(`❌ Error verifying premium status for app ${appId}:`, error);
    return {
      isValid: false,
      reason: `Verification error: ${error.message}`
    };
  }
}

/**
 * Revokes premium status from an app that has no valid payment
 */
export async function revokeInvalidPremiumStatus(
  db: Db, 
  appId: string, 
  reason: string = 'No valid payment record found'
): Promise<void> {
  try {
    await db.collection('userapps').updateOne(
      { _id: appId },
      { 
        $set: { 
          isPremium: false, 
          premiumStatus: 'revoked',
          premiumRevokedAt: new Date(),
          premiumRevokedReason: reason
        } 
      }
    );
    
    console.log(`✅ Premium status revoked for app ${appId}: ${reason}`);
  } catch (error) {
    console.error(`❌ Error revoking premium status for app ${appId}:`, error);
  }
}

/**
 * Batch verifies multiple apps and revokes invalid premium status
 */
export async function batchVerifyPremiumStatus(
  db: Db, 
  apps: Array<{ _id: string; authorId: string; isPremium: boolean }>
): Promise<Array<{ _id: string; isValid: boolean; reason: string }>> {
  const results = [];
  
  for (const app of apps) {
    if (app.isPremium) {
      const verification = await verifyAppPremiumStatus(db, app._id, app.authorId);
      
      if (!verification.isValid) {
        // Revoke invalid premium status
        await revokeInvalidPremiumStatus(db, app._id, verification.reason || 'Verification failed');
      }
      
      results.push({
        _id: app._id,
        isValid: verification.isValid,
        reason: verification.reason || 'Unknown'
      });
    } else {
      results.push({
        _id: app._id,
        isValid: true, // Non-premium apps are always valid
        reason: 'Not premium'
      });
    }
  }
  
  return results;
} 