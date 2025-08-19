import React, { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { notFound } from 'next/navigation';
import TagBlogList from './TagBlogList';
import AdSlot from '@/app/components/adds/google/AdSlot';

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

interface TagPageProps {
  params: {
    tag: string;
  };
}

export default async function TagPage({ params }: TagPageProps) {
  try {
    const { db } = await connectToDatabase();
    
    // Decode the tag from URL
    const tag = decodeURIComponent(params.tag);
    
    console.log('Searching for tag:', tag);
    
    // First, let's see what tags actually exist in the database
    const allTags = await db.collection('userblogs')
      .distinct('tags');
    console.log('Available tags in database:', allTags);
    
    // Find blogs that contain this tag in their tags array
    const rawBlogs = await db.collection('userblogs')
      .find({ 
        status: 'approved',
        tags: { $in: [tag] }
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`Found ${rawBlogs.length} blogs with tag: "${tag}"`);
    
    // Transform the database documents to match BlogPost interface
    const blogs = rawBlogs.map(transformBlogDocument);
    
    // If no blogs found for this tag, show 404
    if (blogs.length === 0) {
      console.log('No blogs found for tag:', tag);
      notFound();
    }

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tag Page Header Ad */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <AdSlot slot={20} />
        </Box>
        
        <Box sx={{ mb: 6 }}>
          <Typography variant="h1" sx={{ 
            fontSize: { xs: '2rem', md: '3rem' }, 
            fontWeight: 700, 
            mb: 2,
            textTransform: 'capitalize'
          }}>
            #{tag}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            {blogs.length} article{blogs.length !== 1 ? 's' : ''} tagged with "{tag}"
          </Typography>
        </Box>

        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        }>
          <TagBlogList blogs={blogs} tag={tag} />
        </Suspense>
        

      </Container>
    );
  } catch (error) {
    console.error('Error fetching tag blogs:', error);
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error" sx={{ textAlign: 'center', py: 8 }}>
          Error loading tag blogs
        </Typography>
      </Container>
    );
  }
}
