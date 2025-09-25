import { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import BlogCategoryPage from './BlogCategoryPage';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { Cache, CachePolicy } from '@/features/shared/cache';
import { fetchCategoryNames, fetchCategoriesFromAPI } from '../../../../../utils/categories';

import AdSlot from '@/app/components/adds/google/AdSlot';

// Category pages are very static; extend to 7 days
export const revalidate = 604800;
 
  
  // Fetch categories from API to validate (with fallback)
  let validCategory: string | undefined;
  let categoryName: string | undefined;
  
  try {
    // Include categories of type 'blog' and 'both' for validation
    const cats = await fetchCategoriesFromAPI('both');
    const filtered = Array.isArray(cats) ? cats.filter((c: any) => c?.type === 'blog' || c?.type === 'both') : [];
    const bySlug = new Map<string, string>();
    filtered.forEach((c: any) => {
      const slug = String(c?.slug || c?.name || '').toLowerCase().replace(/\s+/g, '-');
      if (slug) bySlug.set(slug, c.name);
    });
    const name = bySlug.get(category);
    if (name) {
      validCategory = category;
      categoryName = name;
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
      `${Cache.keys.blogsCategory(category)}:count:${page}:${tag || ''}`,
      CachePolicy.page.blogsCategory,
      async () => await db.collection('userblogs').countDocuments(query)
    ) as number;

    // Compute category counts for Browse by Category chips (match /blogs behavior)
    const categories: string[] = await Cache.getOrSet(
      Cache.keys.categories('blog'),
      CachePolicy.page.blogsCategory,
      async () => {
        try {
          const [blogOnly, bothTypes] = await Promise.all([
            fetchCategoriesFromAPI('blog'),
            fetchCategoriesFromAPI('both')
          ]);
          const names = new Set<string>();
          (Array.isArray(blogOnly) ? blogOnly : []).forEach((c: any) => c?.name && names.add(c.name));
          (Array.isArray(bothTypes) ? bothTypes : []).forEach((c: any) => c?.name && names.add(c.name));
          return Array.from(names);
        } catch {
          return [] as string[];
        }
      }
    ) as any;

    const categoryAgg = await db.collection('userblogs').aggregate([
      { $match: { status: 'approved', category: { $exists: true, $nin: [null, ''] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    const categoryCounts = (categoryAgg || []).reduce((acc: Record<string, number>, row: any) => {
      acc[row._id] = row.count || 0;
      return acc;
    }, {} as Record<string, number>);
    const categoryChips = categories.map((c) => ({ category: c, count: categoryCounts[c] || 0 }));

    // Transform the database documents
    const transformedBlogs = blogs.map((blog: any) => ({
      _id: blog._id.toString(),
      title: blog.title || '',
      content: blog.content || '',
      category: blog.category || 'Uncategorized',
      tags: blog.tags || [],
      author: blog.author || blog.authorName || '',
      role: blog.role || 'Author',
      authorBio: blog.authorBio || '',
      isFounderStory: blog.isFounderStory || false,
      founderUrl: blog.founderUrl || '',
      status: blog.status || 'pending',
      createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
      readTime: blog.readTime || Math.ceil((blog.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200),
      views: blog.views || 0,
      likes: blog.likes || 0,
      slug: blog.slug || '',
      imageUrl: blog.imageUrl || '',
    }));

    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Blog Category Header Ad */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <AdSlot slot={20} />
        </Box>
        
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
            {categoryName} Blogs
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
          <BlogCategoryPage 
            category={categoryName} 
            page={page} 
            tag={tag}
            initialBlogs={transformedBlogs}
            totalBlogs={totalBlogs}
            categoryChips={categoryChips}
          />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error('Error fetching category data:', error);
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Blog Category Header Ad */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <AdSlot slot={20} />
        </Box>
        
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
            {categoryName} Blogs
          </Typography>
        </Box>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 3, sm: 4 } }}>
            <CircularProgress />
          </Box>
        }>
          <BlogCategoryPage 
            category={categoryName} 
            page={page} 
            tag={tag}
            initialBlogs={[]}
            totalBlogs={0}
          />
        </Suspense>
      </Container>
    );
  }
} 