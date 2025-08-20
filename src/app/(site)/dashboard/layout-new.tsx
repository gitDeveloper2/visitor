"use client";

import React from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Menu,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import { AuthGuard } from "@/components/auth/client";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppsIcon from "@mui/icons-material/Apps";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CategoryIcon from "@mui/icons-material/Category";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BarChart from "@mui/icons-material/BarChart";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <AuthGuard redirectTo="/auth/signin">
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [adminMenuAnchor, setAdminMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [submitMenuAnchor, setSubmitMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [legacyMenuAnchor, setLegacyMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  const handleSubmitMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSubmitMenuAnchor(event.currentTarget);
  };

  const handleSubmitMenuClose = () => {
    setSubmitMenuAnchor(null);
  };

  const handleLegacyMenuClose = () => {
    setLegacyMenuAnchor(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Enhanced Navigation Bar */}
      <Box
        component="nav"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            maxWidth: "1400px",
            mx: "auto",
            px: { xs: 2, md: 4 },
            py: 1,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            {/* Left Section - Main Navigation */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Dashboard Home */}
              <Button
                component={Link}
                href="/dashboard"
                startIcon={<DashboardIcon />}
                variant="text"
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                Dashboard
              </Button>

              <Divider orientation="vertical" flexItem sx={{ height: 24 }} />

              {/* Apps Section */}
              <Button
                component={Link}
                href="/dashboard/my-apps"
                startIcon={<AppsIcon />}
                variant="text"
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                  },
                }}
              >
                My Apps
              </Button>

              <Button
                component={Link}
                href="/dashboard/admin/launch"
                startIcon={<AppsIcon />}
                variant="text"
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                  },
                }}
              >
                Admin Launch
              </Button>

              {/* Blogs Section */}
              <Button
                component={Link}
                href="/dashboard/my-blogs"
                startIcon={<ArticleIcon />}
                variant="text"
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                  },
                }}
              >
                My Blogs
              </Button>
            </Stack>

            {/* Right Section - Actions and User Menu */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Submit New */}
              <Button
                onClick={handleSubmitMenuOpen}
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Submit New
              </Button>

              {/* Admin Menu (if admin) */}
              <AuthGuard requiredRole="admin" showAuthDisplay={false}>
                <Button
                  onClick={handleAdminMenuOpen}
                  startIcon={<AdminPanelSettingsIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Admin
                </Button>
              </AuthGuard>

              {/* Submit Menu */}
                             <Menu
                 anchorEl={submitMenuAnchor}
                 open={Boolean(submitMenuAnchor)}
                 onClose={handleSubmitMenuClose}
                 anchorOrigin={{
                   vertical: "bottom",
                   horizontal: "right",
                 }}
                 transformOrigin={{
                   vertical: "top",
                   horizontal: "right",
                 }}
                 PaperProps={{
                   sx: {
                     bgcolor: 'background.paper',
                     color: 'text.primary',
                     boxShadow: (theme) => theme.shadows[8],
                     borderRadius: 2,
                     border: '1px solid',
                     borderColor: 'divider',
                   },
                 }}
               >
                <MenuItem
                  component={Link}
                  href="/launch/submit"
                  onClick={handleSubmitMenuClose}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AppsIcon fontSize="small" />
                    <Typography>Submit App</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/blog/submit"
                  onClick={handleSubmitMenuClose}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArticleIcon fontSize="small" />
                    <Typography>Submit Blog</Typography>
                  </Stack>
                </MenuItem>
              </Menu>

              {/* Admin Menu */}
                             <Menu
                 anchorEl={adminMenuAnchor}
                 open={Boolean(adminMenuAnchor)}
                 onClose={handleAdminMenuClose}
                 anchorOrigin={{
                   vertical: "bottom",
                   horizontal: "right",
                 }}
                 transformOrigin={{
                   vertical: "top",
                   horizontal: "right",
                 }}
                 PaperProps={{
                   sx: {
                     bgcolor: 'background.paper',
                     color: 'text.primary',
                     boxShadow: (theme) => theme.shadows[8],
                     borderRadius: 2,
                     border: '1px solid',
                     borderColor: 'divider',
                   },
                 }}
               >
                <MenuItem
                  component={Link}
                  href="/dashboard/admin"
                  onClick={handleAdminMenuClose}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DashboardIcon fontSize="small" />
                    <Typography>Admin Dashboard</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/dashboard/admin/users"
                  onClick={handleAdminMenuClose}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PeopleIcon fontSize="small" />
                    <Typography>Manage Users</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/dashboard/admin/content"
                  onClick={handleAdminMenuClose}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArticleIcon fontSize="small" />
                    <Typography>Manage Content</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/dashboard/admin/legacy"
                  onClick={handleAdminMenuClose}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BarChart fontSize="small" />
                    <Typography>Legacy Admin</Typography>
                  </Stack>
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
} 