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
import { redis, votingKeys } from '@/lib/voting/redis';
import { getActiveSession } from '@/lib/voting/session';

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
 * VOTING SYSTEM ARCHITECTURE:
 * - MongoDB: Master record for launches and final vote counts
 * - Redis: Temporary store for live vote counts during voting sessions
 * - Voting API: Separate service that handles vote operations
 * 
 * DATA FLOW:
 * 1. Morning: Main app creates daily launches in MongoDB
 * 2. Daytime: Users vote via Voting API (validates with token, updates Redis)
 * 3. Night: Scheduled process flushes Redis counts to MongoDB
 */
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
    
    // Get active voting session from Redis
    // This contains today's apps that are eligible for voting
    const activeSession = await getActiveSession();
    const votingEndTime = activeSession?.endTime || new Date();
    
    // Calculate date 7 days ago for featured apps
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get today's date range for MongoDB queries
    // This defines what constitutes "today's launches" in the database
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

    // VOTING APPS: Get tools that are currently in active voting session
    // These apps are loaded from MongoDB but vote counts come from Redis for real-time updates
    let votingApps = [];
    if (activeSession?.tools?.length) {
      // Get app details from MongoDB (source of truth for app data)
      votingApps = await db.collection('userapps')
        .find({ 
          _id: { $in: activeSession.tools },
          status: 'approved'
        })
        .toArray();
      
      // Get live vote counts from Redis (temporary store for fast updates)
      const redisClient = await redis;
      const voteCounts = await Promise.all(
        activeSession.tools.map(async (toolId: string) => {
          const count = await redisClient.get(votingKeys.toolVotes(toolId));
          return { toolId, votes: parseInt(count || '0', 10) };
        })
      );
      
      // Add vote counts to apps
      votingApps = votingApps.map(app => ({
        ...app,
        votes: voteCounts.find(v => v.toolId === app._id.toString())?.votes || 0,
        inVoting: true,
        votingEndTime: activeSession.endTime
      }));
      
      // Sort by vote count
      votingApps.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    }

    // NON-VOTING APPS: Get today's launches that are NOT in the voting session
    // These are apps that launched today but aren't competing in the vote
    const nonVotingAppIds = activeSession?.tools || [];
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

    // Compute category counts for the "Browse by Category" chips (mirror blogs logic)
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
    // Exclude apps that are in today's voting
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
        activeSession?.tools?.length ? { _id: { $nin: activeSession.tools } } : {}
      ]
    } as const;

    const nonTodayApps = await db.collection('userapps')
      .find(nonTodayFilter as any)
      .sort({ createdAt: -1 })
      .limit(24)
      .toArray();
      console.log(nonTodayApps);
    // Serialize MongoDB objects before passing to client component
    const serializedApps = serializeMongoObject(allAppsCombined);
    const serializedFeaturedApps = serializeMongoObject(featuredApps);
    const serializedNonToday = serializeMongoObject(nonTodayApps);
    
    // Add voting end time to the page props
    const pageProps = {
      votingEndTime: votingEndTime.toISOString(),
      isVotingActive: activeSession !== null
    };

    // Diagnostics removed for cleaner logs

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

