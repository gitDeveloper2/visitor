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
}

export default function BlogCategoryPage({ 
  category, 
  page, 
  tag, 
  initialBlogs = [], 
  totalBlogs = 0 
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
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Available tags for this category - only show if there are tags */}
        {getUniqueTags(blogs).length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {getUniqueTags(blogs).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                color={selectedTag === tag ? "primary" : "default"}
                variant={selectedTag === tag ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {filteredBlogs.length} of {totalBlogsCount} blogs in {category}
        {selectedTag && ` tagged with "${selectedTag}"`}
      </Typography>

      {/* Blog Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {filteredBlogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Paper
              key={blog._id}
              sx={{
                borderRadius: "1rem",
                overflow: "hidden",
                background: theme.palette.background.paper,
                boxShadow: getShadow(theme, "elegant"),
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: getShadow(theme, "neon"),
                },
              }}
            >
              {blog.imageUrl && (
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url('${blog.imageUrl}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderTopLeftRadius: 'inherit',
                      borderTopRightRadius: 'inherit',
                    }}
                  />
                  {blog.isFounderStory && (
                    <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                      <Badge variant="founder" label="Founder Story" />
                    </Box>
                  )}
                </Box>
              )}

              <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Avatar alt={blog.author} sx={{ width: 36, height: 36 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{blog.author}</Typography>
                    <Typography variant="caption" color="text.secondary">{blog.role}</Typography>
                  </Box>
                </Box>

                {!blog.imageUrl && blog.isFounderStory && (
                  <Box sx={{ mb: 2 }}>
                    <Badge variant="founder" label="Founder Story" />
                  </Box>
                )}

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                  {blog.title}
                </Typography>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, flex: 1 }}
                >
                  {blog.content.replace(/<[^>]*>/g, '').slice(0, 120)}...
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Clock size={14} />
                    <Typography variant="caption">{blog.readTime || 5} min read</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Calendar size={14} />
                    <Typography variant="caption">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {blog.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>

                <Link href={`/blogs/${blog.slug}`} style={{ textDecoration: 'none' }}>
                  <Button variant="contained" fullWidth>
                    Read More
                  </Button>
                </Link>
              </Box>
            </Paper>
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