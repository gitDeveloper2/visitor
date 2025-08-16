"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  TrendingUp,
  Users,
  BookOpen,
  Plus,
} from "lucide-react";
import Badge from "@components/badges/Badge";
import { getShadow, getGlassStyles, typographyVariants, commonStyles } from "@/utils/themeUtils";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorEmail: string;
  author: string;
  role: string;
  authorBio: string;
  founderUrl: string;
  isInternal: boolean;
  isFounderStory: boolean;
  status: 'pending' | 'approved' | 'rejected';
  readTime?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  // Additional fields that might exist
  views?: number;
  likes?: number;
  slug?: string;
  category?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

interface FeaturedBlogCardProps {
  blog: BlogPost;
  isFounderStory?: boolean;
}

function FeaturedBlogCard({ blog, isFounderStory = false }: FeaturedBlogCardProps) {
  const theme = useTheme();
  const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...';
  const readTime = blog.readTime || Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(' ').length / 200);

  return (
    <Paper
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
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            height: 200,
            backgroundImage: blog.imageUrl 
              ? `url('${blog.imageUrl}')` 
              : 'none',
            backgroundColor: blog.imageUrl ? 'transparent' : theme.palette.grey[100],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        />
        {isFounderStory && (
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <Badge variant="founder" label="Founder Story" />
          </Box>
        )}
      </Box>

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Avatar alt={blog.author} sx={{ width: 36, height: 36 }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>{blog.author}</Typography>
            <Typography variant="caption" color="text.secondary">{blog.role}</Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, flex: 1 }}>
          {excerpt}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {blog.tags.slice(0, 3).map((tag) => (
            <Link key={tag} href={`/blogs/tag/${encodeURIComponent(tag)}`} style={{ textDecoration: 'none' }}>
              <Chip
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.background.paper,
                  cursor: 'pointer',
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Link>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "text.secondary",
            fontSize: "0.75rem",
            mt: "auto",
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={14} />
              {readTime} min read
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {blog.views && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Eye size={14} />
                {blog.views}
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={14} />
              {blog.likes || 0}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function FounderStoryCard({ blog }: { blog: BlogPost }) {
  const theme = useTheme();
  const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...';
  const readTime = blog.readTime || Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(' ').length / 200);

  return (
    <Paper
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
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            height: 160,
            backgroundImage: blog.imageUrl 
              ? `url('${blog.imageUrl}')` 
              : 'none',
            backgroundColor: blog.imageUrl ? 'transparent' : theme.palette.grey[100],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box sx={{ position: "absolute", top: 12, left: 12 }}>
          <Badge variant="founder" label="Founder Story" />
        </Box>
      </Box>

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, flex: 1 }}>
          {excerpt}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Avatar alt={blog.author} sx={{ width: 24, height: 24 }} />
            <Typography variant="caption" fontWeight={600}>
              {blog.author}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, color: "text.secondary", fontSize: "0.75rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={12} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={12} />
              {readTime} min read
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

interface BlogMainPageProps {
  initialBlogs: BlogPost[];
  initialFeaturedBlogs: BlogPost[];
  initialFounderStories: BlogPost[];
}

export default function BlogMainPage({ 
  initialBlogs, 
  initialFeaturedBlogs, 
  initialFounderStories 
}: BlogMainPageProps) {
  const theme = useTheme();
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>(initialFeaturedBlogs);
  const [founderStories, setFounderStories] = useState<BlogPost[]>(initialFounderStories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialBlogs.length / 12));
  const [totalBlogs, setTotalBlogs] = useState(initialBlogs.length);

  // Filter blogs based on search query only
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTags = (tags: string[]) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      {tags.map((tag) => (
        <Link key={tag} href={`/blogs/tag/${encodeURIComponent(tag)}`} style={{ textDecoration: 'none' }}>
          <Chip
            label={tag}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              cursor: 'pointer',
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            }}
          />
        </Link>
      ))}
    </Box>
  );

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
    const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...';
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

        {renderTags(blog.tags)}
        {renderMetaInfo(
          new Date(blog.createdAt).toLocaleDateString(),
          `${readTime} min read`,
          blog.views,
          blog.likes
        )}
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h1" sx={typographyVariants.heroTitle}>
          Developer{" "}
          <Box component="span" sx={commonStyles.textGradient(theme)}>
            Blog
          </Box>
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "text.secondary",
            mt: 3,
            maxWidth: 720,
            mx: "auto",
            lineHeight: 1.5,
          }}
        >
          Discover insights, tutorials, and stories from developers building the future of technology.
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 6,
          px: 3,
          py: 4,
          borderRadius: "1rem",
          ...getGlassStyles(theme),
          boxShadow: getShadow(theme, "elegant"),
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Search blogs, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Featured Articles Section */}
      {featuredBlogs.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              Featured
            </Box>{" "}
            Articles
          </Typography>

          <Grid container spacing={3}>
            {featuredBlogs.map((blog) => (
              <Grid item xs={12} md={6} key={blog._id}>
                <Link href={`/blogs/${blog.slug || blog._id}`} style={{ textDecoration: 'none' }}>
                  <FeaturedBlogCard blog={blog} />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Founder Stories Section */}
      {founderStories.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                fontSize: 13,
                letterSpacing: 1,
              }}
            >
              Founder Stories
            </Typography>
            <Button
              component={Link}
              href="/blogs/founder-stories"
              variant="outlined"
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            >
              View All Stories
            </Button>
          </Box>

          <Grid container spacing={3}>
            {founderStories.slice(0, 3).map((story) => (
              <Grid item xs={12} sm={6} md={4} key={story._id}>
                <Link href={`/blogs/${story.slug || story._id}`} style={{ textDecoration: 'none' }}>
                  <FounderStoryCard blog={story} />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Articles Section */}
      <Box sx={{ mt: 6, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            All Articles
          </Typography>
          <Button
            component={Link}
            href="/dashboard/submission/blog"
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            sx={{ fontWeight: 600 }}
          >
            Write Blog
          </Button>
        </Box>
      </Box>

      {/* Blog Grid */}
      {filteredBlogs.length > 0 ? (
        <>
          <Grid container spacing={4}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No blogs found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery 
              ? "Try adjusting your search criteria."
              : "Be the first to share your knowledge with the community!"
            }
          </Typography>
          {!searchQuery && (
            <Button
              component={Link}
              href="/dashboard/submission/blog"
              variant="contained"
              color="primary"
              startIcon={<Plus size={18} />}
              sx={{ fontWeight: 600 }}
            >
              Write Your First Blog
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
} 