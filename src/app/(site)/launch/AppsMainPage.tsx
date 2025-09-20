"use client";

import React from 'react';
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
import { useEffect, useMemo, useState } from "react";
import { fetchCategoriesFromAPI } from "../../../utils/categories";
import VoteButton from '@/features/tools/components/VoteButton';
import { computeAppScore } from '@/features/ranking/score';
import { useVoteContext } from '@/features/votes/VoteProvider';

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
  votingEndTime?: string;
  isVotingActive?: boolean;
}

export default function AppsMainPage({ 
  initialApps, 
  initialFeaturedApps, 
  initialTotalApps,
  categoryChips = [],
  allAppsCount = 0,
  initialAllApps = [],
  votingEndTime,
  isVotingActive: globalVotingActive = false
}: AppsMainPageProps) {
  const [apps, setApps] = useState(initialApps);
  const [featuredApps, setFeaturedApps] = useState(initialFeaturedApps);
  const [allApps, setAllApps] = useState(initialAllApps);
  const [totalApps, setTotalApps] = useState(initialTotalApps);
  
  // Update local state when props change
  useEffect(() => {
    setApps(initialApps);
    setFeaturedApps(initialFeaturedApps);
    setAllApps(initialAllApps);
    setTotalApps(initialTotalApps);
  }, [initialApps, initialFeaturedApps, initialAllApps, initialTotalApps]);

  const theme = useTheme();
  console.log('🔍 THEME DEBUG - AppsMainPage theme loaded:', {
    themeExists: !!theme,
    paletteExists: !!theme?.palette,
    primaryExists: !!theme?.palette?.primary,
    primaryMain: theme?.palette?.primary?.main,
    secondaryMain: theme?.palette?.secondary?.main,
    successMain: theme?.palette?.success?.main,
    warningMain: theme?.palette?.warning?.main
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const debugMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';
  const testMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('test') === '1';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotalApps / 12));
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [todayPremium, setTodayPremium] = useState<any[]>([]);
  const [todayNonPremium, setTodayNonPremium] = useState<any[]>([]);
console.log("mukban 23 ")
  // No need to gate rendering; useMediaQuery uses noSsr to avoid hydration mismatches

  // Categories should be passed as props from server-side ISR, not fetched client-side
  // This is a temporary fallback - categories should come from server
  useEffect(() => {
    if (categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const categoriesData = await fetchCategoriesFromAPI('app');
          setCategories(categoriesData);
        } catch {
          // ignore
        } finally {
          setCategoriesLoading(false);
        }
      };
      fetchCategories();
    } else {
      setCategoriesLoading(false);
    }
  }, [categories]);

  // Fetch today's launches from Voting API (only client-side fetch needed)
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const votingApiUrl = process.env.NEXT_PUBLIC_VOTING_API_URL || '';
        const res = await fetch(`${votingApiUrl}/api/launch/today`);
        if (!res.ok) return;
        const data = await res.json();
        setTodayPremium(data.premium || []);
        setTodayNonPremium(data.nonPremium || []);
      } catch (error) {
        console.error('Failed to fetch today\'s launches from Voting API:', error);
      }
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

  // Debug logging
  useEffect(() => {
    if (debugMode) {
      // eslint-disable-next-line no-console
      console.log('[Launch Listing Debug] apps sample:', (apps || []).slice(0, 5).map(a => ({
        _id: String(a._id || ''),
        slug: a.slug,
        name: a.name,
        isVerified: a.isVerified,
        verificationStatus: a.verificationStatus,
        verificationScore: a.verificationScore,
      })));
      // eslint-disable-next-line no-console
      console.log('[Launch Listing Debug] featured apps sample:', (featuredApps || []).slice(0, 3).map(a => ({
        slug: a.slug,
        name: a.name,
        verificationStatus: a.verificationStatus,
      })));
    }
  }, [debugMode, apps, featuredApps]);

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
        const url = `/api/user-apps/public?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        console.log(data);
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

  // Use centralized VoteProvider for counts
  const { getCount } = useVoteContext();

  // Premium-vote blended ranking for today's combined list
  const premiumVoteBonus = Number(process.env.NEXT_PUBLIC_PREMIUM_VOTE_BONUS ?? 15);
  const voteWeight = Number(process.env.NEXT_PUBLIC_VOTE_WEIGHT ?? 1);
  const todayCombined = useMemo(() => {
    const joined = [...(todayPremium || []), ...(todayNonPremium || [])];
    const withScore = joined.map((a: any) => {
      const id = String(a._id || a._id?.toString());
      const votes = getCount(id) ?? a.stats?.votes ?? a.likes ?? 0;
      const premiumBoost = a.isPremium ? premiumVoteBonus : 0;
      const score = (votes * voteWeight) + premiumBoost;
      return { app: a, score };
    });
    withScore.sort((x, y) => y.score - x.score);
    return withScore.map(x => x.app);
  }, [todayPremium, todayNonPremium, getCount, premiumVoteBonus, voteWeight]);

  // Determine if a launch is still within its voting window
  const isVotingActiveForApp = (a: any) => {
    if (!a) return false;
    if (a.votingFlushed) return false;
    if (!a.launchDate) return false;
    const duration = Number(a.votingDurationHours ?? 24);
    const endTime = new Date(a.launchDate).getTime() + duration * 3600_000;
    return Date.now() <= endTime;
  };

  // Auto-refetch today's lists at next UTC midnight to prevent lingering items when the tab stays open
  useEffect(() => {
    if (testMode) return; // skip midnight refetch in test mode
    const now = new Date();
    const nextUtcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 5));
    const delay = Math.max(1000, nextUtcMidnight.getTime() - Date.now());
    const timer = setTimeout(() => {
      (async () => {
        try {
          const votingApiUrl = process.env.NEXT_PUBLIC_VOTING_API_URL || '';
          const res = await fetch(`${votingApiUrl}/api/launch/today`);
          if (!res.ok) return;
          const data = await res.json();
          setTodayPremium(data.premium || []);
          setTodayNonPremium(data.nonPremium || []);
        } catch {}
      })();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  // Periodic refresh to capture post-flush state and move apps from Today to All Apps
  useEffect(() => {
    if (testMode) return; // skip auto-refresh in test mode
    const autoRefreshMs = Number(process.env.NEXT_PUBLIC_LAUNCH_AUTO_REFRESH_MS ?? 0);
    if (!Number.isFinite(autoRefreshMs) || autoRefreshMs <= 0) return;

    let cancelled = false;

    const refresh = async () => {
      try {
        // Refresh today's launches from Voting API
        const votingApiUrl = process.env.NEXT_PUBLIC_VOTING_API_URL || '';
        const resToday = await fetch(`${votingApiUrl}/api/launch/today`);
        if (resToday.ok) {
          const data = await resToday.json();
          if (!cancelled) {
            setTodayPremium(data.premium || []);
            setTodayNonPremium(data.nonPremium || []);
          }
        }

        // Refresh All Apps (page 1) and exclude items launching today
        const params = new URLSearchParams();
        params.append('approved', 'true');
        params.append('page', '1');
        params.append('limit', '12');
        const resAll = await fetch(`/api/user-apps/public?${params.toString()}`);
        if (resAll.ok) {
          const d = await resAll.json();
          const list = Array.isArray(d.apps) ? d.apps : [];
          const todayUtc = new Date();
          const y = todayUtc.getUTCFullYear();
          const m = String(todayUtc.getUTCMonth() + 1).padStart(2, '0');
          const da = String(todayUtc.getUTCDate()).padStart(2, '0');
          const start = new Date(`${y}-${m}-${da}T00:00:00.000Z`).getTime();
          const end = new Date(`${y}-${m}-${da}T23:59:59.999Z`).getTime();
          const nonToday = list.filter((a: any) => {
            const t = a.launchDate ? new Date(a.launchDate).getTime() : 0;
            return !(t >= start && t <= end);
          });
          if (!cancelled) {
            setAllApps(nonToday);
          }
        }
      } catch {}
    };

    // Run once and then at configured interval (testing only)
    refresh();
    const interval = setInterval(refresh, autoRefreshMs);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Compute ranking among currently visible apps based on external vote counts (fallback to likes)
  const getId = (a: any) => String(a._id || a._id?.toString());
  const scoreFor = (a: any) => {
    const voteCount = getCount(getId(a)) ?? 0;
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

  // Handle vote updates from VoteButton component
  const handleVoteUpdate = (toolId: string, voted: boolean) => {
    // This callback is triggered when a user votes/unvotes
    // The VoteButton component handles the actual vote count updates
    // We can optionally trigger a refresh or update local state here
    console.log(`Vote update for tool ${toolId}: ${voted ? 'voted' : 'unvoted'}`);
  };

  const renderAppCardHorizontal = (app: any, votingEnabled = false, showSpecialStyling = true) => {
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
          ...(showSpecialStyling && app.isPremium && { border: `1px solid ${theme.palette.primary.main}` }),
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
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                Launch: {new Date(app.launchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Typography>
            )}
          </Box>
          {/* Badges row below to avoid clashing with Launch date */}
          {(((showSpecialStyling && app.isPremium) || app.verificationStatus === 'verified')) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              {renderStandardBadges(app)}
            </Box>
          )}

          {/* Title and Description inside content */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, mt: 0.5 }}>
            {app.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mb: 1.5 }}>
            {app.description}
          </Typography>

          {/* Footer actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {showSpecialStyling && app.isPremium ? 'Featured' : (app.pricing || 'Free')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {(app.isPremium || app.verificationStatus === 'verified' || app.isTop3Today) && app.slug && (
                <Button 
                  component={Link} 
                  href={`/launch/${app.slug}`} 
                  variant="contained" 
                  size="small" 
                  sx={{ 
                    minWidth: 0, 
                    px: 1.5, 
                    py: 0.6, 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                    }
                  }}
                >
                  Details
                </Button>
              )}
              {app.website && (
                <Button 
                  component="a" 
                  href={app.website} 
                  target="_blank" 
                  rel={app.dofollow ? 'noopener noreferrer' : 'nofollow noopener noreferrer'} 
                  variant="contained" 
                  size="small" 
                  sx={{ 
                    minWidth: 0, 
                    px: 1.5, 
                    py: 0.6, 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
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
                  variant="contained" 
                  size="small" 
                  sx={{ 
                    minWidth: 0, 
                    px: 1.5, 
                    py: 0.6, 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Code
                </Button>
              )}
              <VoteButton 
                toolId={appId} 
                initialVotes={app.votes || app.stats?.votes || 0}
                launchDate={app.launchDate}
                disabled={!globalVotingActive || !app.inVoting}
                onVoteUpdate={handleVoteUpdate}
              />
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

  // Standardized badges used across all card variants
  const renderStandardBadges = (app: any) => {
    const chips: React.ReactNode[] = [];
    if (app.isPremium) {
      chips.push(
        <Chip
          key="featured"
          label="Featured"
          size="small"
          sx={{ 
            fontWeight: 700,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: getShadow(theme, 'elegant'),
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            '& .MuiChip-label': { fontSize: 11 }
          }}
          icon={<DollarSign size={14} />}
        />
      );
    }
    if (app.verificationStatus === 'verified' || app.isVerified) {
      chips.push(
        <Chip
          key="verified"
          size="small"
          icon={<BadgeCheck size={14} />}
          label="Verified"
          sx={{ 
            fontWeight: 700,
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            boxShadow: getShadow(theme, 'elegant'),
            border: '1px solid',
            borderColor: theme.palette.success.light,
            textTransform: 'uppercase',
            letterSpacing: 0.25,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            '& .MuiChip-label': { fontSize: 11 }
          }}
        />
      );
    }
    return <>{chips}</>;
  };

  const renderAppCard = (app: any) => {
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
            {(app.isPremium || app.verificationStatus === 'verified') && (
              <Box sx={{ position: "absolute", top: 12, left: 12, display: 'flex', gap: 1 }}>
                {renderStandardBadges(app)}
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: "flex", flexDirection: "column" }}>
          {!app.imageUrl && (app.isPremium || app.verificationStatus === 'verified') && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {renderStandardBadges(app)}
            </Box>
          )}

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

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
            {app.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
            {app.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="caption" color="text.secondary">
              {app.pricing || 'Free'}
            </Typography>
            
            <VoteButton 
              toolId={appId} 
              initialVotes={app.votes || app.stats?.votes || 0}
              launchDate={app.launchDate}
              disabled={!globalVotingActive || !app.inVoting}
              onVoteUpdate={handleVoteUpdate}
            />
          </Box>
        </Box>
      </Paper>
    );
  };

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
   <Box  role="main" sx={{ bgcolor: "background.default", py: { xs: 4, sm: 6, md: 10 } }}>

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
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    ...(selectedFilter === "All" && {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    })
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
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    ...(selectedFilter === filter && {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    })
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
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.contrastText,
                      borderColor: theme.palette.secondary.main,
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
        href="/dashboard/submit/app"
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
               Featured Launches Today
             </Box>
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2 }}>
                           {(testMode ? todayPremium : todayPremium.filter(isVotingActiveForApp)).map((app) => (
                 <Grid item xs={12} key={app._id?.toString() || app._id}>
                   {renderAppCardHorizontal(app, true, true)}
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
            <Box component="span" sx={{ color: theme.palette.secondary.main }}>
              Today's Launches
            </Box>
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2 }}>
                           {(testMode ? todayNonPremium : todayNonPremium.filter(isVotingActiveForApp)).map((app) => (
                 <Grid item xs={12} key={app._id?.toString() || app._id}>
                   {renderAppCardHorizontal(app, true, true)}
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
          <Box component="span" sx={{ color: theme.palette.secondary.main }}>
            All Apps
          </Box>
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
          {allApps.length > 0 ? (
            <>
              <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                                 {allApps.map((app) => (
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