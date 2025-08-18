"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
  Stack,
} from "@mui/material";
import {
  Search,
  School,
  CalendarMonth,
  AccessTime,
  Person,
  FilterList,
  Code,
  Storage,
  Cloud,
  Security,
  PhoneAndroid,
  Language,
  ArrowForward,
  MenuBook,
} from "@mui/icons-material";
import Link from "next/link";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "../../../utils/themeUtils";

interface LearnPage {
  _id: string;
  title: string;
  meta_description: string;
  domain: string;
  slug: string;
  canonical_url: string;
  keywords: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  author: {
    name: string;
    bio: string;
    profilePicture?: string;
  };
}

interface LearnIndexClientProps {
  initialPages: LearnPage[];
  domains: string[];
}

// Domain icons mapping
const domainIcons: Record<string, React.ReactElement> = {
  javascript: <Code />,
  typescript: <Code />,
  react: <Language />,
  nextjs: <Language />,
  nodejs: <Code />,
  database: <Storage />,
  cloud: <Cloud />,
  security: <Security />,
  mobile: <PhoneAndroid />,
  web: <Language />,
  default: <School />,
};

// Get domain icon
const getDomainIcon = (domain: string) => {
  const lowerDomain = domain.toLowerCase();
  for (const [key, icon] of Object.entries(domainIcons)) {
    if (lowerDomain.includes(key)) return icon;
  }
  return domainIcons.default;
};

// Calculate read time
const calculateReadTime = (content: string) => {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / 200);
};

const LearnIndexClient: React.FC<LearnIndexClientProps> = ({
  initialPages,
  domains,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Filter and sort pages
  const filteredPages = useMemo(() => {
    let filtered = initialPages;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        page =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.meta_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by domain
    if (selectedDomain !== "all") {
      filtered = filtered.filter(page => page.domain === selectedDomain);
    }

    // Sort pages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialPages, searchQuery, selectedDomain, sortBy]);

  return (
    <Box component="main" sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: "60vh", sm: "70vh" }, // shorter hero
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          pt: { xs: 4, sm: 6 },
          pb: { xs: 4, sm: 6 },
          px: { xs: 1, sm: 2 },
          // no hard border; rely on gradient fade
        }}
      >
        {/* Background Effects - softer */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: theme.custom?.gradients?.hero || 'linear-gradient(135deg, hsl(263 70% 50%) 0%, hsl(220 70% 50%) 50%, hsl(280 70% 50%) 100%)',
            opacity: theme.palette.mode === 'light' ? 0.02 : 0.04,
            zIndex: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* extra bottom fade to neutralize any residual color banding */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: { xs: 140, sm: 180 },
            pointerEvents: 'none',
            background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${theme.palette.background.default} 80%, ${theme.palette.background.default} 100%)`,
            zIndex: 1,
          }}
        />

        {/* Shapes toned down */}
        <Box
          sx={{
            position: "absolute",
            top: "22%",
            left: { xs: "6%", sm: "25%" },
            width: { xs: 120, sm: 220 },
            height: { xs: 120, sm: 220 },
            bgcolor: theme.palette.primary.main,
            opacity: theme.palette.mode === 'light' ? 0.05 : 0.10,
            borderRadius: "50%",
            filter: "blur(48px)",
            animation: theme.custom?.animations?.float || "float 6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "22%",
            right: { xs: "6%", sm: "25%" },
            width: { xs: 150, sm: 300 },
            height: { xs: 150, sm: 300 },
            bgcolor: theme.palette.primary.main,
            opacity: theme.palette.mode === 'light' ? 0.04 : 0.08,
            borderRadius: "50%",
            filter: "blur(48px)",
            animation: theme.custom?.animations?.float || "float 6s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          {/* Badge */}
          <Paper
            elevation={3}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 2 },
              mb: { xs: 3, sm: 5 },
              borderRadius: "999px",
              ...getGlassStyles(theme),
              boxShadow: theme.custom?.shadows?.elegant || "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <School style={{ width: 20, height: 20, color: theme.palette.primary.main }} />
            <Typography 
              variant="body2" 
              fontWeight={600} 
              sx={{ 
                color: theme.palette.text.primary,
                fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                letterSpacing: '0.025em'
              }}
            >
              Learning Hub
            </Typography>
          </Paper>

          {/* Main Heading */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.4rem', md: '3rem' },
              fontWeight: 800,
              lineHeight: { xs: 1.2, md: 1.1 },
              letterSpacing: { xs: '-0.02em', md: '-0.03em' },
              color: theme.palette.text.primary,
              mb: { xs: 1.5, sm: 2.5 },
            }}
          >
            Master {" "}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                ...commonStyles.textGradient(theme),
                fontWeight: 800,
              }}
            >
              Development Skills
            </Box>
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h6"
            sx={{
              mb: { xs: 3, sm: 5 },
              maxWidth: 700,
              mx: "auto",
              color: theme.palette.text.secondary,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              lineHeight: 1.6,
              px: { xs: 1, sm: 0 }
            }}
          >
            Explore comprehensive guides, tutorials, and insights across various domains to enhance your knowledge and skills.
          </Typography>

          {/* Stats */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: { xs: 4, sm: 6 } }}>
            <Grid item>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {initialPages.length}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Resources
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {domains.length}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Domains
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search and Filter Section with eased top spacing */}
      <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 3 }, mt: { xs: -14, sm: -16 }, position: 'relative', zIndex: 2, pb: { xs: 4, sm: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: "16px",
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search learning resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>

            {/* Domain Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Domain</InputLabel>
                <Select
                  value={selectedDomain}
                  label="Domain"
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  sx={{ borderRadius: "12px" }}
                >
                  <MenuItem value="all">All Domains</MenuItem>
                  {domains.map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as any)}
                  sx={{ borderRadius: "12px" }}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="title">Alphabetical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <FilterList sx={{ color: theme.palette.primary.main }} />
          <Typography variant="body2" color="text.secondary">
            {filteredPages.length} of {initialPages.length} learning resources
            {selectedDomain !== "all" && ` in ${selectedDomain}`}
          </Typography>
        </Box>

        {/* Learning Resources Grid */}
        {filteredPages.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: "12px" }}>
            No learning resources found matching your criteria. Try adjusting your search or filters.
          </Alert>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {filteredPages.map((page) => (
              <Grid item xs={12} sm={6} md={4} key={page._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    ...getGlassStyles(theme),
                    boxShadow: getShadow(theme, 'elegant'),
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: getShadow(theme, 'neon'),
                    },
                  }}
                >
                  {/* Card Media */}
                  {page.image_url ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={page.image_url}
                      alt={page.title}
                      sx={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: theme.palette.action.hover,
                        color: theme.palette.text.secondary,
                        position: "relative",
                      }}
                    >
                      {getDomainIcon(page.domain)}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: theme.palette.primary.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <MenuBook />
                      </Box>
                    </Box>
                  )}

                  {/* Domain Badge */}
                  <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                    <Chip
                      label={page.domain}
                      size="small"
                      icon={getDomainIcon(page.domain)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: "24px",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    {/* Title */}
                    <Typography
                      variant={isMobile ? "h6" : "h6"}
                      sx={{
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        fontWeight: 600,
                        mb: { xs: 1, sm: 1.5 },
                        color: theme.palette.text.primary,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.3,
                      }}
                    >
                      {page.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: { xs: 1.5, sm: 2 },
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {page.meta_description}
                    </Typography>

                    {/* Meta Information */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Person sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {page.author.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CalendarMonth sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(page.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {calculateReadTime(page.meta_description)} min
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Keywords */}
                    {page.keywords && (
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {page.keywords.split(',').slice(0, 3).map((keyword, index) => (
                            <Chip
                              key={index}
                              label={keyword.trim()}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: "0.7rem",
                                height: "20px",
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ 
                    justifyContent: 'center', 
                    pb: { xs: 2, sm: 2 },
                    px: { xs: 2, sm: 3 }
                  }}>
                    <Button
                      component={Link}
                      href={page.canonical_url}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      endIcon={<ArrowForward />}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.75, sm: 1 },
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                        }
                      }}
                    >
                      Start Learning
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default LearnIndexClient; 