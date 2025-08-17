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
  Pagination,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search, AppWindow, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { getShadow, getGlassStyles, typographyVariants, commonStyles } from '@/utils/themeUtils';
import { fetchCategoryNames } from '@/utils/categories';

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
  views?: number;
  likes?: number;
  slug: string;
  category?: string;
  subcategories?: string[];
  imageUrl?: string;
}

interface LaunchCategoryPageProps {
  category: string;
  page: number;
  tag?: string;
  initialApps: App[];
  initialFeaturedApps: App[];
  initialTotalApps: number;
}

export default function LaunchCategoryPage({ 
  category, 
  page, 
  tag, 
  initialApps, 
  initialFeaturedApps, 
  initialTotalApps 
}: LaunchCategoryPageProps) {
  const theme = useTheme();
  const [apps, setApps] = useState<App[]>(initialApps);
  const [featuredApps, setFeaturedApps] = useState<App[]>(initialFeaturedApps);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotalApps / 12));
  const [totalApps, setTotalApps] = useState(initialTotalApps);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Filter apps based on search query
  const filteredApps = apps.filter(app => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.authorName?.toLowerCase().includes(query) ||
      app.author?.toLowerCase().includes(query) ||
      (app.tags && app.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (app.techStack && app.techStack.some(tech => tech.toLowerCase().includes(query))) ||
      (app.subcategories && app.subcategories.some(subcat => subcat.toLowerCase().includes(query)))
    );
  });

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fetch available categories for filtering
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategoryNames('app');
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to empty array
        setAvailableCategories([]);
      }
    };
    
    loadCategories();
  }, []);

  // Fetch additional data when page changes (not on initial load)
  useEffect(() => {
    if (currentPage === page && apps.length === initialApps.length) {
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
        params.append('approved', 'true');
        params.append('category', category);
        params.append('page', currentPage.toString());
        params.append('limit', '12');
        


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
  }, [category, currentPage, page, initialApps, initialTotalApps]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to the actual category page instead of filtering
    window.location.href = `/launch/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const renderAppCard = (app: App) => {
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
              height: 160,
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
                }}
              />
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
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
              }}
            />
          </Box>
        )}

        {/* App Header with Author */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
            <AppWindow size={16} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {app.authorName || app.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Developer
            </Typography>
          </Box>
        </Box>

        {/* App Title */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3, color: "text.primary" }}>
          {app.name}
        </Typography>

        {/* App Description */}
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 3, flex: 1, lineHeight: 1.5 }}
        >
          {app.description}
        </Typography>

        {/* Category and Additional Categories */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
            Categories
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
                  fontSize: "0.7rem",
                }}
              />
            )}
            
                         {/* Additional Categories (Subcategories) */}
             {app.subcategories && app.subcategories.length > 0 && app.subcategories.slice(0, 3).map((subcat, i) => (
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
                   fontSize: "0.7rem",
                   "&:hover": {
                     backgroundColor: theme.palette.action.hover,
                     borderColor: theme.palette.primary.main,
                   },
                 }}
               />
             ))}
             
             {/* Show total count if there are more subcategories */}
             {app.subcategories && app.subcategories.length > 3 && (
               <Chip 
                 size="small" 
                 label={`+${app.subcategories.length - 3}`} 
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

        {/* Tech Stack - Show separately if exists */}
        {app.techStack?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
              Technologies
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                           {app.techStack && app.techStack.length > 0 && app.techStack.slice(0, 3).map((tech, i) => (
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
                   fontSize: "0.7rem",
                   "&:hover": {
                     backgroundColor: theme.palette.secondary.main,
                     color: theme.palette.secondary.contrastText,
                   },
                 }}
               />
             ))}
             {app.techStack && app.techStack.length > 3 && (
               <Chip 
                 size="small" 
                 label={`+${app.techStack.length - 3}`} 
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

        {/* Pricing and Stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: "text.secondary",
          fontSize: "0.75rem",
          mt: "auto",
          mb: 2,
          p: 1.5,
          bgcolor: theme.palette.action.hover,
          borderRadius: 1,
        }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <DollarSign size={14} />
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
              size="small"
              sx={{ 
                flex: 1,
                fontWeight: 600,
                borderColor: theme.palette.divider,
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
              size="small"
              sx={{ 
                flex: 1,
                fontWeight: 600,
                borderColor: theme.palette.divider,
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
              variant="contained"
              size="small"
              sx={{ 
                flex: 1, 
                fontWeight: 600,
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
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
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
  };

  return (
    <Box>
      {/* Search and Filters */}
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
                     placeholder="Search apps, tags, or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, alignSelf: 'center' }}>
             Browse other categories:
           </Typography>
           {availableCategories.map((categoryName) => (
             <Chip
               key={categoryName}
               label={categoryName}
               onClick={() => handleCategoryClick(categoryName)}
               color="default"
               variant="outlined"
               size="small"
               sx={{ 
                 fontWeight: 500, 
                 cursor: "pointer",
                 "&:hover": {
                   backgroundColor: theme.palette.primary.main,
                   color: theme.palette.primary.contrastText,
                   borderColor: theme.palette.primary.main,
                 }
               }}
             />
           ))}
         </Box>
      </Paper>

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
            Apps{" "}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
              (Paid apps from the last 7 days)
            </Typography>
          </Typography>
          <Grid container spacing={3}>
            {featuredApps.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app._id?.toString() || app._id}>
                {renderAppCard(app)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Apps Section */}
      <Box sx={{ mt: 6, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          All {category} Apps
        </Typography>
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
          {filteredApps.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {filteredApps.map((app) => (
                  <Grid item xs={12} sm={6} md={4} key={app._id?.toString() || app._id}>
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
                    size="large"
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
                 {searchQuery 
                   ? "Try adjusting your search criteria."
                   : `No apps found in ${category} category.`
                 }
               </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 