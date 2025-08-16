"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Avatar,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search, Clock, Calendar, Plus } from "lucide-react";
import Badge from "@components/badges/Badge";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "../../../../utils/themeUtils";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  role: string;
  authorBio: string;
  isFounderStory: boolean;
  founderUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  readTime?: number;
  views?: number;
  likes?: number;
  slug?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

interface FounderStoryCardProps {
  blog: BlogPost;
}

function FounderStoryCard({ blog }: FounderStoryCardProps) {
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

export default function FounderStoriesPage() {
  const theme = useTheme();
  const [founderStories, setFounderStories] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    async function fetchFounderStories() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/blogs/public?founderStories=true');
        if (!res.ok) throw new Error("Failed to fetch founder stories");
        const data = await res.json();
        
        // API already filters for founder stories
        setFounderStories(data.blogs || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchFounderStories();
  }, []);

  // Filter logic
  const filteredStories = founderStories.filter((story) =>
    story.title.toLowerCase().includes(search.toLowerCase()) ||
    story.content.toLowerCase().includes(search.toLowerCase()) ||
    story.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

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
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h1" sx={typographyVariants.heroTitle}>
            Founder{" "}
            <Box component="span" sx={commonStyles.textGradient(theme)}>
              Stories
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
            Inspiring journeys from entrepreneurs who built something amazing. Discover the challenges, triumphs, and lessons learned.
          </Typography>
        </Box>

        {/* Search Section */}
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
          <TextField
            fullWidth
            size="medium"
            placeholder="Search founder stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        </Paper>

        {/* Write Founder Story CTA */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Have a founder story to share?
          </Typography>
          <Button
            component={Link}
            href="/dashboard/submission/blog"
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            sx={{ fontWeight: 600 }}
          >
            Submit Your Story
          </Button>
        </Box>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <Grid container spacing={4}>
            {filteredStories.map((story) => (
              <Grid item xs={12} sm={6} md={4} key={story._id}>
                <Link href={`/blogs/${story.slug || story._id}`} style={{ textDecoration: 'none' }}>
                  <FounderStoryCard blog={story} />
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {search ? 'No founder stories found matching your search.' : 'No founder stories available yet.'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {search 
                ? 'Try adjusting your search terms.'
                : 'Be the first to share your founder journey!'
              }
            </Typography>
            {!search && (
              <Button
                component={Link}
                href="/dashboard/submission/blog"
                variant="contained"
                color="primary"
                startIcon={<Plus size={18} />}
                sx={{ fontWeight: 600 }}
              >
                Submit Your First Story
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
