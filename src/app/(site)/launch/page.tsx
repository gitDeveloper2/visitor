import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import AppsMainPage from './AppsMainPage';
import { fetchCategoryNames } from '@/utils/categories';
import { connectToDatabase } from '@/lib/mongodb';
import { Cache, CachePolicy } from '@/features/shared/cache';
import { sortByScore, computeAppScore } from '@/features/ranking/score';
import AdSlot from '@/app/components/adds/google/AdSlot';
import { DeploymentFlagService } from '@/utils/deploymentFlags';
import DeploymentStatusBanner from '@/components/DeploymentStatusBanner';
import { getActiveLaunch, getLaunchWithApps } from '@/lib/launches';
import { ObjectId } from 'mongodb';

// ISR: Revalidate after 24 hours for static content (featured apps, categories, etc.)
// Today's launches are fetched client-side from Voting API for real-time updates
export const revalidate = 86400; // 24 hours

// Helper function to serialize MongoDB objects
function serializeMongoObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (obj._bsontype === 'ObjectID' || obj._bsontype === 'ObjectId') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeMongoObject);
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeMongoObject(value);
    }
    return serialized;
  }
  
  return obj;
}

/**
 * Launch Page - Main voting and app discovery page
 * 
 * SIMPLIFIED LAUNCHES SYSTEM:
 * - Only apps from the active launch are shown as "launching today"
 * - Voting API manages launches collection and Redis voting
 * - Main App: Read-only access to launches collection
 * 
 * DATA FLOW:
 * 1. Morning: Voting API creates daily launches via cron job
 * 2. Daytime: Users vote via Voting API (validates with token, updates Redis)
 * 3. Evening: Voting API flushes Redis counts to MongoDB via cron job
 * 4. Launch page shows ONLY apps from active launch - nothing else
 */
// Debug log environment variables
console.log('Environment Variables:', {
  BLOG_DEPLOYMENT_COMPLETE: process.env.BLOG_DEPLOYMENT_COMPLETE,
  LAUNCH_PAGE_ENABLED: process.env.LAUNCH_PAGE_ENABLED,
  APP_LAUNCH_ENABLED: process.env.APP_LAUNCH_ENABLED,
  VOTING_SYSTEM_ENABLED: process.env.VOTING_SYSTEM_ENABLED,
  NODE_ENV: process.env.NODE_ENV
});


// Debug log deployment flags
const flags = DeploymentFlagService.getFlags();
console.log('Deployment Flags:', {
  blogDeploymentComplete: flags.blogDeploymentComplete,
  launchPageEnabled: flags.launchPageEnabled,
  appLaunchEnabled: flags.appLaunchEnabled,
  votingSystemEnabled: flags.votingSystemEnabled
});

export default async function LaunchPage() {
  console.log("tetsing launch")
  // Check deployment flags first
  if (!DeploymentFlagService.isLaunchPageEnabled()) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <DeploymentStatusBanner showOnlyIfRelevant={false} />
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Launch Page Temporarily Unavailable
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {DeploymentFlagService.getStatusMessage()}
          </Typography>
        </Box>
      </Container>
    );
  }

  try {
    const { db } = await connectToDatabase();
    
    // Calculate date 7 days ago for featured apps
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Featured: Premium apps from the last 7 days, limited by env (ISR cached)
    const featuredLimit = parseInt(process.env.NEXT_PUBLIC_FEATURED_LIMIT || process.env.FEATURED_LIMIT || '6');
    let featuredApps = await db.collection('userapps')
      .find({ status: 'approved', isPremium: true, createdAt: { $gte: sevenDaysAgo } })
      .sort({ createdAt: -1 })
      .limit(featuredLimit)
      .toArray();

    // TODAY'S LAUNCHES: Will be fetched client-side from Voting API
    // No server-side launch fetching - Voting API handles this completely
    const allAppsCombined = []; // Empty - client will populate from Voting API
    
    // Count total apps for pagination
    const totalApps = allAppsCombined.length;

    // All apps (for All Apps section) - ISR cached for 24 hours
    // Client-side will handle excluding today's launches dynamically
    const allOtherApps = await db.collection('userapps')
      .find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(24)
      .toArray();

    // Get categories for ISR caching (24 hours)
    const categoryNames: string[] = await Cache.getOrSet(
      Cache.keys.categories('app'),
      CachePolicy.page.launchCategory,
      async () => {
        try {
          return await fetchCategoryNames('app');
        } catch {
          return [] as string[];
        }
      }
    ) as any;

    // Category counts based on all apps (ISR cached)
    const categoryCounts = allOtherApps.reduce((acc: any, app: any) => {
      const cat = app.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChips = categoryNames.map((category) => ({
      category,
      count: categoryCounts[category] || 0,
    }));
      
    // Serialize MongoDB objects before passing to client component
    const serializedApps = serializeMongoObject(allAppsCombined);
    const serializedFeaturedApps = serializeMongoObject(featuredApps);
    const serializedAllOtherApps = serializeMongoObject(allOtherApps);
    
    // Voting props - client will determine from Voting API
    const pageProps = {
      votingEndTime: new Date(new Date().setHours(22, 0, 0, 0)).toISOString(), // Default 22:00 UTC
      isVotingActive: false // Client will determine from Voting API
    };

    // Count of all approved apps (ISR cached)
    const allAppsCount = await db.collection('userapps').countDocuments({ status: 'approved' });

    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Deployment Status Banner */}
        <DeploymentStatusBanner />
        
        {/* Launch Header Ad */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <AdSlot slot={30} />
        </Box>
        
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 8 } }}>
            <CircularProgress />
          </Box>
        }>
          <AppsMainPage 
            initialApps={serializedApps}
            initialFeaturedApps={serializedFeaturedApps}
            initialTotalApps={totalApps}
            categoryChips={categoryChips}
            allAppsCount={allAppsCount}
            initialAllApps={serializedAllOtherApps}
            votingEndTime={pageProps.votingEndTime}
            isVotingActive={pageProps.isVotingActive}
          />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error('[LaunchPage] Error fetching app data:', error);
    console.error('[LaunchPage] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    // Fallback with empty data and error message
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">
            Unable to load launch data. Please try refreshing the page.
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 1, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                Error: {error instanceof Error ? error.message : 'Unknown error'}
              </Box>
            )}
          </Alert>
        </Box>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 8 } }}>
            <CircularProgress />
          </Box>
        }>
          <AppsMainPage 
            initialApps={[]}
            initialFeaturedApps={[]}
            initialTotalApps={0}
            categoryChips={[]}
            allAppsCount={0}
            initialAllApps={[]}
            votingEndTime={new Date().toISOString()}
            isVotingActive={false}
          />
        </Suspense>
      </Container>
    );
  }
}
