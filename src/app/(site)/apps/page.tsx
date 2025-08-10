"use client";

import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search,
  Globe,
  Github,
  Star,
  Eye,
  ThumbsUp,
  Code,
  DollarSign,
} from "lucide-react";
import Badge from "@components/badges/Badge";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getGlassStyles,
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../utils/themeUtils";
import { Category } from "@mui/icons-material";

// App categories for filtering
const categories = [
  "All", "Productivity", "Development", "Design", "Marketing", 
  "Analytics", "Communication", "Finance", "Education", "Entertainment"
];

interface AppItem {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
  website: string;
  github: string;
  category: string;
  techStack: string[];
  pricing: string;
  features: string[];
  views: number;
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function AppsMainPage() {
  const theme = useTheme();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user-apps?approved=true");
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        setApps(data.apps || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  // Filter apps based on search, category, and tags
  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => app.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  // Get unique tags from all apps
  const allTags = Array.from(new Set(apps.flatMap(app => app.tags)));

  const renderAppCard = (app: AppItem) => (
    <Card
      key={app._id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...getGlassStyles(theme),
        boxShadow: getShadow(theme, "elegant"),
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: getShadow(theme, "elevated"),
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ flex: 1, mr: 2 }}>
            {app.name}
          </Typography>
          <Chip
            label={app.category}
            size="small"
            color="primary"
            variant="outlined"
            icon={<Category fontSize="medium" />}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
          {app.description}
        </Typography>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          {app.tags.slice(0, 4).map((tag, i) => (
            <Chip key={i} size="small" label={tag} variant="outlined" />
          ))}
          {app.tags.length > 4 && (
            <Chip size="small" label={`+${app.tags.length - 4}`} variant="outlined" />
          )}
        </Stack>
        {Array.isArray(app.techStack) && app.techStack.length > 0 && (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      display="block"
      mb={1}
    >
      Tech Stack
    </Typography>
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {app.techStack.slice(0, 3).map((tech, i) => (
        <Chip key={i} size="small" label={tech} variant="outlined" />
      ))}
    </Stack>
  </Box>
)}


        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            icon={<DollarSign size={16} />}
            label={app.pricing}
            size="small"
            color={app.pricing === 'Free' ? 'success' : 'primary'}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Eye size={16} />
            <Typography variant="caption">{app.views}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThumbsUp size={16} />
            <Typography variant="caption">{app.likes}</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          {app.website && (
            <Button
              component="a"
              href={app.website}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Globe size={16} />}
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
            >
              Visit
            </Button>
          )}
          {app.github && (
            <Button
              component="a"
              href={app.github}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Github size={16} />}
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
            >
              Code
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom sx={typographyVariants.h1}>
            Discover Amazing Apps
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Explore tools and applications built by our community
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            ...getGlassStyles(theme),
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? "primary" : "default"}
                    variant={selectedCategory === category ? "filled" : "outlined"}
                    clickable
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Apps Grid */}
        {filteredApps.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              ...getGlassStyles(theme),
              boxShadow: getShadow(theme, "elegant"),
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No apps found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or browse all categories.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedTags([]);
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredApps.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app._id}>
                {renderAppCard(app)}
              </Grid>
            ))}
          </Grid>
        )}

        {/* Submit Your App CTA */}
        <Paper
          sx={{
            p: 4,
            mt: 6,
            textAlign: 'center',
            ...getGlassStyles(theme),
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <Typography variant="h5" gutterBottom>
            Have an amazing app to share?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Submit your app to our community and get discovered by developers worldwide.
          </Typography>
          <Button
            component={Link}
            href="/dashboard/submission/app"
            variant="contained"
            size="large"
            startIcon={<Star size={20} />}
          >
            Submit Your App
          </Button>
        </Paper>
      </Container>
    </Box>
  );
} 