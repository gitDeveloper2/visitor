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
import { authClient } from "@/app/auth-client";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const { data: session, isPending } = authClient.useSession();
  const [adminMenuAnchor, setAdminMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [submitMenuAnchor, setSubmitMenuAnchor] = React.useState<null | HTMLElement>(null);

  const isAdmin = session?.user?.role === 'admin';

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

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!session?.user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Please sign in to access the dashboard</Typography>
      </Box>
    );
  }

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
          backdropFilter: "blur(20px)",
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

              <Divider orientation="vertical" flexItem sx={{ height: 24 }} />

              {/* Submit Section */}
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSubmitMenuOpen}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: 2,
                  },
                }}
              >
                Submit
              </Button>
              <Menu
                anchorEl={submitMenuAnchor}
                open={Boolean(submitMenuAnchor)}
                onClose={handleSubmitMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem
                  component={Link}
                  href="/dashboard/submit/app"
                  onClick={handleSubmitMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <AppsIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Submit App
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/dashboard/submit/blog"
                  onClick={handleSubmitMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <ArticleIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Submit Blog
                </MenuItem>
              </Menu>

              {/* Admin Section - Only visible to admins */}
              {isAdmin && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ height: 24 }} />
                  <Button
                    startIcon={<AdminPanelSettingsIcon />}
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={handleAdminMenuOpen}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2,
                      borderColor: "secondary.main",
                      color: "secondary.main",
                      "&:hover": {
                        bgcolor: "secondary.main",
                        color: "white",
                      },
                    }}
                  >
                    Admin
                    <Chip
                      label="Admin"
                      size="small"
                      color="secondary"
                      sx={{
                        ml: 1,
                        height: 18,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    />
                  </Button>
                  <Menu
                    anchorEl={adminMenuAnchor}
                    open={Boolean(adminMenuAnchor)}
                    onClose={handleAdminMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 220,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      href="/dashboard/admin/apps"
                      onClick={handleAdminMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <AppsIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Manage Apps
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/admin/blogs"
                      onClick={handleAdminMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ArticleIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Manage Blogs
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/admin/users"
                      onClick={handleAdminMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <PeopleIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      User Management
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/admin/verification"
                      onClick={handleAdminMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <VerifiedUserIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Verification
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/admin/categories"
                      onClick={handleAdminMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <CategoryIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Manage Categories
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/admin/badges"
                      onClick={handleAdminMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <EmojiEventsIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Manage Badges
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/dashboard/admin/legacy/admin"
                      onClick={handleAdminMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <AdminPanelSettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Legacy Admin
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Stack>

            {/* Right Section - empty (main navbar handles user menu) */}
            <Box />
          </Stack>
        </Box>
      </Box>

      {/* Page Content */}
      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
}