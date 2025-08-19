import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import AppsMainPage from './AppsMainPage';
import { fetchCategoryNames } from '@/utils/categories';
import { connectToDatabase } from '../../../lib/mongodb';
import { Cache, CachePolicy } from '@/features/shared/cache';
import { verifyAppPremiumStatus } from '../../../utils/premiumVerification';
import { sortByScore, computeAppScore } from '@/features/ranking/score';
import AdSlot from '@/app/components/adds/google/AdSlot';

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
  try {
    const { db } = await connectToDatabase();
    
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Fetch featured apps (premium apps with valid payments within last 7 days)
    let featuredApps = await Cache.getOrSet(
      `${Cache.keys.launchIndex}:featured`,
      CachePolicy.page.launchIndex,
      async () => {
        return await db.collection('userapps')
          .find({ 
            isPremium: true, 
            status: 'approved',
            createdAt: { $gte: sevenDaysAgo }
          })
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray();
      }
    ) as any[];
    
    // Verify premium status against actual payment records
    const verifiedApps = [];
    for (const app of featuredApps) {
      const verification = await verifyAppPremiumStatus(db, app._id.toString(), app.authorId);
      if (verification.isValid) {
        verifiedApps.push(app);
      }
    }
    
    featuredApps = verifiedApps;
    
    // Fetch all approved apps for the first page (excluding featured apps to avoid duplication)
    const featuredAppIds = featuredApps.map(app => app._id);
    let allApps = await Cache.getOrSet(
      Cache.keys.launchIndex,
      CachePolicy.page.launchIndex,
      async () => {
        return await db.collection('userapps')
          .find({ 
            status: 'approved',
            _id: { $nin: featuredAppIds }
          })
          .sort({ createdAt: -1 })
          .limit(12)
          .toArray();
      }
    ) as any[];
    // Apply ranking score to main list (featured already selected by premium+recency)
    allApps = sortByScore(allApps as any, computeAppScore) as any;
    
    // Get total count for pagination (excluding featured apps)
    const totalApps = await Cache.getOrSet(
      `${Cache.keys.launchIndex}:count`,
      CachePolicy.page.launchIndex,
      async () => await db.collection('userapps').countDocuments({ status: 'approved', _id: { $nin: featuredAppIds } })
    ) as number;

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

    // Use apps from last 7 days for counts (to keep parity with blogs page logic)
    const recentAppsForCounts = await Cache.getOrSet(
      `${Cache.keys.launchIndex}:recentCounts`,
      CachePolicy.page.launchIndex,
      async () => {
        return await db.collection('userapps')
          .find({ status: 'approved', createdAt: { $gte: sevenDaysAgo } })
          .project({ category: 1 })
          .toArray();
      }
    ) as any[];

    const categoryCounts = recentAppsForCounts.reduce((acc: any, app: any) => {
      const cat = app.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChips = categoryNames.map((category) => ({
      category,
      count: categoryCounts[category] || 0,
    }));

    // Serialize MongoDB objects before passing to client component
    const serializedApps = serializeMongoObject(allApps);
    const serializedFeaturedApps = serializeMongoObject(featuredApps);

    // Server-side diagnostics for /launch
    console.log('[LaunchPage] Featured apps (verified) count:', serializedFeaturedApps?.length ?? 0);
    console.log('[LaunchPage] Main apps count:', serializedApps?.length ?? 0, 'TotalApps:', totalApps);
    console.log('[LaunchPage] Category chips:', categoryChips?.length ?? 0);

    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
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

