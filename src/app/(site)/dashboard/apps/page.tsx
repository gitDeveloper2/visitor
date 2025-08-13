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
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@mui/material/styles";
import { getShadow } from "../../../../utils/themeUtils";
import { InfoOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Badge from "@components/badges/Badge";
import { useEffect, useState } from "react";
import PremiumAppManager from "./PremiumAppManager";

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

export default function ManageAppsPage() {
  const theme = useTheme();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchApps();
  };

  useEffect(() => {
    fetchApps();
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

    // (TODO: later call your API endpoint here)
    // await fetch("/api/user/request-verification", { method: "POST", body: JSON.stringify(payload) })

    setSnack({ open: true, message: "Verification requested. We'll check this shortly.", severity: "info" });
    closeModal();
  };

  // style choices for non-see-through modal, using CSS variables when available
  const dialogPaperSX = {
    // Prefer CSS variable for glass background if present; otherwise use near-opaque theme surface
    background:
      typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--glass-bg")
        ? `var(--glass-bg)`
        : theme.palette.mode === "dark"
        ? "rgba(18,18,20,0.96)"
        : "rgba(250,250,250,0.96)",
    border: typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--glass-border")
      ? `1px solid var(--glass-border)`
      : `1px solid ${theme.palette.divider}`,
    boxShadow: getShadow(theme, "elegant"),
    color: "text.primary",
    // keep it visually solid — small blur in content only, not see-through
    backdropFilter: "none",
  } as const;

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
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="h4" fontWeight="bold">{totalApps}</Typography>
              <Typography variant="body2">Total Apps</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.dark' }}>
              <Typography variant="h4" fontWeight="bold">{premiumApps}</Typography>
              <Typography variant="body2">Premium Apps</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.dark' }}>
              <Typography variant="h4" fontWeight="bold">{approvedApps}</Typography>
              <Typography variant="body2">Approved</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.dark' }}>
              <Typography variant="h4" fontWeight="bold">{pendingApps}</Typography>
              <Typography variant="body2">Pending</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Premium App Manager */}
      <Box sx={{ mb: 4 }}>
        <PremiumAppManager 
          apps={apps as any} // Type assertion to avoid interface mismatch
          onUpdatePremiumStatus={async (appId: string, status: string) => {
            try {
              const res = await fetch(`/api/user-apps/${appId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ premiumStatus: status }),
              });

              if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to update premium status');
              }

              // Refresh apps after update
              const refreshRes = await fetch("/api/user-apps");
              if (refreshRes.ok) {
                const data = await refreshRes.json();
                setApps(data.apps || []);
              }

              setSnack({ 
                open: true, 
                message: "Premium status updated successfully", 
                severity: "success" 
              });
            } catch (err: any) {
              setSnack({ 
                open: true, 
                message: err.message || "Failed to update premium status", 
                severity: "error" 
              });
              throw err;
            }
          }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        All Submitted Apps
      </Typography>

      <Grid container spacing={3} mt={2}>
        {apps.map((app) => (
          <Grid item xs={12} md={6} key={app._id}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: getShadow(theme, "elegant"),
                position: "relative", // allow absolute badge
                overflow: "visible",
                // Add premium styling
                ...(app.isPremium && {
                  border: `2px solid ${theme.palette.warning.main}`,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.warning.light}10 100%)`
                })
              }}
            >
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {app.name}
                {app.isPremium && (
                  <Tooltip title="Premium App - Featured on launch page">
                    <CheckCircleIcon color="warning" />
                  </Tooltip>
                )}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {app.description}
              </Typography>

              <Stack direction="row" spacing={1} mb={1}>
                {(app.tags || []).map((tag: string, i: number) => (
                  <Chip key={i} size="small" label={tag} />
                ))}
              </Stack>

              <Chip
                label={app.status}
                color={
                  app.status === "approved"
                    ? "success"
                    : app.status === "pending"
                    ? "warning"
                    : "default"
                }
                sx={{ mt: 1 }}
              />

              {/* Premium Status Badge */}
              {app.isPremium && (
                <Chip
                  label="Premium"
                  color="warning"
                  variant="outlined"
                  icon={<CheckCircleIcon />}
                  sx={{ mt: 1, ml: 1 }}
                />
              )}

              {/* Premium Plan Info */}
              {app.premiumPlan && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Plan: {app.premiumPlan}
                </Typography>
              )}

              <Box mt={2}>
                <Button size="small" variant="outlined" onClick={() => openSubmitModal(app)}>
                  Request Verification
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Verification Modal */}
      <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Request Verification for {activeApp?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To verify your app, we need to check that you've added a link to our site. Please provide the URL where you've added the link.
          </Typography>
          
          <TextField
            fullWidth
            label="Page URL"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="https://your-site.com/about"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="body2">Expected HTML snippet:</Typography>
            <Button size="small" onClick={copySnippet} startIcon={<ContentCopyIcon />}>
              Copy
            </Button>
          </Box>

          <Box
            component="pre"
            sx={{
              p: 2,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 1,
              fontSize: '0.875rem',
              overflowX: 'auto',
            }}
          >
            {activeApp && `<a href="https://your-site.com/apps/${activeApp._id}">View ${activeApp.name} on OurSite</a>`}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={submitForVerification} variant="contained">
            Submit for Verification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
