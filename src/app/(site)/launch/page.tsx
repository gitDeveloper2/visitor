import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
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

// Main page should revalidate after 24 hours per requirement
export const revalidate = 86400;

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
 * NEW LAUNCHES SYSTEM ARCHITECTURE:
 * - Voting API: Manages launches collection and Redis voting
 * - Main App: Read-only access to launches collection
 * - MongoDB: Master record for launches and final vote counts
 * - Redis: Temporary store for live vote counts (managed by Voting API)
 * 
 * DATA FLOW:
 * 1. Morning: Voting API creates daily launches via cron job
 * 2. Daytime: Users vote via Voting API (validates with token, updates Redis)
 * 3. Evening: Voting API flushes Redis counts to MongoDB via cron job
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
    
    // Get active launch from launches collection (read-only)
    const activeLaunch = await getActiveLaunch();
    
    // Calculate date 7 days ago for featured apps
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get today's date range for MongoDB queries
    const today = new Date();
    const y = today.getUTCFullYear();
    const m = String(today.getUTCMonth() + 1).padStart(2, '0');
    const d = String(today.getUTCDate()).padStart(2, '0');
    const start = new Date(`${y}-${m}-${d}T00:00:00.000Z`);
    const end = new Date(`${y}-${m}-${d}T23:59:59.999Z`);

    // Featured: Premium apps from the last 7 days, limited by env
    const featuredLimit = parseInt(process.env.NEXT_PUBLIC_FEATURED_LIMIT || process.env.FEATURED_LIMIT || '6');
    let featuredApps = await db.collection('userapps')
      .find({ status: 'approved', isPremium: true, createdAt: { $gte: sevenDaysAgo } })
      .sort({ createdAt: -1 })
      .limit(featuredLimit)
      .toArray();

    // VOTING APPS: Get apps from active launch
    let votingApps = [];
    let votingEndTime = new Date();
    
    if (activeLaunch && activeLaunch.status === 'active') {
      // Get app details from MongoDB for active launch
      votingApps = await db.collection('userapps')
        .find({ 
          _id: { $in: activeLaunch.apps },
          status: 'approved'
        })
        .toArray();
      
      // Add voting metadata (vote counts will be fetched by client from Voting API)
      votingApps = votingApps.map(app => ({
        ...app,
        votes: 0, // Will be updated by client-side voting component
        inVoting: true,
        votingEndTime: new Date(new Date().setHours(22, 0, 0, 0)) // Voting ends at 22:00 UTC
      }));
      
      votingEndTime = new Date(new Date().setHours(22, 0, 0, 0));
    }

    // NON-VOTING APPS: Get today's launches that are NOT in the active launch
    const nonVotingAppIds = activeLaunch?.apps || [];

    let allApps = [];
    
    if (nonVotingAppIds.length > 0) {
      allApps = await db.collection('userapps')
        .find({ 
          status: 'approved', 
          launchDate: { $gte: start, $lte: end },
          _id: { $nin: nonVotingAppIds }
        })
        .sort({ createdAt: -1 })
        .limit(24)
        .toArray();
    } else {
      allApps = await db.collection('userapps')
        .find({ status: 'approved', launchDate: { $gte: start, $lte: end } })
        .sort({ createdAt: -1 })
        .limit(24)
        .toArray();
    }
    
    // Add voting status
    allApps = allApps.map(app => ({
      ...app,
      inVoting: false,
      votes: 0
    }));
    
    // Combine voting and non-voting apps
    const allAppsCombined = [...votingApps, ...allApps];
    
    // Count total apps for pagination
    const totalApps = allAppsCombined.length;

    // Compute category counts for the "Browse by Category" chips
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

    // Use combined apps for category counts
    const recentAppsForCounts = allAppsCombined.map(app => ({
      category: app.category
    }));

    const categoryCounts = recentAppsForCounts.reduce((acc: any, app: any) => {
      const cat = app.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChips = categoryNames.map((category) => ({
      category,
      count: categoryCounts[category] || 0,
    }));

    // Non-today apps (for All Apps section)
    // Exclude apps that are in today's active launch
    const nonTodayFilter = {
      status: 'approved',
      $and: [
        {
          $or: [
            { launchDate: { $lt: start } },
            { launchDate: { $gt: end } },
            { launchDate: null },
            { launchDate: { $exists: false } },
            { launchDate: { $type: 'string' } },
          ]
        },
        activeLaunch?.apps?.length ? { _id: { $nin: activeLaunch.apps } } : {}
      ]
    } as const;

    const nonTodayApps = await db.collection('userapps')
      .find(nonTodayFilter as any)
      .sort({ createdAt: -1 })
      .limit(24)
      .toArray();
      
    // Serialize MongoDB objects before passing to client component
    const serializedApps = serializeMongoObject(allAppsCombined);
    const serializedFeaturedApps = serializeMongoObject(featuredApps);
    const serializedNonToday = serializeMongoObject(nonTodayApps);
    
    // Add voting end time to the page props
    const pageProps = {
      votingEndTime: votingEndTime.toISOString(),
      isVotingActive: activeLaunch !== null && activeLaunch.status === 'active'
    };

    // Count of all approved apps not launching today
    const allAppsCount = await db.collection('userapps').countDocuments(nonTodayFilter as any);

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
            initialAllApps={serializedNonToday}
            votingEndTime={pageProps.votingEndTime}
            isVotingActive={pageProps.isVotingActive}
          />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error('[LaunchPage] Error fetching app data:', error);
    // Fallback with empty data
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 8 } }}>
            <CircularProgress />
          </Box>
        }>
          <AppsMainPage 
            initialApps={[]}
            initialFeaturedApps={[]}
            initialTotalApps={0}
          />
        </Suspense>
      </Container>
    );
  }
}
