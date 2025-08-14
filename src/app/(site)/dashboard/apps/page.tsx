"use client";

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
} from '@mui/icons-material';

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
  // Add premium fields
  isPremium?: boolean;
  premiumStatus?: string;
  premiumPlan?: string;
  // Add stats fields
  views?: number;
  likes?: number;
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
  const [retryCount, setRetryCount] = useState(0);
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

  const fetchApps = async () => {
    console.log('🔄 Starting to fetch apps...');
    setLoading(true);
    setError(null);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⏰ Fetch timeout reached');
      setError('Request timeout - please try again');
      setLoading(false);
    }, 10000); // 10 second timeout
    
    try {
      console.log('📡 Making API call to /api/user-apps...');
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId2 = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch("/api/user-apps", {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId2);
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
      
      setApps(data.apps || []);
      console.log('✅ Apps state updated successfully');
    } catch (err: any) {
      console.error('❌ Error in fetchApps:', err);
      if (err.name === 'AbortError') {
        setError('Request timeout - please try again');
      } else {
        setError(err.message || "Unknown error");
      }
    } finally {
      clearTimeout(timeoutId);
      console.log('🏁 Setting loading to false');
      setLoading(false);
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
    setRetryCount(prev => prev + 1);
    fetchApps();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetchApps();
    fetchDrafts();
  }, []);

  // open modal to submit verification (user cannot verify themselves)
  const openSubmitModal = (app: AppItem) => {
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

  // Submit for verification (front-end only) — no direct verify allowed
  const submitForVerification = async () => {
    if (!activeApp) return;

    // Prepare payload for your future API:
    const payload = {
      appId: activeApp._id,
      pageUrl: pageUrl,
      requestedAt: new Date().toISOString(),
    };

    console.log('📤 Submitting for verification:', payload);
    
    // For now, just show success message
    setSnack({ 
      open: true, 
      message: "Verification request submitted successfully! We'll review your submission.", 
      severity: "success" 
    });
    
    closeModal();
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This may take a few moments. If it takes longer than 10 seconds, the request will timeout.
        </Typography>
        
        {/* Show retry count if we've tried before */}
        {retryCount > 0 && (
          <Typography variant="caption" color="text.secondary">
            Retry attempt: {retryCount}
          </Typography>
        )}
        
        {/* Manual retry option */}
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleRetry}
            disabled={loading}
          >
            Cancel & Retry
          </Button>
        </Box>
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
            startIcon={<CircularProgress size={16} />}
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Retry'}
          </Button>
        </Alert>
        
        {/* Show basic content even if API fails */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Manage Submitted Apps
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Unable to load apps at the moment. Please try again or contact support if the issue persists.
          </Typography>
          
          {/* Basic action buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={handleRetry}>
              Refresh Apps
            </Button>
            <Button 
              variant="outlined" 
              onClick={async () => {
                try {
                  const res = await fetch('/api/user-apps/test');
                  const data = await res.json();
                  console.log('🧪 Health check result:', data);
                  alert(`Health check: ${data.status}\n${data.message}`);
                } catch (err) {
                  console.error('Health check failed:', err);
                  alert('Health check failed. Check console for details.');
                }
              }}
            >
              Test API Connection
            </Button>
            <Button variant="contained" href="/dashboard/submission/app">
              Submit New App
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Submitted Apps
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getShadow(theme, "elegant"),
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
                ...getShadow(theme, "elegant"),
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
                                color="success"
                                size="small"
                                variant="filled"
                                icon={<span style={{ fontSize: '12px' }}>💎</span>}
                              />
                            )}
                            <Chip
                              label={getStatusLabel(app.status)}
                              color={getStatusColor(app.status) as any}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                          sx={{ mb: 2, flex: 1 }}
              >
                          {app.description?.slice(0, 150)}...
              </Typography>

                        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                {(app.tags || []).map((tag: string, i: number) => (
                            <Chip key={i} size="small" label={tag} variant="outlined" />
                ))}
              </Stack>

              {/* Premium Status */}
              {app.isPremium && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Premium: ${app.premiumPlan || 'Standard'}`}
                    color="warning"
                    size="small"
                    variant="filled"
                    icon={<span style={{ fontSize: '12px' }}>💎</span>}
                  />
                  {app.premiumStatus && (
                    <Chip
                      label={app.premiumStatus}
                      color={app.premiumStatus === 'active' ? 'success' : 'warning'}
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
                                  onClick={() => {
                                    // Navigate to app submission page with app data
                                    router.push(`/dashboard/submission/app?appId=${app._id}`);
                                  }}
                                  size="small"
                                  color="primary"
                                >
                                  <EditIcon />
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
                                href={`/apps/${app._id}`}
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
              refreshTrigger={retryCount}
            />
          )}
        </Box>
      </Paper>

      {/* Verification Modal */}
      <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
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

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Required:</strong> Add this HTML snippet to your page:
            </Typography>
            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {activeApp ? `<a href="https://your-site.com/apps/${activeApp._id}">View ${activeApp.name} on OurSite</a>` : 'Loading...'}
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
