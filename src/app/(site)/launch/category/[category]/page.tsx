import { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { fetchCategoryNames, fetchCategoriesFromAPI } from '../../../../../utils/categories';
import LaunchCategoryPage from './LaunchCategoryPage';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { verifyAppPremiumStatus } from '../../../../../utils/premiumVerification';

export const revalidate = 1800;

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

export async function generateStaticParams() {
  // For static generation, we'll use a predefined list of common category slugs
  // This avoids API calls during build time which can be unreliable
  const commonCategorySlugs = [
    'productivity', 'development', 'design', 'marketing', 'analytics',
    'communication', 'finance', 'education', 'entertainment', 'ai',
    'web-development', 'mobile-development', 'data-science', 'business',
    'startup', 'tools', 'utilities', 'productivity-tools'
  ];
  
  return commonCategorySlugs.map((category) => ({ category }));
}

export default async function LaunchCategoryPageWrapper({ 
  params, 
  searchParams 
}: { 
  params: { category: string }, 
  searchParams: { page?: string, tag?: string } 
}) {
  const { category } = params;
  const page = parseInt(searchParams.page || '1');
  const tag = searchParams.tag;
  
  // Define common category slugs for validation
  const commonCategorySlugs = [
    'productivity', 'development', 'design', 'marketing', 'analytics',
    'communication', 'finance', 'education', 'entertainment', 'ai',
    'web-development', 'mobile-development', 'data-science', 'business',
    'startup', 'tools', 'utilities', 'productivity-tools'
  ];
  
  // Fetch categories from API to validate (with fallback)
  let validCategory: string | undefined;
  let categoryName: string | undefined;
  
  try {
    const categories = await fetchCategoriesFromAPI('app');
    const matchedCategory = categories.find(c => c.slug === category);
    if (matchedCategory) {
      validCategory = matchedCategory.slug;
      categoryName = matchedCategory.name;
    }
  } catch (error) {
    console.error('Error fetching categories for validation:', error);
    // Fallback to common categories
    validCategory = commonCategorySlugs.find(c => c === category);
    categoryName = validCategory; // Use slug as name for fallback
  }
  
  // If still not found, check if it's a valid category from our common list
  if (!validCategory) {
    validCategory = commonCategorySlugs.find(c => c === category);
    categoryName = validCategory; // Use slug as name for fallback
  }
  
  if (!validCategory) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">
          Category not found: {category}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Available categories: {commonCategorySlugs.join(', ')}
        </Typography>
      </Container>
    );
  }

  try {
    const { db } = await connectToDatabase();
    
    // Calculate date 7 days ago for featured apps
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Build query for category apps
    const query: any = { 
      status: 'approved',
      $or: [
        { category: categoryName }, // Use category name for database query
        { tags: categoryName }
      ]
    };
    
    if (tag) {
      query.tags = tag;
    }
    
    // Fetch featured apps for this category (premium apps within last 7 days)
    let featuredApps = await db.collection('userapps')
      .find({ 
        ...query,
        isPremium: true,
        createdAt: { $gte: sevenDaysAgo }
      })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();
    
    // Verify premium status for featured apps
    const verifiedFeaturedApps = [];
    for (const app of featuredApps) {
      const verification = await verifyAppPremiumStatus(db, app._id.toString(), app.authorId);
      if (verification.isValid) {
        verifiedFeaturedApps.push(app);
      }
    }
    
    featuredApps = verifiedFeaturedApps;
    
    // Fetch all apps for this category (excluding featured apps)
    const featuredAppIds = featuredApps.map(app => app._id);
    const limit = 12;
    const skip = (page - 1) * limit;
    
    const allApps = await db.collection('userapps')
      .find({ 
        ...query,
        _id: { $nin: featuredAppIds }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const totalApps = await db.collection('userapps')
      .countDocuments({ 
        ...query,
        _id: { $nin: featuredAppIds }
      });

    // Compute category counts for the Browse by Category chips (mirror /launch root)
    let categoryNames: string[] = [];
    try {
      categoryNames = await fetchCategoryNames('app');
    } catch (e) {
      categoryNames = [];
    }

    const recentAppsForCounts = await db.collection('userapps')
      .find({ status: 'approved', createdAt: { $gte: sevenDaysAgo } })
      .project({ category: 1 })
      .toArray();

    const categoryCounts = recentAppsForCounts.reduce((acc: any, app: any) => {
      const cat = app.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChips = categoryNames.map((name) => ({
      category: name,
      count: categoryCounts[name] || 0,
    }));

    // Serialize MongoDB objects before passing to client component
    const serializedApps = serializeMongoObject(allApps);
    const serializedFeaturedApps = serializeMongoObject(featuredApps);

    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
              lineHeight: { xs: 1.2, sm: 1.1 }
            }}
          >
            {categoryName} Apps
          </Typography>
          {tag && (
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Tagged with "{tag}"
            </Typography>
          )}
        </Box>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 3, sm: 4 } }}>
            <CircularProgress />
          </Box>
        }>
          <LaunchCategoryPage 
            category={categoryName} 
            page={page} 
            tag={tag}
            initialApps={serializedApps}
            initialFeaturedApps={serializedFeaturedApps}
            initialTotalApps={totalApps}
            categoryChips={categoryChips}
          />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error('Error fetching category data:', error);
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
              lineHeight: { xs: 1.2, sm: 1.1 }
            }}
          >
            {categoryName} Apps
          </Typography>
        </Box>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 3, sm: 4 } }}>
            <CircularProgress />
          </Box>
        }>
          <LaunchCategoryPage 
            category={categoryName} 
            page={page} 
            tag={tag}
            initialApps={[]}
            initialFeaturedApps={[]}
            initialTotalApps={0}
          />
        </Suspense>
      </Container>
    );
  }
} 