"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search, AppWindow, BadgeCheck, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { getShadow } from '../../../../../../utils/themeUtils';
import { appTags } from '../../../../../../utils/categories';

interface App {
  _id: string;
  name: string;
  description: string;
  author: string;
  authorName?: string;
  website?: string;
  github?: string;
  tags: string[];
  techStack?: string[];
  pricing?: string;
  isPremium?: boolean;
  premiumPlan?: string;
  views?: number;
  likes?: number;
  slug: string;
  category?: string;
}

interface LaunchCategoryPageProps {
  category: string;
  page: number;
  tag?: string;
}

export default function LaunchCategoryPage({ category, page, tag }: LaunchCategoryPageProps) {
  const theme = useTheme();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(tag || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApps, setTotalApps] = useState(0);

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('approved', 'true');
        params.append('category', category);
        params.append('page', currentPage.toString());
        params.append('limit', '12');
        
        if (selectedTag) {
          params.append('tag', selectedTag);
        }

        const res = await fetch(`/api/user-apps/public?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch apps');
        
        const data = await res.json();
        setApps(data.apps || []);
        setTotalPages(Math.ceil((data.total || 0) / 12));
        setTotalApps(data.total || 0);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [category, currentPage, selectedTag]);

  const filteredApps = apps.filter(app => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      (app.tags && app.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (app.techStack && app.techStack.some(tech => tech.toLowerCase().includes(query)))
    );
  });

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? '' : tag;
    setSelectedTag(newTag);
    setCurrentPage(1);
    
    // Update URL
    const url = new URL(window.location.href);
    if (newTag) {
      url.searchParams.set('tag', newTag);
    } else {
      url.searchParams.delete('tag');
    }
    url.searchParams.delete('page');
    window.history.pushState({}, '', url.toString());
  };

  const renderAppCard = (app: App) => (
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
        <Chip
          icon={<DollarSign size={16} />}
          label={app.isPremium ? 'Premium' : (app.pricing || 'Free')}
          size="small"
          color={app.isPremium ? 'warning' : (app.pricing === 'Free' ? 'success' : 'primary')}
          variant="outlined"
        />
        
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {appTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color={selectedTag === tag ? "primary" : "default"}
              variant={selectedTag === tag ? "filled" : "outlined"}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {filteredApps.length} of {totalApps} apps in {category}{selectedTag && ` tagged with "${selectedTag}"`}
      </Typography>

      {/* Apps Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {filteredApps.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app._id}>
            {renderAppCard(app)}
          </Grid>
        ))}
      </Grid>

      {filteredApps.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No apps found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Box>
  );
} 