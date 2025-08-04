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

// --- Static Filters ---
const filters = ["All", "Free", "Verified", "Premium", "AI", "Tools", "Design", "Productivity"];

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

  const renderBadges = (badges: string[]) => {
    const theme = useTheme();
  
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
        {badges.map((badge) => (
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
  

  const renderAppCard = (app: typeof allApps[number]) => (
    <Paper
      key={app.id}
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Avatar>
          <AppWindow size={18} />
        </Avatar>
        <Box>
          <Typography fontWeight={600}>{app.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            by {app.author}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ mt: 1, mb: 2, color: "text.secondary" }}>
        {app.description}
      </Typography>

      {renderBadges(app.badges)}

      <Button
        variant="outlined"
        size="small"
        sx={{ mt: "auto", alignSelf: "start", borderRadius: "999px" }}
      >
        View App
      </Button>
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
          <Typography variant="h6" sx={{ color: "text.secondary", mt: 2, maxWidth: 700, mx: "auto" }}>
            Explore featured tools and user-submitted apps that boost productivity, creativity, and more.
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
              clickable
              variant="outlined"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          ))}
        </Paper>
        <SubmitAppCTA />
        {/* Featured Apps */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
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
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
            All Apps
          </Typography>
          <Grid container spacing={4}>
            {allApps.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app.id}>
                {renderAppCard(app)}
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination count={5} color="primary" shape="rounded" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
