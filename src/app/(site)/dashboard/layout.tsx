"use client";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

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
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import Link from "next/link";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { authClient } from "@/app/auth-client";
import { AuthGuard, OnboardingGuard } from "@/components/auth/client";
import { useAuthState } from "@/hooks/useAuth";

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
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ViewListIcon from "@mui/icons-material/ViewList"; // Different icon for dashboard menu
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Different icon for dashboard

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard redirectTo="/auth/signin">
      <OnboardingGuard redirectTo="/onboarding">
        <DashboardContent>{children}</DashboardContent>
      </OnboardingGuard>
    </AuthGuard>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const theme = useMuiTheme();
  const { data: session, isPending } = authClient.useSession();
  const [adminMenuAnchor, setAdminMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [submitMenuAnchor, setSubmitMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [legacyMenuAnchor, setLegacyMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const handleLegacyMenuClose = () => {
    setLegacyMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <DashboardIcon />,
      primary: true,
    },
    {
      title: "My Apps",
      href: "/dashboard/my-apps",
      icon: <AppsIcon />,
    },
    {
      title: "My Blogs",
      href: "/dashboard/my-blogs",
      icon: <ArticleIcon />,
    },
  ];

  const submitItems = [
    {
      title: "Submit App",
      href: "/dashboard/submit/app",
      icon: <AppsIcon />,
    },
    {
      title: "Submit Blog",
      href: "/dashboard/submit/blog",
      icon: <ArticleIcon />,
    },
  ];

  const adminItems = isAdmin ? [
    {
      title: "Manage Apps",
      href: "/dashboard/admin/apps",
      icon: <AppsIcon />,
    },
    {
      title: "Manage Blogs",
      href: "/dashboard/admin/blogs",
      icon: <ArticleIcon />,
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: <PeopleIcon />,
    },
    {
      title: "Verification",
      href: "/dashboard/admin/verification",
      icon: <VerifiedUserIcon />,
    },
    {
      title: "Manage Categories",
      href: "/dashboard/admin/categories",
      icon: <CategoryIcon />,
    },
    {
      title: "Manage Badges",
      href: "/dashboard/admin/badges",
      icon: <EmojiEventsIcon />,
    },
  ] : [];

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Dashboard Menu
          </Typography>
          <IconButton onClick={handleMobileMenuClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <List sx={{ pt: 1 }}>
        {/* Main Navigation */}
        {navigationItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleMobileMenuClose}
              sx={{ py: 1.5 }}
            >
              {item.icon}
              <Typography sx={{ ml: 1.5 }}>{item.title}</Typography>
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        {/* Submit Section (inline submenu for mobile) */}
        <MobileSubmitSection />

        {/* Admin Section */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleAdminMenuOpen}>
                <AdminPanelSettingsIcon />
                <Typography sx={{ ml: 1.5 }}>Admin</Typography>
              </ListItemButton>
            </ListItem>

            <Menu
              anchorEl={adminMenuAnchor}
              open={Boolean(adminMenuAnchor)}
              onClose={handleAdminMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
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
              {adminItems.map((item) => (
                <MenuItem
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={() => {
                    handleAdminMenuClose();
                    handleMobileMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  {item.icon}
                  <Typography sx={{ ml: 1.5 }}>{item.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </List>
    </Drawer>
  );

  // Inline mobile submit section
  const MobileSubmitSection: React.FC = () => {
    const open = Boolean(submitMenuAnchor);
    return (
      <>
        <ListItem disablePadding>
          <ListItemButton onClick={(e) => (open ? handleSubmitMenuClose() : handleSubmitMenuOpen(e))}>
            <AddIcon />
            <Typography sx={{ ml: 1.5 }}>Submit</Typography>
          </ListItemButton>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {submitItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => {
                    handleSubmitMenuClose();
                    handleMobileMenuClose();
                  }}
                  sx={{ pl: 4, py: 1.25 }}
                >
                  {item.icon}
                  <Typography sx={{ ml: 1.5 }}>{item.title}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="dashboard menu"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <ViewListIcon /> {/* Different icon to distinguish from main nav */}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Navigation Bar */}
      {!isMobile && (
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
              justifyContent="flex-start"
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

              {/* Right Section - Actions */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
                {/* Submit Menu */}
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  onClick={handleSubmitMenuOpen}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Submit
                </Button>

                <Menu
                  anchorEl={submitMenuAnchor}
                  open={Boolean(submitMenuAnchor)}
                  onClose={handleSubmitMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                  {submitItems.map((item) => (
                    <MenuItem
                      key={item.href}
                      component={Link}
                      href={item.href}
                      onClick={handleSubmitMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      {item.icon}
                      <Typography sx={{ ml: 1.5 }}>{item.title}</Typography>
                    </MenuItem>
                  ))}
                </Menu>

                {/* Admin Menu */}
                {isAdmin && (
                  <>
                    <Button
                      startIcon={<AdminPanelSettingsIcon />}
                      variant="outlined"
                      onClick={handleAdminMenuOpen}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        borderColor: "warning.main",
                        color: "warning.main",
                        "&:hover": {
                          borderColor: "warning.dark",
                          bgcolor: "warning.main",
                          color: "white",
                        },
                      }}
                    >
                      Admin
                    </Button>

                    <Menu
                      anchorEl={adminMenuAnchor}
                      open={Boolean(adminMenuAnchor)}
                      onClose={handleAdminMenuClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                      {adminItems.map((item) => (
                        <MenuItem
                          key={item.href}
                          component={Link}
                          href={item.href}
                          onClick={handleAdminMenuClose}
                          sx={{ py: 1.5 }}
                        >
                          {item.icon}
                          <Typography sx={{ ml: 1.5 }}>{item.title}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: isMobile ? 'calc(100vh - 64px)' : 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}