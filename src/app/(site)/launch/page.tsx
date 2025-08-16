import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import AppsMainPage from './AppsMainPage';
import { connectToDatabase } from '../../../lib/mongodb';
import { verifyAppPremiumStatus } from '../../../utils/premiumVerification';

// This is now a true server component that fetches data directly from database
export default async function LaunchPage() {
  try {
    const { db } = await connectToDatabase();
    
    // Fetch featured apps (premium apps with valid payments)
    let featuredApps = await db.collection('userapps')
      .find({ 
        isPremium: true, 
        status: 'approved' 
      })
      .sort({ 
        isPremium: -1, // Premium apps first
        createdAt: -1  // Then by creation date
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
    
    // Fetch all approved apps for the first page
    const allApps = await db.collection('userapps')
      .find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(12)
      .toArray();
    
    // Get total count for pagination
    const totalApps = await db.collection('userapps')
      .countDocuments({ status: 'approved' });

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        }>
          <AppsMainPage 
            initialApps={allApps}
            initialFeaturedApps={featuredApps}
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

