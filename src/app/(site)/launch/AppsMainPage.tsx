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
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import Link from "next/link";
import {
  getGlassStyles,
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../utils/themeUtils";
import UnifiedCTA from "../components/UnifiedCTA";
import { useEffect, useState } from "react";
import { fetchCategoriesFromAPI } from "../../../utils/categories";
import VoteButton from '@/features/tools/components/VoteButton';
import { computeAppScore } from '@/features/ranking/score';
import { useVotesContext } from '@/features/providers/VotesContext';

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
  categoryChips?: { category: string; count: number }[];
  allAppsCount?: number; // total approved apps excluding today's
  initialAllApps?: any[]; // non-today apps for All Apps section
}

export default function AppsMainPage({ 
  initialApps, 
  initialFeaturedApps, 
  initialTotalApps,
  categoryChips = [],
  allAppsCount,
  initialAllApps = []
}: AppsMainPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  const [apps, setApps] = useState(initialApps);
  const [featuredApps, setFeaturedApps] = useState(initialFeaturedApps);
  const [allAppsList, setAllAppsList] = useState(initialAllApps);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotalApps / 12));
  const [totalApps, setTotalApps] = useState(initialTotalApps);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [todayPremium, setTodayPremium] = useState<any[]>([]);
  const [todayNonPremium, setTodayNonPremium] = useState<any[]>([]);

  // No need to gate rendering; useMediaQuery uses noSsr to avoid hydration mismatches

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('[AppsMainPage] Fetching categories (client)...');
        const categoriesData = await fetchCategoriesFromAPI('app');
        console.log('[AppsMainPage] Categories fetched:', categoriesData?.length ?? 0);
        setCategories(categoriesData);
      } catch (error) {
        console.error('[AppsMainPage] Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch today's launches for top sections
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await fetch('/api/launch/today');
        if (!res.ok) return;
        const data = await res.json();
        setTodayPremium(data.premium || []);
        setTodayNonPremium(data.nonPremium || []);
      } catch {}
    };
    fetchToday();
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
        console.log('[AppsMainPage] Fetching apps with filter/page:', { selectedFilter, currentPage });
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
        const url = `/api/user-apps/public?${params.toString()}`;
        console.log('[AppsMainPage] Fetch URL:', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        console.log('[AppsMainPage] Apps fetched:', data?.apps?.length ?? 0, 'Total:', data?.total ?? 0);
        setApps(data.apps || []);
        setTotalPages(Math.ceil((data.total || 0) / 12));
        setTotalApps(data.total || 0);
      } catch (err: any) {
        console.error('[AppsMainPage] Fetch apps error:', err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [selectedFilter, currentPage, initialApps, initialTotalApps]);

  // Build ids for vote counts (visible apps on the page)
  const visibleIds = filteredApps.map(a => String(a._id || a._id?.toString())).filter(Boolean);
  const votes = useVotesContext(); // Use global vote context instead of individual fetching

  // Compute ranking among currently visible apps based on external vote counts (fallback to likes)
  const getId = (a: any) => String(a._id || a._id?.toString());
  const scoreFor = (a: any) => {
    const voteCount = votes?.[getId(a)] ?? 0;
    const likes = Number(a.likes ?? 0);
    const base = computeAppScore(a) || 0;
    // Likes carry more weight; votes supplement; base score provides tie-breaking/quality
    return likes * 1.0 + voteCount * 0.6 + base * 0.3;
  };
  const sortedFilteredApps = [...filteredApps].sort((a, b) => {
    const vb = scoreFor(b);
    const va = scoreFor(a);
    if (vb !== va) return vb - va;
    // Tie-breaker: premium first, then recency
    if (!!b.isPremium !== !!a.isPremium) return (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0);
    const tb = new Date(b.createdAt || 0).getTime();
    const ta = new Date(a.createdAt || 0).getTime();
    return tb - ta;
  });
  const rankMap: Record<string, number> = {};
  sortedFilteredApps.forEach((app, idx) => { rankMap[getId(app)] = idx + 1; });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderAppCardHorizontal = (app, votingEnabled: boolean = false) => {
    const appId = app._id?.toString() || app._id;
    return (
      <Paper
        key={appId}
        sx={{
          borderRadius: '1rem',
          overflow: 'hidden',
          background: theme.palette.background.paper,
          boxShadow: getShadow(theme, 'elegant'),
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          minHeight: { xs: 120, sm: 140 },
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-3px)', boxShadow: getShadow(theme, 'neon') },
          ...(app.isPremium && { border: `1px solid ${theme.palette.primary.main}` }),
        }}
      >
        {/* Image */}
        {app.imageUrl && (
          <Box
            sx={{
              width: { xs: 110, sm: 140 },
              backgroundImage: `url('${app.imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        {/* Content */}
        <Box sx={{ p: { xs: 1.5, sm: 2 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
            {rankMap[appId] !== undefined && (
              <Chip size="small" label={`#${rankMap[appId]}`} sx={{ fontWeight: 700 }} />
            )}
            {app.launchDate && (
              <Chip
                size="small"
                variant="outlined"
                label={`Launch: ${new Date(app.launchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
              />
            )}
            {app.isPremium && (
              <Chip size="small" label="Premium" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }} />
            )}
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {app.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {app.description?.slice(0, 120)}{app.description && app.description.length > 120 ? '…' : ''}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {app.isPremium ? 'Premium' : (app.pricing || 'Free')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Subtle compact buttons aligned to the far right */}
              {(app.isPremium || app.verificationStatus === 'verified' || app.isTop3Today) && app.slug && (
                <Button component={Link} href={`/launch/${app.slug}`} variant="outlined" size="small" sx={{ minWidth: 0, px: 1, py: 0.4, fontSize: '0.7rem' }}>Details</Button>
              )}
              {app.website && (
                <Button component="a" href={app.website} target="_blank" rel={app.dofollow ? 'noopener noreferrer' : 'nofollow noopener noreferrer'} variant="outlined" size="small" sx={{ minWidth: 0, px: 1, py: 0.4, fontSize: '0.7rem' }}>Visit</Button>
              )}
              {app.github && (
                <Button component="a" href={app.github} target="_blank" rel="noopener noreferrer" variant="outlined" size="small" sx={{ minWidth: 0, px: 1, py: 0.4, fontSize: '0.7rem' }}>Code</Button>
              )}
              {votingEnabled ? (
                <VoteButton toolId={appId} initialVotes={app.likes ?? 0} />
              ) : (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, border: '1px solid', borderColor: 'divider', color: 'text.disabled', borderRadius: 2, px: 1, py: 0.5 }}>
                  <ThumbUpAltOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
                  <Typography variant="body2" color="text.disabled">{(app.likes ?? 0)}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    );
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

        {/* Rank + Launch Date */}
        {(rankMap[appId] !== undefined || app.launchDate) && (
          <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {rankMap[appId] !== undefined && (
              <Chip
                size="small"
                label={`#${rankMap[appId]}`}
                color="default"
                sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
              />
            )}
            {app.launchDate && (
              <Chip
                size="small"
                variant="outlined"
                label={`Launch: ${new Date(app.launchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
              />
            )}
          </Box>
        )}

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
          {/* Vote button on listing (only on launch day cards) */}
          <VoteButton toolId={appId} initialVotes={app.likes ?? 0} />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          {app.website && (
            <Button
              component="a"
              href={app.website}
              target="_blank"
              rel={app.dofollow ? 'noopener noreferrer' : 'nofollow noopener noreferrer'}
              variant="outlined"
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: 1,
                fontWeight: 500,
                borderColor: theme.palette.divider,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'transparent',
                  color: theme.palette.text.primary,
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
                fontWeight: 500,
                borderColor: theme.palette.divider,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'transparent',
                  color: theme.palette.text.primary,
                }
              }}
            >
              View Code
            </Button>
          )}

          {/* View Details for premium, verified, or today's top-3; featured stays eligible */}
          {(featuredApps.some(f => f._id?.toString() === app._id?.toString()) || app.isPremium || app.verificationStatus === 'verified' || app.isTop3Today) && app.slug && (
            <Button
              component={Link}
              href={`/launch/${app.slug}`}
              variant="outlined"
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: 1, 
                fontWeight: 500,
                borderColor: theme.palette.divider,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'transparent',
                  color: theme.palette.text.primary,
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
  // If server-provided categoryChips are available, include counts in the label
  const categoryCountMap: Record<string, number> = (categoryChips || []).reduce((acc, item) => {
    acc[item.category] = item.count;
    return acc;
  }, {} as Record<string, number>);

  const allFilters = [
    "All",
    ...categories.map(cat => ({ name: cat.name, slug: cat.slug })),
    "Free",
    "Freemium",
    "Premium"
  ];

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
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant={isMobile ? "h6" : "h6"} sx={{ fontWeight: 700, mb: 1 }}>
            Browse by Category
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore apps organized by categories and pricing
          </Typography>
        </Box>
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
                  label={
                    categoryCountMap[filter.name] !== undefined
                      ? `${filter.name} (${categoryCountMap[filter.name]})`
                      : filter.name
                  }
                  component={Link as any}
                  href={`/launch/category/${filter.slug}`}
                  clickable
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    fontWeight: 500, 
                    cursor: "pointer",
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                />
              );
            }
          })}
        </Box>
      </Paper>

      <UnifiedCTA 
        title="Launch your app to thousands of developers 🚀"
        subtitle="Get featured, verified, and gain visibility in the dev community."
        href="/launch/submit"
        buttonText="Submit Your App"
      />

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

      {/* Premium Launches Today */}
      {todayPremium.length > 0 && (
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
              Premium Launches Today
            </Box>
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2 }}>
            {todayPremium.map((app) => (
              <Grid item xs={12} key={app._id?.toString() || app._id}>
                {renderAppCardHorizontal(app, true)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Today's Launches (Non-premium) */}
      {todayNonPremium.length > 0 && (
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
            <Box component="span" sx={{ color: theme.palette.text.primary }}>
              Today's Launches
            </Box>
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2 }}>
            {todayNonPremium.map((app) => (
              <Grid item xs={12} key={app._id?.toString() || app._id}>
                {renderAppCardHorizontal(app, true)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Apps Section (not launching today) */}
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
          {typeof allAppsCount === 'number' && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({allAppsCount.toLocaleString()})
            </Typography>
          )}
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
          {sortedFilteredApps.length > 0 ? (
            <>
              <Grid container spacing={{ xs: 2, sm: 2, md: 2 }}>
                {allAppsList.map((app) => (
                  <Grid item xs={12} key={app._id?.toString() || app._id}>
                    {renderAppCardHorizontal(app, false)}
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