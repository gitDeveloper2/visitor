import { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import BlogCategoryPage from './BlogCategoryPage';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { fetchCategoryNames } from '../../../../../utils/categories';

export async function generateStaticParams() {
  // For static generation, we'll use a predefined list of common category slugs
  const commonCategorySlugs = [
    'technology', 'business', 'development', 'design', 'marketing',
    'startup', 'productivity', 'ai', 'web-development', 'mobile-development'
  ];
  
  return commonCategorySlugs.map((category) => ({ category }));
}

export default async function BlogCategoryPageWrapper({ 
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
    'technology', 'business', 'development', 'design', 'marketing',
    'startup', 'productivity', 'ai', 'web-development', 'mobile-development'
  ];
  
  // Fetch categories from API to validate (with fallback)
  let validCategory: string | undefined;
  let categoryName: string | undefined;
  
  try {
    const categories = await fetchCategoryNames('blog');
    // Convert category slug back to name for validation
    const matchedCategory = categories.find(c => 
      c.toLowerCase().replace(/\s+/g, '-') === category
    );
    if (matchedCategory) {
      validCategory = matchedCategory;
      categoryName = matchedCategory;
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
    
    // Build query for category blogs
    const query: any = { 
      status: 'approved',
      category: categoryName // Use category name for database query
    };
    
    if (tag) {
      query.tags = tag;
    }
    
    const limit = 12;
    const skip = (page - 1) * limit;
    
    // Fetch blogs for this category
    const blogs = await db.collection('userblogs')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const totalBlogs = await db.collection('userblogs')
      .countDocuments(query);

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {categoryName} Blogs
          </Typography>
          {tag && (
            <Typography variant="h6" color="text.secondary">
              Tagged with "{tag}"
            </Typography>
          )}
        </Box>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        }>
          <BlogCategoryPage 
            category={categoryName} 
            page={page} 
            tag={tag}
            initialBlogs={transformedBlogs}
            totalBlogs={totalBlogs}
          />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error('Error fetching category data:', error);
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {categoryName} Blogs
          </Typography>
        </Box>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
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