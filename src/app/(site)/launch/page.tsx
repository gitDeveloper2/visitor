import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import AppsMainPage from './AppsMainPage';
import { connectToDatabase } from '../../../lib/mongodb';
import { verifyAppPremiumStatus } from '../../../utils/premiumVerification';

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
    let featuredApps = await db.collection('userapps')
      .find({ 
        isPremium: true, 
        status: 'approved',
        createdAt: { $gte: sevenDaysAgo } // Only apps created within last 7 days
      })
      .sort({ 
        createdAt: -1  // Most recent first
      })
      .limit(6)
      .toArray();
    
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
    const allApps = await db.collection('userapps')
      .find({ 
        status: 'approved',
        _id: { $nin: featuredAppIds } // Exclude featured apps from main list
      })
      .sort({ createdAt: -1 })
      .limit(12)
      .toArray();
    
    // Get total count for pagination (excluding featured apps)
    const totalApps = await db.collection('userapps')
      .countDocuments({ 
        status: 'approved',
        _id: { $nin: featuredAppIds }
      });

    // Serialize MongoDB objects before passing to client component
    const serializedApps = serializeMongoObject(allApps);
    const serializedFeaturedApps = serializeMongoObject(featuredApps);

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        }>
          <AppsMainPage 
            initialApps={serializedApps}
            initialFeaturedApps={serializedFeaturedApps}
            initialTotalApps={totalApps}
          />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error('Error fetching app data:', error);
    // Fallback with empty data
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
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

