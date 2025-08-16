"use client";

import {
  Box,
  Typography,
  Chip,
  Paper,
  Avatar,
  Button,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppWindow, BadgeCheck, DollarSign, Plus } from "lucide-react";
import Link from "next/link";
import {
  getGlassStyles,
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../utils/themeUtils";
import SubmitAppCTA from "./SubmitAppCTA";
import { useEffect, useState } from "react";
import { appCategories, appTags } from "../../../utils/categories";

interface AppsMainPageProps {
  initialApps: any[];
  initialFeaturedApps: any[];
  initialTotalApps: number;
}

export default function AppsMainPage({ 
  initialApps, 
  initialFeaturedApps, 
  initialTotalApps 
}: AppsMainPageProps) {
  const theme = useTheme();

  const [apps, setApps] = useState(initialApps);
  const [featuredApps, setFeaturedApps] = useState(initialFeaturedApps);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotalApps / 12));
  const [totalApps, setTotalApps] = useState(initialTotalApps);

  // Only fetch additional data when filter or page changes (not on initial load)
  useEffect(() => {
    if (selectedFilter === "All" && currentPage === 1) {
      // Use initial data for default state
      setApps(initialApps);
      setTotalPages(Math.ceil(initialTotalApps / 12));
      setTotalApps(initialTotalApps);
      return;
    }

    async function fetchApps() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("approved", "true");
        params.append("page", currentPage.toString());
        params.append("limit", "12");
        
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

        // Use public apps API to support unauthenticated browsing
        const res = await fetch(`/api/user-apps/public?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        setApps(data.apps || []);
        setTotalPages(Math.ceil((data.total || 0) / 12));
        setTotalApps(data.total || 0);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [selectedFilter, currentPage, initialApps, initialTotalApps]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: theme.palette.background.paper,
        boxShadow: getShadow(theme, "elegant"),
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: getShadow(theme, "neon"),
        },
        // Add special styling for premium apps
        ...(app.isPremium && {
          border: `2px solid ${theme.palette.warning.main}`,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.warning.light}10 100%)`
        })
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
        {/* Premium Badge */}
        {app.isPremium && (
          <Chip
            label="Premium"
            color="warning"
            size="small"
            icon={<DollarSign size={16} />}
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      <Typography
        variant="body2"
        sx={{ mb: 2, color: "text.secondary", flex: 1 }}
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
        {/* Pricing Chip */}
        <Chip
          icon={<DollarSign size={16} />}
          label={app.isPremium ? 'Premium' : (app.pricing || 'Free')}
          size="small"
          color={app.isPremium ? 'warning' : (app.pricing === 'Free' ? 'success' : 'primary')}
          variant="outlined"
        />
        
        {/* Stats */}
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
      <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
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

        {/* always shown */}
        <Button
          component={Link}
          href={`/launch/${app.slug}`}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        >
          View Details
        </Button>
      </Box>

      {/* Premium Plan Info */}
      {app.premiumPlan && (
        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="caption" color="warning.dark" fontWeight={600}>
            Premium Plan: {app.premiumPlan}
          </Typography>
        </Box>
      )}
    </Paper>
  );

  // Get unique tags for filter (combine app categories and tags)
  const allFilters = ["All", ...appCategories, ...appTags.slice(0, 15)];

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      {/* Hero */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h1" sx={typographyVariants.heroTitle}>
          Discover{" "}
          <Box component="span" sx={commonStyles.textGradient(theme)}>
            Innovative Apps
          </Box>
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "text.secondary",
            mt: 3,
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.5,
          }}
        >
          Explore featured tools and user-submitted apps that boost
          productivity, creativity, and more.
        </Typography>
      </Box>

      {/* Filter Section */}
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
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
          {allFilters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => {
                if (filter === "All") {
                  setSelectedFilter("All");
                } else {
                  // Navigate to category page
                  window.location.href = `/launch/category/${filter.toLowerCase()}`;
                }
              }}
              color={selectedFilter === filter ? "primary" : "default"}
              variant={selectedFilter === filter ? "filled" : "outlined"}
              sx={{ fontWeight: 500, cursor: "pointer" }}
            />
          ))}
        </Box>
      </Paper>

      <SubmitAppCTA />

      {/* Featured Apps */}
      {featuredApps.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
          >
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              Featured
            </Box>{" "}
            Apps
          </Typography>
          <Grid container spacing={3}>
            {featuredApps.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app._id}>
                {renderAppCard(app)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Apps Section */}
      <Box sx={{ mt: 6, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            All Apps
          </Typography>
          <Button
            component={Link}
            href="/dashboard/submission/app"
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            sx={{ fontWeight: 600 }}
          >
            Submit App
          </Button>
        </Box>
      </Box>

      {/* Apps Grid */}
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
        <>
          {apps.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {apps.map((app) => (
                  <Grid item xs={12} sm={6} md={4} key={app._id}>
                    {renderAppCard(app)}
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
              <Typography variant="h6" color="text.secondary">
                No apps found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedFilter !== "All" 
                  ? "Try adjusting your filter criteria."
                  : "Be the first to submit your app to the community!"
                }
              </Typography>
              {selectedFilter === "All" && (
                <Button
                  component={Link}
                  href="/dashboard/submission/app"
                  variant="contained"
                  color="primary"
                  startIcon={<Plus size={18} />}
                  sx={{ fontWeight: 600 }}
                >
                  Submit Your First App
                </Button>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 