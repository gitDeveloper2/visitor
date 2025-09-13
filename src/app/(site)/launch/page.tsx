import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import AppsMainPage from './AppsMainPage';
import { fetchCategoryNames } from '@/utils/categories';
import { connectToDatabase } from '../../../lib/mongodb';
import { Cache, CachePolicy } from '@/features/shared/cache';
import { verifyAppPremiumStatus } from '../../../utils/premiumVerification';
import { sortByScore, computeAppScore } from '@/features/ranking/score';
import AdSlot from '@/app/components/adds/google/AdSlot';
import { DeploymentFlagService } from '@/utils/deploymentFlags';
import DeploymentStatusBanner from '@/components/DeploymentStatusBanner';

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

// This is now a true server component that fetches data directly from database
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
    
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Fetch only today's approved apps for the main Launch page
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

    // All apps launching today (excluding featured duplicates), include premium too to keep grid complete
    const featuredAppIds = featuredApps.map(app => app._id);
    let allApps = await db.collection('userapps')
      .find({ status: 'approved', launchDate: { $gte: start, $lte: end } })
      .sort({ createdAt: -1 })
      .limit(24)
      .toArray();
    // Apply ranking score to today's list. We'll keep server-side base ordering; client further adjusts with votes
    allApps = sortByScore(allApps as any, computeAppScore) as any;
    
    // Count only today's non-featured launches for pagination
    const totalApps = await db.collection('userapps').countDocuments({ status: 'approved', launchDate: { $gte: start, $lte: end } });

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

    // Use today's apps for category counts
    const recentAppsForCounts = await db.collection('userapps')
      .find({ status: 'approved', launchDate: { $gte: start, $lte: end } })
      .project({ category: 1 })
      .toArray();

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
    const nonTodayFilter = {
      status: 'approved',
      $or: [
        { launchDate: { $lt: start } },
        { launchDate: { $gt: end } },
        { launchDate: null },
        { launchDate: { $exists: false } },
        { launchDate: { $type: 'string' } },
      ]
    } as const;

    const nonTodayApps = await db.collection('userapps')
      .find(nonTodayFilter as any)
      .sort({ createdAt: -1 })
      .limit(24)
      .toArray();
      console.log(nonTodayApps);
    // Serialize MongoDB objects before passing to client component
    const serializedApps = serializeMongoObject(allApps);
    const serializedFeaturedApps = serializeMongoObject(featuredApps);
    const serializedNonToday = serializeMongoObject(nonTodayApps);

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

