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
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppWindow, BadgeCheck, DollarSign, Plus, Search } from "lucide-react";
import Link from "next/link";
import {
  getGlassStyles,
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../utils/themeUtils";
import SubmitAppCTA from "./SubmitAppCTA";
import { useEffect, useState } from "react";
import { fetchCategoriesFromAPI } from "../../../utils/categories";

// Categories will be fetched from API
interface Category {
  _id: string;
  name: string;
  slug: string;
  type: 'app' | 'blog' | 'both';
  description?: string;
  icon?: string;
  color?: string;
}

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [apps, setApps] = useState(initialApps);
  const [featuredApps, setFeaturedApps] = useState(initialFeaturedApps);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotalApps / 12));
  const [totalApps, setTotalApps] = useState(initialTotalApps);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchCategoriesFromAPI('app');
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter apps based on search query
  const filteredApps = apps.filter((app) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.authorName?.toLowerCase().includes(query) ||
      app.author?.toLowerCase().includes(query) ||
      (app.tags && app.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (app.techStack && app.techStack.some(tech => tech.toLowerCase().includes(query)))
    );
  });

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const renderAppCard = (app) => {
    // Convert MongoDB ObjectId to string for safe usage
    const appId = app._id?.toString() || app._id;
    
    return (
    <Paper
      key={appId}
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
        // Subtle premium indicator
        ...(app.isPremium && {
          border: `1px solid ${theme.palette.primary.main}`,
        })
      }}
    >
      {/* App Image Section */}
      {app.imageUrl && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: { xs: 140, sm: 160 },
              backgroundImage: `url('${app.imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {app.isPremium && (
            <Box sx={{ position: "absolute", top: 12, left: 12 }}>
              <Chip
                label="Premium"
                size="small"
                sx={{ 
                  fontWeight: 600,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: getShadow(theme, "elegant"),
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Premium Badge for cards without images */}
        {!app.imageUrl && app.isPremium && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label="Premium"
              size="small"
              sx={{ 
                fontWeight: 600,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: getShadow(theme, "elegant"),
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            />
          </Box>
        )}

        {/* App Header with Author */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mb: 2 }}>
          <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, bgcolor: theme.palette.primary.main }}>
            <AppWindow size={isMobile ? 14 : 16} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              fontWeight={600} 
              color="text.primary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              {app.authorName || app.author}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              Developer
            </Typography>
          </Box>
        </Box>

        {/* App Title */}
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
          {app.name}
        </Typography>

        {/* App Description */}
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
          {app.description}
        </Typography>

        {/* Category and Additional Categories */}
        <Box sx={{ mb: 2 }}>
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
            {/* Main Category */}
            {app.category && (
              <Chip 
                size="small" 
                label={app.category} 
                variant="filled"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                }}
              />
            )}
            
            {/* Additional Categories (Subcategories) */}
            {app.subcategories?.slice(0, isMobile ? 2 : 3).map((subcat, i) => (
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
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            ))}
            
            {/* Show total count if there are more subcategories */}
            {app.subcategories && app.subcategories.length > (isMobile ? 2 : 3) && (
              <Chip 
                size="small" 
                label={`+${app.subcategories.length - (isMobile ? 2 : 3)}`} 
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.background.paper,
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Tags - align with blogs */}
        {app.tags?.length > 0 && (
          <Box sx={{ mb: 2 }}>
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
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {app.tags?.slice(0, 3).map((tag, i) => (
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
              {app.tags && app.tags.length > 3 && (
                <Chip 
                  size="small" 
                  label={`+${app.tags.length - 3}`} 
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

        {/* Tech Stack - Show separately if exists */}
        {app.techStack?.length > 0 && (
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
              Technologies
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {app.techStack?.slice(0, isMobile ? 2 : 3).map((tech, i) => (
                <Chip 
                  key={`tech-${i}`} 
                  size="small" 
                  label={tech} 
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.secondary.main,
                    borderColor: theme.palette.secondary.main,
                    backgroundColor: theme.palette.secondary.light + '10',
                    fontSize: { xs: "0.65rem", sm: "0.7rem" },
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.contrastText,
                    },
                  }}
                />
              ))}
              {app.techStack && app.techStack.length > (isMobile ? 2 : 3) && (
                <Chip 
                  size="small" 
                  label={`+${app.techStack.length - (isMobile ? 2 : 3)}`} 
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper,
                    fontSize: { xs: "0.65rem", sm: "0.7rem" },
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Pricing and Stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: "text.secondary",
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
          mt: "auto",
          mb: 2,
          p: { xs: 1, sm: 1.5 },
          bgcolor: theme.palette.action.hover,
          borderRadius: 1,
        }}>
          <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <DollarSign size={isMobile ? 12 : 14} />
              <Typography variant="caption" fontWeight={600}>
                {app.isPremium ? 'Premium' : (app.pricing || 'Free')}
              </Typography>
            </Box>
            {app.views && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="caption">
                  {app.views} views
                </Typography>
              </Box>
            )}
          </Box>
          {app.likes && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="caption">
                {app.likes} likes
              </Typography>
            </Box>
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
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: 1,
                fontWeight: 600,
                borderColor: theme.palette.divider,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }
              }}
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
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: 1,
                fontWeight: 600,
                borderColor: theme.palette.divider,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }
              }}
            >
              View Code
            </Button>
          )}

          {/* Only show View Details for featured apps */}
          {featuredApps.some(featuredApp => featuredApp._id?.toString() === app._id?.toString()) && (
            <Button
              component={Link}
              href={`/launch/${app.slug}`}
              variant="outlined"
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: 1, 
                fontWeight: 600,
                borderColor: theme.palette.divider,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }
              }}
            >
              View Details
            </Button>
          )}
        </Box>

        {/* Featured Badge - if app is in featured section */}
        {featuredApps.some(featuredApp => featuredApp._id?.toString() === app._id?.toString()) && (
          <Box sx={{ 
            mt: 2, 
            display: "flex", 
            justifyContent: "center" 
          }}>
            <Chip
              label="Featured"
              size="small"
              sx={{ 
                fontWeight: 600,
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                boxShadow: getShadow(theme, "elegant"),
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
  }

  // Get unique filters (combine categories and common tags)
  const allFilters = ["All", ...categories.map(cat => ({ name: cat.name, slug: cat.slug })), "Free", "Freemium", "Premium"];

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: { xs: 4, sm: 6, md: 10 } }}>
      {/* Hero */}
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
          Discover{" "}
          <Box component="span" sx={commonStyles.textGradient(theme)}>
            Innovative Apps
          </Box>
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            color: "text.secondary",
            mt: { xs: 2, sm: 3 },
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.5,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Explore featured tools and user-submitted apps that boost
          productivity, creativity, and more.
        </Typography>
      </Box>

      {/* Filter Section (search commented out for later enablement) */}
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
        {/**
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              placeholder="Search apps, tags, or authors..."
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
        */}
        
        <Box sx={{ 
          display: "flex", 
          gap: { xs: 0.5, sm: 1 }, 
          flexWrap: "wrap", 
          justifyContent: "center", 
          mt: { xs: 2, sm: 3 } 
        }}>
          {allFilters.map((filter) => {
            // Handle different filter types
            if (filter === "All") {
              return (
                <Chip
                  key="All"
                  label="All"
                  onClick={() => setSelectedFilter("All")}
                  color={selectedFilter === "All" ? "primary" : "default"}
                  variant={selectedFilter === "All" ? "filled" : "outlined"}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    fontWeight: 500, 
                    cursor: "pointer",
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
              );
            } else if (typeof filter === "string") {
              // Handle pricing filters
              return (
                <Chip
                  key={filter}
                  label={filter}
                  onClick={() => setSelectedFilter(filter)}
                  color={selectedFilter === filter ? "primary" : "default"}
                  variant={selectedFilter === filter ? "filled" : "outlined"}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    fontWeight: 500, 
                    cursor: "pointer",
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
              );
            } else {
              // Handle category filters
              return (
                <Chip
                  key={filter.slug}
                  label={filter.name}
                  onClick={() => {
                    // Navigate to category page using slug
                    window.location.href = `/launch/category/${filter.slug}`;
                  }}
                  color={selectedFilter === filter.name ? "primary" : "default"}
                  variant={selectedFilter === filter.name ? "filled" : "outlined"}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    fontWeight: 500, 
                    cursor: "pointer",
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
              );
            }
          })}
        </Box>
      </Paper>

      <SubmitAppCTA />

      {/* Featured Apps */}
      {featuredApps.length > 0 && (
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
            Apps{" "}
            <Typography 
              component="span" 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 400,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              (Paid apps from the last 7 days)
            </Typography>
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {featuredApps.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app._id?.toString() || app._id}>
                {renderAppCard(app)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Apps Section */}
      <Box sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant={isMobile ? "h6" : "h6"}
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          All Apps
        </Typography>
      </Box>

      {/* Apps Grid */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 3, sm: 4 } }}>
          <CircularProgress size={isMobile ? 40 : 60} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {filteredApps.length > 0 ? (
            <>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {filteredApps.map((app) => (
                  <Grid item xs={12} sm={6} md={4} key={app._id?.toString() || app._id}>
                    {renderAppCard(app)}
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
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                No apps found
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
                {searchQuery || selectedFilter !== "All" 
                  ? "Try adjusting your search or filter criteria."
                  : "Be the first to submit your app to the community!"
                }
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 