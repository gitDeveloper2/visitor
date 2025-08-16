import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress, Chip, Grid } from '@mui/material';
import BlogMainPage from './BlogMainPage';
import { connectToDatabase } from '../../../lib/mongodb';
import Link from 'next/link';
import { fetchCategoryNames } from '../../../utils/categories';

// Transform database document to BlogPost interface
const transformBlogDocument = (doc: any) => ({
  _id: doc._id.toString(),
  title: doc.title || '',
  content: doc.content || '',
  tags: doc.tags || [],
  authorId: doc.authorId || '',
  authorName: doc.authorName || '',
  authorEmail: doc.authorEmail || '',
  author: doc.author || doc.authorName || '',
  role: doc.role || 'Author',
  authorBio: doc.authorBio || '',
  founderUrl: doc.founderUrl || '',
  isInternal: doc.isInternal || false,
  isFounderStory: doc.isFounderStory || false,
  status: doc.status || 'pending',
  readTime: doc.readTime || Math.ceil((doc.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200),
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  views: doc.views || 0,
  likes: doc.likes || 0,
  slug: doc.slug || '',
  category: doc.category || 'Uncategorized',
  imageUrl: doc.imageUrl || '',
  imagePublicId: doc.imagePublicId || '',
});

// Featured blog selection logic (quality + time + category rotation)
const CRITERIA_WEIGHTS = { quality: 0.4, timeBased: 0.3, categoryRotation: 0.3 };

const calculateBlogScore = (blog: any) => {
  const now = new Date();
  const blogDate = new Date(blog.createdAt);
  const daysSinceCreation = (now.getTime() - blogDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Quality score (based on content length, tags, etc.)
  const contentLength = blog.content?.length || 0;
  const qualityScore = Math.min(contentLength / 1000, 1); // Normalize to 0-1
  
  // Time-based score (newer blogs get higher scores)
  const timeScore = Math.max(0, 1 - (daysSinceCreation / 30)); // Decay over 30 days
  
  // Category rotation (simple hash-based rotation)
  const categoryHash = blog.category ? blog.category.charCodeAt(0) % 10 : 0;
  const rotationScore = (categoryHash / 10) + (Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % 10) / 10;
  
  return (
    qualityScore * CRITERIA_WEIGHTS.quality +
    timeScore * CRITERIA_WEIGHTS.timeBased +
    rotationScore * CRITERIA_WEIGHTS.categoryRotation
  );
};

const selectFeaturedWithRotation = (blogs: any[], count: number = 3) => {
  // Sort by score and select top blogs
  const scoredBlogs = blogs.map(blog => ({
    ...blog,
    score: calculateBlogScore(blog)
  }));
  
  scoredBlogs.sort((a, b) => b.score - a.score);
  
  // Ensure category diversity
  const selected: any[] = [];
  const usedCategories = new Set();
  
  for (const blog of scoredBlogs) {
    if (selected.length >= count) break;
    
    if (!usedCategories.has(blog.category) || selected.length < 2) {
      selected.push(blog);
      usedCategories.add(blog.category);
    }
  }
  
  // Fill remaining slots if needed
  for (const blog of scoredBlogs) {
    if (selected.length >= count) break;
    if (!selected.find(b => b._id === blog._id)) {
      selected.push(blog);
    }
  }
  
  return selected.slice(0, count);
};

// This is now a true server component that fetches data directly from database
export default async function BlogsPage() {
  try {
    const { db } = await connectToDatabase();
    
    // Get blogs from the last 7 days for featured selection
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Fetch categories for the "Browse by Topic" section
    let categories: string[] = [];
    try {
      console.log('Fetching categories for blogs page...');
      // Temporarily fetch all categories to see what's available
      categories = await fetchCategoryNames(); // No type filter = all active categories
      console.log('Categories fetched:', categories);
      console.log('Number of categories:', categories.length);
      
      // Also try to fetch blog-specific categories
      try {
        const blogCategories = await fetchCategoryNames('blog');
        console.log('Blog-specific categories:', blogCategories);
        console.log('Number of blog categories:', blogCategories.length);
      } catch (blogError) {
        console.log('Could not fetch blog categories:', blogError);
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories if API fails
      categories = [
        "Technology", "Business", "Development", "Design", "Marketing",
        "Startup", "Productivity", "AI", "Web Development", "Mobile Development"
      ];
    }
    
    // Fetch all approved blogs
    const rawBlogs = await db.collection('userblogs')
      .find({ 
        status: 'approved',
        createdAt: { $gte: sevenDaysAgo }
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log("raw blogs",rawBlogs)
    // Transform the database documents to match BlogPost interface
    const allBlogs = rawBlogs.map(transformBlogDocument);
    
    // Select featured blogs using our algorithm
    const featuredBlogs = selectFeaturedWithRotation(allBlogs, 3);
    console.log("featured ",featuredBlogs);
    // Extract founder stories
    const founderStories = allBlogs.filter((blog: any) => blog.isFounderStory);
    console.log("founder ", founderStories);

    // Get category counts from blogs
    const categoryCounts = rawBlogs.reduce((acc: any, blog) => {
      const category = blog.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Create category chips with counts
    const categoryChips = categories.map(category => ({
      category,
      count: categoryCounts[category] || 0
    })); // Removed the filter - show all categories

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Browse by Category Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Browse by Category
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Explore blogs organized by topic categories
          </Typography>
          <Grid container spacing={2}>
            {categoryChips.map(({ category, count }) => (
              <Grid item key={category}>
                <Link href={`/blogs/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`} style={{ textDecoration: 'none' }}>
                  <Chip
                    label={`${category} (${count})`}
                    variant={count > 0 ? "outlined" : "outlined"}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                      cursor: 'pointer',
                      opacity: count > 0 ? 1 : 0.6, // Dim categories with no blogs
                      borderColor: count > 0 ? 'primary.main' : 'text.disabled', // Different border color
                      color: count > 0 ? 'text.primary' : 'text.secondary', // Different text color
                      '&:hover': {
                        backgroundColor: count > 0 ? 'primary.main' : 'action.hover',
                        color: count > 0 ? 'white' : 'text.secondary',
                      },
                    }}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        }>
          <BlogMainPage 
            initialBlogs={allBlogs}
            initialFeaturedBlogs={featuredBlogs}
            initialFounderStories={founderStories}
          />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    // Fallback with empty data
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        }>
          <BlogMainPage 
            initialBlogs={[]}
            initialFeaturedBlogs={[]}
            initialFounderStories={[]}
          />
        </Suspense>
      </Container>
    );
  }
}
