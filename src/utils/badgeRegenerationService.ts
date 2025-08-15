import { ObjectId } from 'mongodb';
import { 
  assignBadgeTextToApp, 
  assignBadgeClassToApp, 
  getBadgeTextVariations, 
  getBadgeClassVariations 
} from './badgeAssignmentService';
import { 
  generateVerificationBadgeHtmlServer, 
  generateAntiTrackingBadgesServer, 
  generateSEOOptimizedBadgeServer 
} from '@/utils/badgeGenerationServer';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * Regenerates badges for an existing app using the deterministic system
 * This ensures the app gets the same badge text and class as before
 * @param appId - The app ID to regenerate badges for
 * @returns Object containing the regenerated badge data
 */
export async function regenerateBadgesForApp(appId: string) {
  try {
    const { db } = await connectToDatabase();
    
    // Get the existing app
    const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
    if (!app) {
      throw new Error('App not found');
    }

    const appUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/launch/${app.slug}`;
    
    // Get deterministic badge assignments (same as before)
    const assignedBadgeText = await assignBadgeTextToApp(appId);
    const assignedBadgeClass = await assignBadgeClassToApp(appId);
    const badgeTextVariations = await getBadgeTextVariations(appId, 3);
    const badgeClassVariations = await getBadgeClassVariations(appId, 3);

    // Generate new badge HTML with consistent text and class
    const defaultBadge = await generateVerificationBadgeHtmlServer(app.name, appUrl, appId, 'default', 'light');
    const antiTrackingBadges = await generateAntiTrackingBadgesServer(app.name, appUrl, appId, 3);
    const seoOptimizedBadge = await generateSEOOptimizedBadgeServer(app.name, appUrl, appId);

    // Update the app with new badge HTML
    const updateResult = await db.collection('userapps').updateOne(
      { _id: new ObjectId(appId) },
      {
        $set: {
          verificationBadgeHtml: defaultBadge,
          verificationBadgeVariations: antiTrackingBadges,
          verificationSeoBadge: seoOptimizedBadge,
          
          // Update badge assignment data
          verificationBadgeText: assignedBadgeText,
          verificationBadgeClass: assignedBadgeClass,
          verificationBadgeTextPool: badgeTextVariations,
          verificationBadgeClassPool: badgeClassVariations,
          
          updatedAt: new Date(),
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('Failed to update app');
    }

    return {
      success: true,
      appId,
      badgeText: assignedBadgeText,
      badgeClass: assignedBadgeClass,
      badgeHtml: defaultBadge,
      badgeVariations: antiTrackingBadges,
      seoBadge: seoOptimizedBadge,
      textVariations: badgeTextVariations,
      classVariations: badgeClassVariations
    };

  } catch (error) {
    console.error('Error regenerating badges:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Regenerates badges for multiple apps
 * @param appIds - Array of app IDs to regenerate badges for
 * @returns Array of regeneration results
 */
export async function regenerateBadgesForMultipleApps(appIds: string[]) {
  const results = [];
  
  for (const appId of appIds) {
    const result = await regenerateBadgesForApp(appId);
    results.push(result);
  }
  
  return results;
}

/**
 * Regenerates badges for all apps that need verification
 * @returns Object containing regeneration statistics
 */
export async function regenerateAllVerificationBadges() {
  try {
    const { db } = await connectToDatabase();
    
    // Find all apps that need verification
    const apps = await db.collection('userapps').find({
      requiresVerification: true,
      verificationStatus: { $in: ['pending', 'verified'] }
    }).toArray();

    if (apps.length === 0) {
      return {
        success: true,
        message: 'No apps found that need badge regeneration',
        totalApps: 0,
        regeneratedApps: 0,
        failedApps: 0
      };
    }

    let regeneratedCount = 0;
    let failedCount = 0;
    const results = [];

    for (const app of apps) {
      const result = await regenerateBadgesForApp(app._id.toString());
      if (result.success) {
        regeneratedCount++;
      } else {
        failedCount++;
      }
      results.push(result);
    }

    return {
      success: true,
      message: `Successfully regenerated badges for ${regeneratedCount} apps`,
      totalApps: apps.length,
      regeneratedApps: regeneratedCount,
      failedApps: failedCount,
      results
    };

  } catch (error) {
    console.error('Error regenerating all badges:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Gets badge information for an app
 * @param appId - The app ID to get badge info for
 * @returns Object containing badge information
 */
export async function getBadgeInfoForApp(appId: string) {
  try {
    const { db } = await connectToDatabase();
    
    const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
    if (!app) {
      throw new Error('App not found');
    }

    // Get current badge assignments
    const assignedBadgeText = await assignBadgeTextToApp(appId);
    const assignedBadgeClass = await assignBadgeClassToApp(appId);
    const badgeTextVariations = await getBadgeTextVariations(appId, 3);
    const badgeClassVariations = await getBadgeClassVariations(appId, 3);

    return {
      success: true,
      appId,
      appName: app.name,
      currentBadgeText: app.verificationBadgeText || assignedBadgeText,
      currentBadgeClass: app.verificationBadgeClass || assignedBadgeClass,
      assignedBadgeText,
      assignedBadgeClass,
      badgeTextVariations,
      badgeClassVariations,
      verificationStatus: app.verificationStatus,
      requiresVerification: app.requiresVerification
    };

  } catch (error) {
    console.error('Error getting badge info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validates that an app's current badges match the deterministic assignment
 * @param appId - The app ID to validate
 * @returns Object containing validation results
 */
export async function validateBadgeConsistency(appId: string) {
  try {
    const { db } = await connectToDatabase();
    
    const app = await db.collection('userapps').findOne({ _id: new ObjectId(appId) });
    if (!app) {
      throw new Error('App not found');
    }

    // Get expected badge assignments
    const expectedBadgeText = await assignBadgeTextToApp(appId);
    const expectedBadgeClass = await assignBadgeClassToApp(appId);

    // Check if current badges match expected assignments
    const textMatches = app.verificationBadgeText === expectedBadgeText;
    const classMatches = app.verificationBadgeClass === expectedBadgeClass;

    return {
      success: true,
      appId,
      appName: app.name,
      isConsistent: textMatches && classMatches,
      currentBadgeText: app.verificationBadgeText,
      currentBadgeClass: app.verificationBadgeClass,
      expectedBadgeText,
      expectedBadgeClass,
      textMatches,
      classMatches,
      needsRegeneration: !textMatches || !classMatches
    };

  } catch (error) {
    console.error('Error validating badge consistency:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
