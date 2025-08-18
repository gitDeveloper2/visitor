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
  useMediaQuery,
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
  subcategories?: string[];
  imageUrl?: string;
  imagePublicId?: string;
}

interface FeaturedBlogCardProps {
  blog: BlogPost;
  isFounderStory?: boolean;
}

function FeaturedBlogCard({ blog, isFounderStory = false }: FeaturedBlogCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, isMobile ? 120 : 150) + '...';
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
      {blog.imageUrl && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: { xs: 160, sm: 200 },
              backgroundImage: `url('${blog.imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
            }}
          />
          {isFounderStory && (
            <Box sx={{ position: "absolute", top: 12, left: 12 }}>
              <Chip
                label="Founder Story"
                size="small"
                sx={{ 
                  fontWeight: 600,
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  boxShadow: getShadow(theme, "elegant"),
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Founder Story Badge for cards without images */}
        {!blog.imageUrl && isFounderStory && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label="Founder Story"
              size="small"
              sx={{ 
                fontWeight: 600,
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                boxShadow: getShadow(theme, "elegant"),
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            />
          </Box>
        )}

        {/* Blog Header with Author */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mb: 2 }}>
          <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, bgcolor: theme.palette.primary.main }}>
            <BookOpen size={isMobile ? 14 : 16} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              fontWeight={600} 
              color="text.primary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              {blog.authorName || blog.author}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              {blog.role || 'Author'}
            </Typography>
          </Box>
        </Box>

        {/* Blog Title */}
        <Typography 
          variant={isMobile ? "h6" : "h6"} 
          sx={{ 
            fontWeight: 700, 
            mb: 1, 
            lineHeight: 1.3, 
            color: "text.primary",
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {blog.title}
        </Typography>

        {/* Blog Excerpt */}
        <Typography
          variant="body2"
          sx={{ 
            color: "text.secondary", 
            mb: 3, 
            flex: 1, 
            lineHeight: 1.5,
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}
        >
          {excerpt}
        </Typography>

        {/* Category and Tags */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: "block", 
              mb: 1, 
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
            Category
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {blog.category && (
              <Chip 
                size="small" 
                label={blog.category} 
                variant="filled"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Blog Stats */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          mb: 2,
          flexWrap: 'wrap',
          color: "text.secondary",
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Clock size={isMobile ? 12 : 14} />
            <Typography variant="caption">
              {readTime} min read
            </Typography>
          </Box>
          {blog.views && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Eye size={isMobile ? 12 : 14} />
              <Typography variant="caption">
                {blog.views} views
              </Typography>
            </Box>
          )}
          {blog.likes && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={isMobile ? 12 : 14} />
              <Typography variant="caption">
                {blog.likes} likes
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action Buttons intentionally removed to avoid contained buttons inside cards.
            Card is wrapped with a Link outside, so click-through is preserved. */}
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
      {blog.imageUrl && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: 160,
              backgroundImage: `url('${blog.imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <Badge variant="founder" label="Founder Story" />
          </Box>
        </Box>
      )}

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        {!blog.imageUrl && (
          <Box sx={{ mb: 2 }}>
            <Badge variant="founder" label="Founder Story" />
          </Box>
        )}
        
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>(initialFeaturedBlogs);
  const [founderStories, setFounderStories] = useState<BlogPost[]>(initialFounderStories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(initialBlogs.length);
  const itemsPerPage = 12;

  // Filter blogs based on search query only
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    <Box component="main" sx={{ bgcolor: "background.default", py: { xs: 4, sm: 6, md: 10 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6, md: 8 } }}>
        <Typography 
          variant={isMobile ? "h3" : "h1"} 
          sx={{
            ...typographyVariants.heroTitle,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
            lineHeight: { xs: 1.2, sm: 1.1 },
            mb: { xs: 2, sm: 3 }
          }}
        >
          Developer{" "}
          <Box component="span" sx={commonStyles.textGradient(theme)}>
            Blog
          </Box>
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            color: "text.secondary",
            mt: { xs: 2, sm: 3 },
            maxWidth: 720,
            mx: "auto",
            lineHeight: 1.5,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Discover insights, tutorials, and stories from developers building the future of technology.
        </Typography>
      </Box>

      {/* Search and Filter Section (commented out for later enablement)
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
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              placeholder="Search blogs, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={isMobile ? 18 : 20} />
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
      */}

      {/* Featured Articles Section */}
      {featuredBlogs.length > 0 && (
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          <Typography 
            variant={isMobile ? "h6" : "h6"} 
            sx={{ 
              fontWeight: 700, 
              mb: { xs: 2, sm: 3 }, 
              color: "text.primary",
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              Featured
            </Box>{" "}
            Articles
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
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
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: "space-between", 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 3,
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography
              variant={isMobile ? "h6" : "h6"}
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                fontSize: { xs: 12, sm: 13 },
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
              size={isMobile ? "small" : "small"}
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              View All Stories
            </Button>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
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
      <Box sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: "space-between", 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 3,
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography
            variant={isMobile ? "h6" : "h6"}
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            All Articles
          </Typography>
          <Button
            component={Link}
            href="/dashboard/submission/blog"
            variant="contained"
            color="primary"
            startIcon={<Plus size={isMobile ? 16 : 18} />}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Write Blog
          </Button>
        </Box>
      </Box>

      {/* Blog Grid */}
      {filteredBlogs.length > 0 ? (
        <>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {paginatedBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <Link href={`/blogs/${blog.slug || blog._id}`} style={{ textDecoration: 'none' }}>
                  {renderBlogCard(blog)}
                </Link>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, sm: 6 } }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary"
                size={isMobile ? "medium" : "large"}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 8 } }}>
          <Typography 
            variant={isMobile ? "h6" : "h6"} 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            No blogs found
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
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
              startIcon={<Plus size={isMobile ? 16 : 18} />}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Write Your First Blog
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
} 