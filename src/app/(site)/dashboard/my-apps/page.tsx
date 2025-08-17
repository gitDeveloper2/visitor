"use client";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Popover,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@mui/material/styles";
import { getShadow } from "../../../../utils/themeUtils";
import { InfoOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Badge from "@components/badges/Badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppDraftManager from "@/components/premium/AppDraftManager";
import Link from "next/link";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Add as Plus,
  Schedule as Clock,
  Warning as AlertTriangle,
  CheckCircle,
  CreditCard,
  CalendarToday as Calendar,
  Book as BookOpen,
  Refresh,
} from '@mui/icons-material';
import { generateVerificationBadgeHtml } from "@/components/badges/VerificationBadge";

interface AppItem {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  slug?: string;
  // Add category fields
  category?: string;
  subcategories?: string[];
  // Add premium fields
  isPremium?: boolean;
  premiumStatus?: string;
  premiumPlan?: string;
  pricing?: string;
  // Add stats fields
  views?: number;
  likes?: number;
  // Add verification fields
  verificationStatus?: 'verified' | 'pending' | 'needs_review' | 'failed';
  verificationScore?: number;
  verificationAttempts?: number;
}

interface AppDraft {
  _id: string;
  name: string;
  description: string;
  tagline?: string;
  tags: string[];
  category?: string;
  techStack: string[];
  pricing: string;
  features: string[];
  website?: string;
  github?: string;
  authorBio?: string;
  premiumPlan?: string;
  premiumReady: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
  remainingDays: number;
  isExpired: boolean;
}

export default function ManageAppsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [drafts, setDrafts] = useState<AppDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [popoverAnchor, setPopoverAnchor] = React.useState<HTMLElement | null>(null);
  const openInfoPopover = (e: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(e.currentTarget);
  };
  const closeInfoPopover = () => setPopoverAnchor(null);
  const popoverOpen = Boolean(popoverAnchor);
  
  /* Short tooltip text */
  const tooltipText = "We check that you added a link to your site; verification confirms presence but is not an editorial endorsement.";
  
  // modal state
  const [open, setOpen] = React.useState(false);
  const [activeApp, setActiveApp] = useState<AppItem | null>(null);
  const [pageUrl, setPageUrl] = useState<string>("");
  const [snack, setSnack] = useState<{ open: boolean; message?: string; severity?: "success" | "info" | "error" }>({ open: false });

  // Calculate statistics
  const totalApps = apps.length;
  const premiumApps = apps.filter(app => app.isPremium).length;
  const approvedApps = apps.filter(app => app.status === 'approved').length;
  const pendingApps = apps.filter(app => app.status === 'pending').length;

  const fetchApps = async (showLoading = true) => {
    console.log('🔄 Starting to fetch apps...');
    if (showLoading) {
      setLoading(true);
    }
    setRefreshing(true);
    setError(null);
    
    try {
      console.log('📡 Making API call to /api/user-apps...');
      
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/user-apps?_t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      console.log('📡 API response status:', res.status);
      console.log('📡 API response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ API error response:', errorText);
        throw new Error(`Failed to fetch apps: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('📦 API response data:', data);
      console.log('📦 Apps array:', data.apps);
      
      // Check for verification status changes
      const newApps = data.apps || [];
      const verificationStatusChanges = [];
      
      for (const newApp of newApps) {
        const oldApp = apps.find(app => app._id === newApp._id);
        if (oldApp && oldApp.verificationStatus !== newApp.verificationStatus) {
          verificationStatusChanges.push({
            name: newApp.name,
            oldStatus: oldApp.verificationStatus,
            newStatus: newApp.verificationStatus
          });
        }
      }
      
      // Show notification for verification status changes
      if (verificationStatusChanges.length > 0 && !showLoading) {
        const changesText = verificationStatusChanges.map(change => 
          `${change.name}: ${change.oldStatus} → ${change.newStatus}`
        ).join(', ');
        
        setSnack({
          open: true,
          message: `Verification status updated: ${changesText}`,
          severity: 'success'
        });
      }
      
      setApps(newApps);
      console.log('✅ Apps state updated successfully');
      
      // Log verification status for debugging
      const appsWithVerification = data.apps?.filter((app: any) => app.verificationStatus) || [];
      if (appsWithVerification.length > 0) {
        console.log('🔍 Apps with verification status:', appsWithVerification.map((app: any) => ({
          name: app.name,
          verificationStatus: app.verificationStatus,
          verificationScore: app.verificationScore,
          verificationAttempts: app.verificationAttempts
        })));
      }
    } catch (err: any) {
      console.error('❌ Error in fetchApps:', err);
      setError(err.message || "Unknown error");
    } finally {
      console.log('🏁 Setting loading to false');
      if (showLoading) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/user-apps/drafts');
      if (!response.ok) {
        throw new Error('Failed to fetch app drafts');
      }
      
      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (err: any) {
      console.error('Failed to fetch drafts:', err);
    }
  };

  const handleRetry = () => {
    fetchApps();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };



  useEffect(() => {
    fetchApps();
    fetchDrafts();
  }, []);



  // open modal to submit verification for free apps
  const openSubmitModal = (app: AppItem) => {
    // Only allow verification for free apps that require it
    if (app.pricing !== 'Free' && app.pricing !== 'free') {
      setSnack({ 
        open: true, 
        message: "Verification is only required for free apps", 
        severity: "info" 
      });
      return;
    }
    
    setActiveApp(app);
    setPageUrl("");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActiveApp(null);
    setPageUrl("");
  };

  // copy expected HTML snippet to clipboard
  const copySnippet = async () => {
    if (!activeApp) return;
    const snippet = `<a href="https://your-site.com/apps/${activeApp._id}">View ${activeApp.name} on OurSite</a>`;
    try {
      await navigator.clipboard.writeText(snippet);
      setSnack({ open: true, message: "Snippet copied to clipboard", severity: "success" });
    } catch {
      setSnack({ open: true, message: "Could not copy — please copy manually", severity: "error" });
    }
  };

  // Submit for verification
  const submitForVerification = async () => {
    if (!activeApp) return;

    try {
      const response = await fetch(`/api/user-apps/${activeApp._id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationUrl: pageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit verification');
      }

      const result = await response.json();
      
      setSnack({ 
        open: true, 
        message: "Verification request submitted successfully! We'll check your website within 24 hours.", 
        severity: "success" 
      });
      
      // Refresh apps to show updated status
      fetchApps();
      closeModal();
      
    } catch (error: any) {
      setSnack({ 
        open: true, 
        message: error.message || "Failed to submit verification request", 
        severity: "error" 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Published';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const canEdit = (app: AppItem) => {
    return app.status === 'pending';
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const response = await fetch(`/api/user-apps/draft/${draftId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete draft');
      }

      // Refresh drafts
      fetchDrafts();
    } catch (err: any) {
      console.error('Failed to delete draft:', err);
    }
  };

  const handlePremiumManagement = async (app: AppItem) => {
    try {
      // For now, just show a message about premium management
      // In the future, this could open a modal for managing premium features
      setSnack({ 
        open: true, 
        message: `Premium management for ${app.name} - Contact support for changes`, 
        severity: "info" 
      });
    } catch (err: any) {
      console.error('Premium management error:', err);
      setSnack({ 
        open: true, 
        message: "Failed to manage premium features", 
        severity: "error" 
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Loading Apps...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Failed to Load Apps
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleRetry}
            disabled={loading}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Manage Submitted Apps
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
            onClick={() => fetchApps(true)}
            disabled={refreshing}
            size="small"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={async () => {
              if (apps.length > 0) {
                const app = apps[0];
                try {
                  const res = await fetch(`/api/debug/verification-status?appId=${app._id}`);
                  const data = await res.json();
                  console.log('🔍 Debug verification status:', data);
                  setSnack({
                    open: true,
                    message: `Debug: ${app.name} - Status: ${data.app?.verificationStatus || 'unknown'}`,
                    severity: 'info'
                  });
                } catch (err) {
                  console.error('Debug error:', err);
                }
              }
            }}
          >
            Debug
          </Button>
        </Stack>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <BookOpen sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.primary.main }}>
                {totalApps}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Apps
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <CheckCircle sx={{ color: theme.palette.success.main }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.success.main }}>
                {approvedApps}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getShadow(theme, "elegant"),
              }}
            >
              <Clock sx={{ color: theme.palette.warning.main }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.warning.main }}>
                {pendingApps}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getShadow(theme, "elegant"),
              }}
            >
              <EditIcon sx={{ color: theme.palette.info.main }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: theme.palette.info.main }}>
                {drafts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drafts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Verification Status Notice */}
      {apps.some(app => app.pricing === 'Free' && app.verificationStatus) && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchApps}
              disabled={loading}
            >
              Refresh Now
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Verification Status:</strong> If you've recently submitted an app for verification or an admin has updated your verification status, 
            click the Refresh button above to see the latest updates.
          </Typography>
        </Alert>
      )}



      {/* Tabs */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: getShadow(theme, "elegant"),
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Published Apps ({apps.length})</span>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Drafts ({drafts.length})</span>
                {drafts.filter(d => d.premiumReady).length > 0 && (
                  <Chip
                    label={`${drafts.filter(d => d.premiumReady).length} Premium`}
                    color="success"
                    size="small"
                    variant="filled"
                    icon={<span style={{ fontSize: '12px' }}>💎</span>}
                    sx={{ height: '20px', fontSize: '0.7rem' }}
                  />
                )}
      </Box>
            } 
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            // Published Apps Tab
            apps.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <BookOpen sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  No apps yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start creating your first app to showcase your work to the community.
      </Typography>
                <Button
                  component={Link}
                  href="/dashboard/submission/app"
                  variant="contained"
                  color="primary"
                  startIcon={<Plus fontSize="small" />}
                  sx={{ fontWeight: 600 }}
                >
                  Create Your First App
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
        {apps.map((app) => (
          <Grid item xs={12} md={6} key={app._id}>
                    <Card
              sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                borderRadius: 3,
                boxShadow: getShadow(theme, "elegant"),
                        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: getShadow(theme, "neon"),
                        },
                      }}
                    >
                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ flex: 1, mr: 2, lineHeight: 1.3 }}>
                {app.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                                            {app.isPremium && (
                              <Chip
                                label="Premium"
                                color="default"
                                size="small"
                                variant="outlined"
                                icon={<span style={{ fontSize: '12px' }}>💎</span>}
                              />
                            )}
                            <Chip
                              label={getStatusLabel(app.status)}
                              color={getStatusColor(app.status) as any}
                              size="small"
                              variant="outlined"
                            />
                            {/* Verification status for free apps */}
                            {app.pricing === 'Free' && app.verificationStatus && (
                              <Box sx={{ mb: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Tooltip title={
                                    app.verificationStatus === 'verified' 
                                      ? 'This app has been verified and displays a verification badge'
                                      : app.verificationStatus === 'pending'
                                        ? 'Verification is pending - admin will review your website'
                                        : app.verificationStatus === 'needs_review'
                                          ? 'Verification needs admin review - check your website setup'
                                          : 'Verification failed - check your website and try again'
                                  }>
                                    <Chip
                                      label={
                                        app.verificationStatus === 'verified' 
                                          ? 'Verified' 
                                          : app.verificationStatus === 'pending' 
                                            ? 'Pending Verification' 
                                            : app.verificationStatus === 'needs_review'
                                              ? 'Needs Review'
                                              : 'Verification Failed'
                                      }
                                      color="default"
                                      size="small"
                                      variant="outlined"
                                      icon={app.verificationStatus === 'verified' ? <CheckCircle fontSize="small" /> : undefined}
                                    />
                                  </Tooltip>
                                {/* Show verification score if available */}
                                {app.verificationScore && app.verificationStatus !== 'verified' && (
                                  <Chip
                                    label={`${app.verificationScore}/100`}
                                    color="default"
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: '20px' }}
                                  />
                                )}
                                {/* Show verification attempts if multiple */}
                                {app.verificationAttempts && app.verificationAttempts > 1 && (
                                  <Chip
                                    label={`${app.verificationAttempts} attempts`}
                                    color="default"
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: '20px' }}
                                  />
                                )}
                              </Stack>
                              </Box>
                            )}
                          </Box>
                        </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                          sx={{ mb: 2, flex: 1 }}
              >
                          {app.description?.slice(0, 150)}...
              </Typography>

                        {/* Categories and Subcategories */}
                        <Box sx={{ mb: 2 }}>
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
                            {app.subcategories?.slice(0, 2).map((subcat, i) => (
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
                                }}
                              />
                            ))}
                            
                            {/* Show total count if there are more subcategories */}
                            {app.subcategories && app.subcategories.length > 2 && (
                              <Chip 
                                size="small" 
                                label={`+${app.subcategories.length - 2}`} 
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

                        {/* Tags - Show separately if exists */}
                        {app.tags && app.tags.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
                              Tags
                            </Typography>
                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                              {app.tags.slice(0, 3).map((tag, i) => (
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
                              {app.tags.length > 3 && (
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

              {/* Premium Status */}
              {app.isPremium && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Premium: ${app.premiumPlan || 'Standard'}`}
                    color="default"
                    size="small"
                    variant="outlined"
                    icon={<span style={{ fontSize: '12px' }}>💎</span>}
                  />
                  {app.premiumStatus && (
                    <Chip
                      label={app.premiumStatus}
                      color="default"
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Calendar fontSize="small" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </Box>
                          {app.views && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <span>•</span>
                              {app.views} views
                            </Box>
                          )}
                        </Box>
                      </CardContent>

                      <Divider />

                      <CardActions sx={{ p: 2, pt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <Typography variant="caption" color="text.secondary">
                            {app.authorName || app.authorEmail}
                </Typography>
                          
                          <Stack direction="row" spacing={1}>
                            {canEdit(app) && (
                              <Tooltip title="Edit App">
                                <IconButton
                                  component={Link}
                                  href={`/dashboard/submission/app?appId=${app._id}`}
                                  size="small"
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {/* Verification button for free apps */}
                            {app.pricing === 'Free' && app.verificationStatus !== 'verified' && (
                              <Tooltip title="Submit for Verification">
                                <IconButton
                                  onClick={() => openSubmitModal(app)}
                                  size="small"
                                  color="info"
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                            )}
                            {app.isPremium && (
                              <Tooltip title="Manage Premium">
                                <IconButton
                                  onClick={() => handlePremiumManagement(app)}
                                  size="small"
                                  color="warning"
                                >
                                  <CreditCard />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="View App">
                              <IconButton
                                component={Link}
                                href={`/launch/${app.slug}`}
                                size="small"
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
              </Box>
                      </CardActions>
                    </Card>
          </Grid>
        ))}
      </Grid>
            )
          )}

          {activeTab === 1 && (
            // Drafts Tab
            <AppDraftManager 
              onEditDraft={(draft) => {
                // Navigate to app submission page with draft data using router
                router.push(`/dashboard/submission/app?draftId=${draft._id}`);
              }}
              onDeleteDraft={(draftId) => {
                // Refresh drafts after deletion
                fetchDrafts();
              }}
              refreshTrigger={0}
            />
          )}
        </Box>
      </Paper>

      {/* Verification Modal */}
      <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle>Submit for Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To verify your app, we need to see a link to your app on your website. 
            Please provide the URL where you've added the verification link.
          </Typography>
          
          <TextField
            fullWidth
            label="Page URL"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="https://your-site.com/about"
            sx={{ mb: 2 }}
          />

          {/* Verification History */}
          {activeApp && activeApp.verificationStatus && activeApp.verificationStatus !== 'pending' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Previous Verification:</strong> {activeApp.verificationStatus}
                {activeApp.verificationScore && ` (Score: ${activeApp.verificationScore}/100)`}
                {activeApp.verificationAttempts && activeApp.verificationAttempts > 1 && ` - ${activeApp.verificationAttempts} attempts`}
              </Typography>
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Required:</strong> Add this verification badge to your page:
            </Typography>
            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {activeApp?.verificationBadgeHtml ? (
                <div dangerouslySetInnerHTML={{ __html: activeApp.verificationBadgeHtml }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Badge not generated yet. Click "Verify" to generate your unique badge.
                </Typography>
              )}
            </Box>
          </Alert>

          {/* Badge Variations */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Anti-Tracking Badge Variations:</strong> Choose any of these variations to avoid SEO crawler detection:
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {activeApp?.verificationBadgeVariations ? (
                activeApp.verificationBadgeVariations.map((badgeHtml, index) => (
                  <Box key={index} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1, fontSize: '0.8rem' }}>
                    <strong>Variation {index + 1}:</strong> 
                    <div dangerouslySetInnerHTML={{ __html: badgeHtml }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Badge variations not generated yet. Click "Verify" to generate your unique badge variations.
                </Typography>
              )}
            </Box>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
              💡 Each variation uses different text and styling to avoid crawler detection while maintaining verification effectiveness.
            </Typography>
          </Alert>

          {/* Enhanced Verification Scoring Guide */}
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Enhanced Verification Scoring System:</strong>
            </Typography>
            <Box sx={{ mt: 1, fontSize: '0.8rem' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span>• Link to BasicUtils (35 points)</span>
                <span>✅ Required</span>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span>• Verification text/badge (25 points)</span>
                <span>✅ Required</span>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span>• Dofollow link (20 points)</span>
                <span>💡 SEO bonus</span>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span>• Accessibility (10 points)</span>
                <span>💡 Quality bonus</span>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span>• SEO attributes (5 points)</span>
                <span>💡 Bonus</span>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Anti-tracking variations (10 points)</span>
                <span>💡 Anti-detection bonus</span>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              <strong>95+ points:</strong> Auto-verified (Excellent) • <strong>80-94 points:</strong> Auto-verified (Good) • <strong>65-79 points:</strong> Admin review • <strong>50-64 points:</strong> Admin review • <strong>&lt;50 points:</strong> Failed
            </Typography>
          </Alert>

          {/* Badge Assignment Info */}
          {activeApp?.verificationBadgeText && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Your Unique Badge Assignment:</strong>
              </Typography>
              <Box sx={{ mt: 1, fontSize: '0.8rem' }}>
                <Box sx={{ mb: 0.5 }}>• <strong>Badge Text:</strong> "{activeApp.verificationBadgeText}"</Box>
                <Box sx={{ mb: 0.5 }}>• <strong>CSS Class:</strong> "{activeApp.verificationBadgeClass}"</Box>
                <Box sx={{ mb: 0.5 }}>• <strong>App ID:</strong> {activeApp._id}</Box>
                <Box sx={{ mb: 0.5 }}>• <strong>Status:</strong> {activeApp.verificationStatus}</Box>
              </Box>
            </Alert>
          )}

          {/* Security Requirements */}
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Security Requirements:</strong>
            </Typography>
            <Box sx={{ mt: 1, fontSize: '0.8rem' }}>
              <Box sx={{ mb: 0.5 }}>• Verification URL must be on the same domain as your app</Box>
              <Box sx={{ mb: 0.5 }}>• Must use HTTPS protocol</Box>
              <Box sx={{ mb: 0.5 }}>• Cannot be a file, API endpoint, or admin page</Box>
              <Box sx={{ mb: 0.5 }}>• No URL shorteners or redirect services allowed</Box>
            </Box>
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={copySnippet} variant="outlined" size="small">
              <ContentCopyIcon sx={{ mr: 1 }} />
              Copy Snippet
            </Button>
            <Tooltip title={tooltipText}>
              <IconButton onClick={openInfoPopover} size="small">
                <InfoOutlined />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button 
            onClick={submitForVerification} 
            variant="contained"
            disabled={!pageUrl.trim()}
          >
            Submit for Verification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Popover */}
      <Popover
        open={popoverOpen}
        anchorEl={popoverAnchor}
        onClose={closeInfoPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="body2">
            {tooltipText}
          </Typography>
        </Box>
      </Popover>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack({ open: false })}
      >
        <Alert
          onClose={() => setSnack({ open: false })}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
