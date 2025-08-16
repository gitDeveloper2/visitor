import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';

// Featured blog selection criteria weights
const CRITERIA_WEIGHTS = {
  quality: 0.4,      // Content length, formatting, author info
  timeBased: 0.3,    // Newest approved blogs
  categoryRotation: 0.3  // Ensure category diversity
};

// Calculate blog score based on criteria
const calculateBlogScore = (blog: any) => {
  let score = 0;
  
  // Quality score (40%)
  const contentLength = blog.content?.length || 0;
  const hasAuthorInfo = blog.authorBio && blog.role;
  const qualityScore = Math.min((contentLength / 5000) * 0.5 + (hasAuthorInfo ? 0.5 : 0), 1);
  score += qualityScore * CRITERIA_WEIGHTS.quality;
  
  // Time-based score (30%)
  const hoursSinceApproval = blog.approvedAt 
    ? (Date.now() - new Date(blog.approvedAt).getTime()) / (1000 * 60 * 60)
    : 168; // Default to 7 days if no approval date
  const timeScore = Math.max(0, 1 - (hoursSinceApproval / 168)); // 7 days max
  score += timeScore * CRITERIA_WEIGHTS.timeBased;
  
  // Category rotation (30%) - will be applied in selection
  score += 0.3 * CRITERIA_WEIGHTS.categoryRotation;
  
  return score;
};

// Select featured blogs with category rotation
const selectFeaturedWithRotation = (blogs: any[], count: number = 3) => {
  const scoredBlogs = blogs.map(blog => ({
    ...blog,
    score: calculateBlogScore(blog)
  })).sort((a, b) => b.score - a.score);

  const selected: any[] = [];
  const usedCategories = new Set<string>();

  // First pass: select highest scoring blogs from different categories
  for (const blog of scoredBlogs) {
    if (selected.length >= count) break;
    
    if (!usedCategories.has(blog.category)) {
      selected.push(blog);
      usedCategories.add(blog.category);
    }
  }

  // Second pass: fill remaining slots with highest scoring blogs
  for (const blog of scoredBlogs) {
    if (selected.length >= count) break;
    
    if (!selected.find(b => b._id === blog._id)) {
      selected.push(blog);
    }
  }

  return selected.slice(0, count);
};

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Get approved blogs from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const blogs = await db
      .collection('userblogs')
      .find({
        status: 'approved',
        createdAt: { $gte: sevenDaysAgo }
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Select featured blogs
    const featuredBlogs = selectFeaturedWithRotation(blogs, 3);

    return NextResponse.json({
      blogs: featuredBlogs,
      total: featuredBlogs.length
    });

  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch featured blogs' },
      { status: 500 }
    );
  }
} 