"use client";

import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppWindow, BadgeCheck, DollarSign, Search } from "lucide-react";

import {
  getGlassStyles,
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../utils/themeUtils";
import SubmitAppCTA from "./SubmitAppCTA";
import { useEffect, useState } from "react";

// --- Static Filters ---
const filters = [
  "All", "Free", "Freemium", "Premium", "AI", "Tools", "Design", "Productivity", 
  "Development", "Marketing", "Analytics", "Communication", "Finance", "Education", "Entertainment"
];

// --- Mock Featured Apps ---
const featuredApps = [
  {
    id: 1,
    name: "Design Spark",
    description: "A blazing fast Figma alternative for collaborative design.",
    author: "Mia Rodriguez",
    badges: ["Verified", "Premium"],
  },
  {
    id: 2,
    name: "CodePilot AI",
    description: "Autopilot your coding tasks with AI pair programming.",
    author: "Liam Chen",
    badges: ["AI", "Verified"],
  },
];

// --- Mock All Apps ---
const allApps = [
  {
    id: 101,
    name: "TaskFreak",
    description: "Minimalist task manager for developers.",
    author: "Alex K",
    badges: ["Free", "Verified"],
  },
  {
    id: 102,
    name: "MindWave",
    description: "Focus-enhancing ambient sound generator.",
    author: "Sasha M",
    badges: ["Free"],
  },
  {
    id: 103,
    name: "WebMock",
    description: "Mock API responses for frontend testing.",
    author: "Sam N",
    badges: ["Free", "Premium"],
  },
];

export default function AppsMainPage() {
  const theme = useTheme();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("approved", "true");
        if (selectedFilter !== "All") {
          // Check if it's a pricing filter
          if (["Free", "Freemium", "Premium"].includes(selectedFilter)) {
            params.append("pricing", selectedFilter);
          } else {
            // For other filters, check both category and tags
            params.append("category", selectedFilter);
            params.append("tag", selectedFilter);
          }
        }

        const res = await fetch(`/api/user-apps?${params.toString()}`);
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
  }, [selectedFilter]);

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.tags && Array.isArray(app.tags) && app.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      (app.techStack && Array.isArray(app.techStack) && app.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      ))
  );

  const renderBadges = (badges: string[]) => {
    const getBadgeStyles = (badge: string) => {
      const baseColor =
        badge === "Verified"
          ? theme.palette.success.main
          : badge === "Premium"
          ? theme.palette.warning.main
          : theme.palette.primary.main;

      return {
        borderColor: baseColor,
        color: baseColor,
        backgroundColor: "transparent",
        boxShadow: `0 0 0 1px ${baseColor}`,
        fontWeight: 600,
        borderRadius: "999px",
        px: 1.2,
      };
    };

    const getIcon = (badge: string) => {
      const size = 16;
      const color =
        badge === "Verified"
          ? theme.palette.success.main
          : badge === "Premium"
          ? theme.palette.warning.main
          : theme.palette.primary.main;

      if (badge === "Verified") return <BadgeCheck size={size} color={color} />;
      if (badge === "Premium") return <DollarSign size={size} color={color} />;
      return undefined;
    };

    return (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
        {(badges || []).map((badge) => (
          <Chip
            key={badge}
            size="small"
            variant="outlined"
            label={badge}
            icon={getIcon(badge)}
            sx={getBadgeStyles(badge)}
          />
        ))}
      </Box>
    );
  };

  const renderAppCard = (app) => (
    <Paper
      key={app._id}
      sx={{
        p: 3,
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: theme.palette.background.paper,
        boxShadow: getShadow(theme, "elegant"),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar>
          <AppWindow size={18} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{app.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            by {app.authorName || app.author}
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ mb: 2, color: "text.secondary" }}
      >
        {app.description}
      </Typography>

      {/* Tech Stack */}
      {app.techStack && Array.isArray(app.techStack) && app.techStack.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Tech Stack
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {app.techStack.slice(0, 3).map((tech, i) => (
              <Chip key={i} size="small" label={tech} variant="outlined" />
            ))}
            {app.techStack.length > 3 && (
              <Chip size="small" label={`+${app.techStack.length - 3}`} variant="outlined" />
            )}
          </Box>
        </Box>
      )}

      {/* Tags */}
      {app.tags && Array.isArray(app.tags) && app.tags.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {app.tags.slice(0, 4).map((tag, i) => (
              <Chip key={i} size="small" label={tag} variant="outlined" />
            ))}
            {app.tags.length > 4 && (
              <Chip size="small" label={`+${app.tags.length - 4}`} variant="outlined" />
            )}
          </Box>
        </Box>
      )}

      {/* Pricing and Stats */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 'auto' }}>
        {app.pricing && (
          <Chip
            icon={<DollarSign size={16} />}
            label={app.pricing}
            size="small"
            color={app.pricing === 'Free' ? 'success' : 'primary'}
            variant="outlined"
          />
        )}
        {app.views && (
          <Typography variant="caption" color="text.secondary">
            {app.views} views
          </Typography>
        )}
        {app.likes && (
          <Typography variant="caption" color="text.secondary">
            {app.likes} likes
          </Typography>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        {app.website && (
          <Button
            component="a"
            href={app.website}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
          >
            Visit App
          </Button>
        )}
        {app.github && (
          <Button
            component="a"
            href={app.github}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
          >
            View Code
          </Button>
        )}
        {!app.website && !app.github && (
          <Button
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
          >
            View Details
          </Button>
        )}
      </Box>

      {renderBadges(app.badges || [])}
    </Paper>
  );

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="lg">
        {/* Hero */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" sx={typographyVariants.sectionTitle}>
            Discover{" "}
            <Box component="span" sx={commonStyles.textGradient}>
              Innovative Apps
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mt: 2,
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Explore featured tools and user-submitted apps that boost
            productivity, creativity, and more.
          </Typography>
        </Box>

        {/* Filters */}
        <Paper
          sx={{
            mb: 6,
            px: 2,
            py: 3,
            borderRadius: "1rem",
            ...getGlassStyles(theme),
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "center",
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <TextField
            size="small"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 240 }}
          />
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => setSelectedFilter(filter)}
              variant={selectedFilter === filter ? "filled" : "outlined"}
              sx={{
                fontWeight: 500,
                color:
                  selectedFilter === filter
                    ? "white"
                    : theme.palette.text.primary,
                backgroundColor:
                  selectedFilter === filter
                    ? theme.palette.primary.main
                    : "transparent",
                borderColor: theme.palette.divider,
                "&:hover": {
                  backgroundColor:
                    selectedFilter === filter
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover,
                },
              }}
            />
          ))}
        </Paper>

        <SubmitAppCTA />

        {/* Featured Apps */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
          >
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              Featured
            </Box>{" "}
            Apps
          </Typography>
          <Grid container spacing={4}>
            {featuredApps.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app.id}>
                {renderAppCard(app)}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* All Apps */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
            >
              All Apps
            </Typography>
            <Grid container spacing={4}>
              {filteredApps.map((app) => (
                <Grid item xs={12} sm={6} md={4} key={app._id}>
                  {renderAppCard(app)}
                </Grid>
              ))}
            </Grid>
            {filteredApps.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No apps found matching your criteria.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

