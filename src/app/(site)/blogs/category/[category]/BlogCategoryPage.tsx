"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search, Calendar, Clock, Eye, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { getShadow, getGlassStyles } from '@/utils/themeUtils';
import Badge from '@components/badges/Badge';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  subcategories?: string[];
  tags: string[];
  author: string;
  role: string;
  authorBio: string;
  isFounderStory: boolean;
  founderUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  readTime?: number;
  views?: number;
  likes?: number;
  slug?: string;
  imageUrl?: string;
}

interface BlogCategoryPageProps {
  category: string;
  page: number;
  tag?: string;
  initialBlogs?: BlogPost[];
  totalBlogs?: number;
  categoryChips?: { category: string; count: number }[];
}

export default function BlogCategoryPage({ 
  category, 
  page, 
  tag, 
  initialBlogs = [], 
  totalBlogs = 0,
  categoryChips = []
}: BlogCategoryPageProps) {
  const theme = useTheme();
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [loading, setLoading] = useState(initialBlogs.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(tag || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalBlogs / 12));
  const [totalBlogsCount, setTotalBlogsCount] = useState(totalBlogs);
  const categoryCountMap: Record<string, number> = (categoryChips || []).reduce((acc, item) => {
    acc[item.category] = item.count;
    return acc;
  }, {} as Record<string, number>);

  const renderMetaInfo = (date: string, readTime: string, views?: number, likes?: number) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "text.secondary",
        fontSize: "0.75rem",
      }}
    >
      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Calendar size={14} />
          {date}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Clock size={14} />
          {readTime}
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        {views && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Eye size={14} />
            {views}
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ThumbsUp size={14} />
          {likes || 0}
        </Box>
      </Box>
    </Box>
  );

  const renderBlogCard = (blog: BlogPost) => {
    const fallbackExcerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...';
    const excerpt = (blog as any).excerpt?.trim() ? (blog as any).excerpt : fallbackExcerpt;
    const readTime = blog.readTime || Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(' ').length / 200);

    return (
      <Paper
        key={blog._id}
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: getShadow(theme, "elegant"),
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: getShadow(theme, "neon"),
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1, mr: 2, lineHeight: 1.3 }}>
            {blog.title}
          </Typography>
          {blog.isFounderStory && (
            <Badge variant="founder" label="Founder" />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flex: 1 }}
        >
          {excerpt}
        </Typography>

        {/* Categories and Subcategories */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {/* Main Category */}
            {blog.category && (
              <Chip 
                size="small" 
                label={blog.category} 
                variant="filled"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: "0.7rem",
                }}
              />
            )}
            {/* Additional Categories (Subcategories) */}
            {blog.subcategories?.slice(0, 2).map((subcat, i) => (
              <Chip 
                key={`subcat-${i}`} 
                size="small" 
                label={subcat} 
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.background.paper,
                  fontSize: "0.7rem",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            ))}
            {/* Show total count if there are more subcategories */}
            {blog.subcategories && blog.subcategories.length > 2 && (
              <Chip 
                size="small" 
                label={`+${blog.subcategories.length - 2}`} 
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.background.paper,
                  fontSize: "0.7rem",
                }}
              />
            )}
          </Box>
        </Box>

        {/* Tags - Show separately if exists */}
        {blog.tags && blog.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {blog.tags.slice(0, 3).map((tag, i) => (
                <Chip 
                  key={`tag-${i}`} 
                  size="small" 
                  label={tag} 
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper,
                    fontSize: "0.7rem",
                  }}
                />
              ))}
              {blog.tags.length > 3 && (
                <Chip 
                  size="small" 
                  label={`+${blog.tags.length - 3}`} 
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper,
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {renderMetaInfo(
          new Date(blog.createdAt).toLocaleDateString(),
          `${readTime} min read`,
          blog.views,
          blog.likes
        )}

        {/* Subtle inline text link cue (card is already wrapped in Link) */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            Read more →
          </Typography>
        </Box>
      </Paper>
    );
  };

  // Get unique tags from the blogs in this category
  const getUniqueTags = (blogs: BlogPost[]) => {
    const allTags = blogs.flatMap(blog => blog.tags || []);
    return [...new Set(allTags)].sort();
  };

  // Fetch blogs for this category only if no initial data provided
  useEffect(() => {
    if (initialBlogs.length > 0) {
      setBlogs(initialBlogs);
      setTotalBlogsCount(totalBlogs);
      setTotalPages(Math.ceil(totalBlogs / 12));
      setLoading(false);
      return;
    }

    async function fetchBlogs() {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        params.append('category', category);
        params.append('page', currentPage.toString());
        params.append('limit', '12');
        
        if (selectedTag) {
          params.append('tag', selectedTag);
        }

        const res = await fetch(`/api/blogs/public?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        
        const data = await res.json();
        setBlogs(data.blogs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalBlogsCount(data.pagination?.total || 0);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [category, currentPage, selectedTag, initialBlogs.length, totalBlogs]);

  // Local search filtering
  const filteredBlogs = blogs.filter(blog => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query) ||
      blog.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('page', value.toString());
    window.history.pushState({}, '', url.toString());
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
    setCurrentPage(1);
    // Update URL
    const url = new URL(window.location.href);
    if (selectedTag === tag) {
      url.searchParams.delete('tag');
    } else {
      url.searchParams.set('tag', tag);
    }
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Browse by Category - replica of blogs root */}
      <Paper
        elevation={0}
        sx={{
          mb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          borderRadius: "1rem",
          ...getGlassStyles(theme),
          boxShadow: getShadow(theme, "elegant"),
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Browse by Category
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore blogs organized by topic categories
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: { xs: 2, sm: 3 } }}>
          {Object.keys(categoryCountMap).map((categoryName) => (
            <Chip
              key={categoryName}
              component={Link as any}
              href={`/blogs/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
              clickable
              label={`${categoryName} (${categoryCountMap[categoryName]})`}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.main,
                },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {filteredBlogs.length} of {totalBlogsCount} blogs in {category}
        {selectedTag && ` tagged with "${selectedTag}"`}
      </Typography>

      {/* Blog Grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
        {filteredBlogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Link href={`/blogs/${blog.slug || blog._id}`} style={{ textDecoration: 'none' }}>
              {renderBlogCard(blog)}
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {filteredBlogs.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No blogs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Box>
  );
} 