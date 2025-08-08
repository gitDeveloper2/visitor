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
}

export default function ManageAppsPage() {
  const theme = useTheme();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [activeApp, setActiveApp] = React.useState<AppItem | null>(null);
  const [pageUrl, setPageUrl] = React.useState<string>("");
  const [snack, setSnack] = React.useState<{ open: boolean; message?: string; severity?: "success" | "info" | "error" }>({ open: false });

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user-apps");
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        setApps(data.apps || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
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
    boxShadow: getShadow(theme, "elevated"),
    color: "text.primary",
    // keep it visually solid — small blur in content only, not see-through
    backdropFilter: "none",
  } as const;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Submitted Apps
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
              }}
            >
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {app.name}
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
