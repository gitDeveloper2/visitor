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
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@mui/material/styles";
import { getShadow } from "../../../../utils/themeUtils";
import { InfoOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Badge from "@components/badges/Badge";



type AppItem = {
  id: string;
  name: string;
  status: string;
  description: string;
  tags: string[];
  verification_status?: "unverified" | "pending" | "verified" | "failed";
  last_verification_result?: string | null;
  backlink_check_url?: string | null; // default URL where we will look
};

const initialApps: AppItem[] = [
  {
    id: "app-1",
    name: "Snippet Saver",
    status: "approved",
    description: "Save and manage your favorite code snippets with ease.",
    tags: ["productivity", "code", "tools"],
    verification_status: "unverified",
    last_verification_result: null,
    backlink_check_url: "https://snippet-saver.example.com/",
  },
  {
    id: "app-2",
    name: "Focus Timer",
    status: "pending",
    description: "Pomodoro-style timer to boost productivity and focus.",
    tags: ["timer", "focus", "AI"],
    verification_status: "verified",
    last_verification_result: "found:dofollow",
    backlink_check_url: "https://focus-timer.example.com/",
  },
];

export default function ManageAppsPage() {
  const theme = useTheme();
  const [apps, setApps] = React.useState<AppItem[]>(initialApps);
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

  // open modal to submit verification (user cannot verify themselves)
  const openSubmitModal = (app: AppItem) => {
    setActiveApp(app);
    setPageUrl(app.backlink_check_url ?? "");
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
    const snippet = `<a href="https://your-site.com/apps/${activeApp.id}">View ${activeApp.name} on OurSite</a>`;
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
      appId: activeApp.id,
      pageUrl: pageUrl || activeApp.backlink_check_url,
      requestedAt: new Date().toISOString(),
    };

    // (TODO: later call your API endpoint here)
    // await fetch("/api/user/request-verification", { method: "POST", body: JSON.stringify(payload) })

    // Update UI locally: set verification_status => pending
    setApps((prev) =>
      prev.map((a) =>
        a.id === activeApp.id
          ? { ...a, verification_status: "pending", last_verification_result: null }
          : a
      )
    );

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

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Submitted Apps
      </Typography>

      <Grid container spacing={3} mt={2}>
        {apps.map((app) => (
          <Grid item xs={12} md={6} key={app.id}>
           <Paper
  sx={{
    p: 3,
    borderRadius: 3,
    boxShadow: getShadow(theme, "elegant"),
    position: "relative", // allow absolute badge
    overflow: "visible",
  }}
>
  {/* show ribbon only when verified */}
  {/* {app.verification_status === "verified" && <Badge variant="ribbon" label="VerifiedBadge" />} */}

  <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {app.name}
    {/* small inline pill near title (optional) */}
    {app.verification_status === "verified" && <Box sx={{ ml: 1 }}>
      <Badge size="small" variant="pill" label="Verified" />
    <Tooltip title={tooltipText} placement="top" arrow>
      <IconButton size="small" onClick={openInfoPopover} aria-label="Verification info">
        <InfoOutlined fontSize="small" />
      </IconButton>
    </Tooltip></Box>}
  </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {app.description}
              </Typography>

              <Stack direction="row" spacing={1} mb={1}>
                {app.tags.map((tag, i) => (
                  <Chip key={i} size="small" label={tag} />
                ))}
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Chip
                  label={app.status}
                  color={app.status === "approved" ? "success" : app.status === "pending" ? "warning" : "default"}
                  size="small"
                />

                {/* <Chip
                  label={
                    app.verification_status === "verified"
                      ? "Verified"
                      : app.verification_status === "pending"
                      ? "Pending"
                      : app.verification_status === "failed"
                      ? "Failed"
                      : "Unverified"
                  }
                  color={
                    app.verification_status === "verified"
                      ? "success"
                      : app.verification_status === "pending"
                      ? "warning"
                      : app.verification_status === "failed"
                      ? "error"
                      : "default"
                  }
                  size="small"
                /> */}
                
              </Stack>
              <Popover
    open={popoverOpen}
    anchorEl={popoverAnchor}
    onClose={closeInfoPopover}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    PaperProps={{
      sx: {
        width: 360,
        p: 2,
        // Prefer opaque surface so it's readable over your glass theme
        background:
          typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--glass-bg")
            ? "var(--glass-bg)"
            : (theme.palette.mode === "dark" ? "rgba(18,18,20,0.98)" : "rgba(255,255,255,0.98)"),
        border: typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--glass-border")
          ? "1px solid var(--glass-border)"
          : `1px solid ${theme.palette.divider}`,
        boxShadow: getShadow(theme, "elevated"),
      },
    }}
  >
    <Typography variant="subtitle2">About the verification badge</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      This badge confirms we found a link on your site that points to your app page on OurSite. Verification confirms the link’s presence and attributes, and does not imply editorial endorsement or guarantee search ranking changes.
    </Typography>

    <Divider sx={{ my: 1 }} />

    <Typography variant="caption" color="text.secondary" display="block">
      Backlink attributes (follow/nofollow) are applied per platform policy. If verification fails you'll see why (no link found, nofollow/ugc/sponsored, or blocked rendering).
    </Typography>

    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
      <Button size="small" onClick={closeInfoPopover}>Close</Button>
    </Box>
  </Popover>
              <Box mt={2}>
                <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                  Edit
                </Button>

                {/* Submit for verification (user cannot verify themselves) */}
                {app.verification_status !== "verified" && (
  <Button
    size="small"
    variant="contained"
    onClick={() => openSubmitModal(app)}
    disabled={app.verification_status === "pending"}
  >
    {app.verification_status === "pending"
      ? "Requested"
      : "Submit for verification"}
  </Button>
)}

              </Box>

              {/* show last verification text if present */}
              {app.last_verification_result && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  Last result: {app.last_verification_result}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal: Submit for Verification */}
      <Dialog
        open={open}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        BackdropProps={{
          sx: {
            // stronger backdrop so underlying page isn't visible
            backgroundColor: "rgba(2,6,23,0.6)",
            backdropFilter: "blur(3px)",
          },
        }}
        PaperProps={{
          sx: {
            ...dialogPaperSX,
            p: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ background: "transparent", pb: 0, px: 3 }}>
          Request Backlink Verification
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Add the backlink to your site, then submit the page URL below. We will perform the verification on our side — you won't be able to verify it yourself immediately.
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 1,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            <Box sx={{ mr: 1, color: "text.primary", overflowWrap: "anywhere" }}>
              {activeApp ? `<a href="https://your-site.com/apps/${activeApp.id}">View ${activeApp.name} on OurSite</a>` : ""}
            </Box>
            <IconButton size="small" onClick={copySnippet} aria-label="Copy snippet">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Paper>

          <Typography variant="body2" sx={{ mb: 1 }}>
            Page to check (where you added the link). Leave blank to check the URL you submitted earlier.
          </Typography>

          <TextField
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="https://your-site.com/blog/post-containing-link"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />

          <Typography variant="caption" color="text.secondary">
            After submitting, our system will queue the check and update your verification status. You will see the status here when it completes.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ background: "transparent", px: 3, py: 2 }}>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={submitForVerification}>
            Submit for verification
          </Button>
        </DialogActions>
      </Dialog>

      {/* snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity || "info"} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
