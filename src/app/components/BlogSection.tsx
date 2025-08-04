"use client"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { commonStyles, typographyVariants, getGlassStyles, getShadow } from "../../utils/themeUtils";

const blogPosts = [
  {
    title: "Understanding Zod Enums: A Complete Guide",
    excerpt: "Explore how to use Zod enums for type-safe validation in TypeScript. Learn best practices and common patterns for enum validation.",
    category: "TypeScript",
    readTime: "8 min read",
    date: "2024-01-15",
    author: "Dev Team",
    trending: true,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
  },
  {
    title: "Prisma Self Relations: Advanced Database Modeling",
    excerpt: "Master self-referential relationships in Prisma. Learn how to model hierarchical data structures and complex relationships.",
    category: "Database",
    readTime: "12 min read",
    date: "2024-01-12",
    author: "Dev Team",
    trending: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
  },
  {
    title: "GitHub Actions Workflow Dispatch: Complete Tutorial",
    excerpt: "Learn how to trigger GitHub Actions workflows manually using workflow_dispatch. Master CI/CD automation with practical examples.",
    category: "DevOps",
    readTime: "10 min read",
    date: "2024-01-10",
    author: "Dev Team",
    trending: false,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop"
  },
  {
    title: "NpmStars: Track Package Popularity Trends",
    excerpt: "Discover how to use NpmStars to compare npm downloads and GitHub stars. Track package popularity and make informed decisions.",
    category: "Tools",
    readTime: "6 min read",
    date: "2024-01-08",
    author: "Dev Team",
    trending: true,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop"
  }
];

const BlogSection = () => {
  const theme = useTheme();

  return (
    <Box
      id="blog"
      component="section"
      sx={{
        py: 10,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "33%",
          width: 288,
          height: 288,
          bgcolor: `${theme.palette.primary.main}05`,
          borderRadius: "50%",
          filter: "blur(48px)",
          animation: theme.custom.animations.float,
          animationDelay: "2s",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Paper
            elevation={0}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 4,
              py: 2,
              mb: 3,
              borderRadius: "999px",
              ...getGlassStyles(theme),
            }}
          >
            <BookOpen
              style={{ width: 16, height: 16, color: theme.palette.primary.main }}
            />
            <Typography variant="body2" fontWeight={500}>
              Developer Blog
            </Typography>
          </Paper>

          <Typography variant="h2" sx={{ ...typographyVariants.sectionTitle, mb: 2 }}>
            <Box component="span" sx={{ color: theme.palette.text.primary }}>
              Latest
            </Box>
            <br />
            <Box component="span" sx={{ ...commonStyles.textGradient(theme) }}>
              Insights & Tutorials
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Stay inspired with articles exploring unique programming concepts and
            actionable knowledge. From understanding Zod enums to tracking npm
            package trends with NpmStars, and using free tools like Pic2Map and
            Geotag Photos Online — BasicUtils helps you learn, analyze, and create
            smarter.
          </Typography>
        </Box>

        {/* Featured Post */}
        <Box sx={{ mb: 6 }}>
          <Card
            sx={{
              ...getGlassStyles(theme),
              overflow: "hidden",
              transition: "all 0.3s",
              "&:hover": {
                borderColor: `${theme.palette.primary.main}50`,
                boxShadow: getShadow(theme, "elegant"),
              },
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  sx={{
                    width: "100%",
                    height: { xs: 256, md: "100%" },
                    objectFit: "cover",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={blogPosts[0].category}
                      size="small"
                      sx={{
                        bgcolor: `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main,
                        borderColor: `${theme.palette.primary.main}30`,
                      }}
                    />
                    {blogPosts[0].trending && (
                      <Chip
                        label="Trending"
                        size="small"
                        icon={<TrendingUp style={{ width: 12, height: 12 }} />}
                        sx={{
                          background: theme.custom.gradients.primary,
                          color: "white",
                          border: "none",
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    variant="h4"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 2,
                      cursor: "pointer",
                      transition: "color 0.2s",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    {blogPosts[0].title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 3,
                      fontSize: "1.125rem",
                    }}
                  >
                    {blogPosts[0].excerpt}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.875rem",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <User style={{ width: 16, height: 16 }} />
                        {blogPosts[0].author}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Calendar style={{ width: 16, height: 16 }} />
                        {new Date(blogPosts[0].date).toLocaleDateString()}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Clock style={{ width: 16, height: 16 }} />
                        {blogPosts[0].readTime}
                      </Box>
                    </Stack>

                    <Button
                      variant="text"
                      endIcon={<ArrowRight style={{ width: 16, height: 16 }} />}
                      sx={{
                        color: theme.palette.primary.main,
                        "&:hover": {
                          bgcolor: `${theme.palette.primary.main}10`,
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Blog Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {blogPosts.slice(1).map((post) => (
            <Grid item xs={12} md={4} key={post.title}>
              <Card
                sx={{
                  ...getGlassStyles(theme),
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: `${theme.palette.primary.main}50`,
                    boxShadow: getShadow(theme, "elegant"),
                  },
                }}
              >
                <Box sx={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  <Box
                    component="img"
                    src={post.image}
                    alt={post.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                </Box>

                <CardHeader sx={{ pb: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        bgcolor: `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main,
                        borderColor: `${theme.palette.primary.main}30`,
                      }}
                    />
                    {post.trending && (
                      <Chip
                        label="Trending"
                        size="small"
                        icon={<TrendingUp style={{ width: 12, height: 12 }} />}
                        sx={{
                          background: theme.custom.gradients.primary,
                          color: "white",
                          border: "none",
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    variant="h6"
                    component="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      cursor: "pointer",
                      transition: "color 0.2s",
                      "&:hover": { color: theme.palette.primary.main },
                      mb: 1,
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, mb: 2 }}
                  >
                    {post.excerpt}
                  </Typography>
                </CardHeader>

                <CardContent sx={{ pt: 0, mt: "auto" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.75rem",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Calendar style={{ width: 12, height: 12 }} />
                        {new Date(post.date).toLocaleDateString()}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Clock style={{ width: 12, height: 12 }} />
                        {post.readTime}
                      </Box>
                    </Stack>
                  </Box>

                  <Button
                    variant="text"
                    size="small"
                    fullWidth
                    endIcon={<ArrowRight style={{ width: 16, height: 16 }} />}
                    sx={{
                      color: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: `${theme.palette.primary.main}10`,
                      },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight style={{ width: 20, height: 20 }} />}
            sx={{
              ...commonStyles.gradientButton(theme),
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
            href="/home"
          >
            View All Posts
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogSection; 