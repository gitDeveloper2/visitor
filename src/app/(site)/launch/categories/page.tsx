import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress, Chip, Grid, Paper } from '@mui/material';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import { fetchCategoryNames } from '@/utils/categories';
import { Cache, CachePolicy } from '@/features/shared/cache';

// Revalidate daily; categories and counts don't change often
export const revalidate = 86400; // 24 hours

export default async function LaunchCategoriesIndexPage() {
  try {
    const { db } = await connectToDatabase();

    // 1) Fetch active category names via API (cached)
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

    // 2) Aggregate counts across ALL approved apps (not just last 7 days)
    const categoryAgg = await db.collection('userapps').aggregate([
      { $match: { status: 'approved', category: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();

    const categoryCounts = (categoryAgg || []).reduce((acc: Record<string, number>, row: any) => {
      acc[row._id] = row.count || 0;
      return acc;
    }, {} as Record<string, number>);

    const chips = categoryNames.map((name) => ({
      category: name,
      count: categoryCounts[name] || 0,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }));

    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Browse Categories
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore apps organized by categories
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Grid container spacing={1.5}>
            {chips.map(({ category, count, slug }) => (
              <Grid item key={slug}>
                <Chip
                  component={Link as any}
                  href={`/launch/category/${slug}`}
                  clickable
                  label={count ? `${category} (${count})` : category}
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    );
  } catch (error) {
    console.error('[LaunchCategoriesIndexPage] Error:', error);
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Unable to load categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please try again later.
          </Typography>
        </Box>
      </Container>
    );
  }
}
