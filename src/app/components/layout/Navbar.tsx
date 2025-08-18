"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import withMetrics from "../../../lib/Metrics";
import NavLogo from "@components/navbar/NavLogo";
import NavLinks from "@components/navbar/NavLinks";
import { usePathname } from "next/navigation";
import Auth from "./Auth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ThemeToggle from "@/app/components/ThemeToggle";
import { authClient } from "../../auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const shouldHideNavbar = pathname.startsWith("/content/");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (shouldHideNavbar) return null;

  // Mobile navigation items
  const mobileNavItems = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/launch" },
    { name: "Blog", href: "/blogs" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <NavLogo />
            {mounted &&
              (isMobile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThemeToggle />
                  <IconButton onClick={toggleDrawer} edge="end" size="large">
                    <MenuIcon />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <NavLinks />
                  <ThemeToggle />
                  <Auth isMobile={isMobile}/>
                </>
              ))}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer 
        anchor="right" 
        open={open} 
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header with Profile */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid', 
            borderColor: 'divider',
          }}>
            {/* Close button and title */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" fontWeight={600}>
                Menu
              </Typography>
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Profile Section - compact, minimal surface */}
            {!isPending && session?.user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1, mb: 1.5 }}>
                <Avatar
                  src={session.user.image || undefined}
                  alt={session.user.name || 'User'}
                  sx={{ width: 48, height: 48 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap fontWeight={600}>
                    {session.user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {session.user.email}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Welcome! Please sign in to access your dashboard.
                </Typography>
              </Box>
            )}

            {/* Quick Actions */}
            {!isPending && session?.user && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={Link} href="/dashboard" variant="outlined" size="small" fullWidth onClick={handleDrawerClose} sx={{ fontSize: '0.875rem', py: 1 }}>Dashboard</Button>
                <Button component={Link} href="/dashboard/profile" variant="text" size="small" fullWidth onClick={handleDrawerClose} sx={{ fontSize: '0.875rem', py: 1 }}>Profile</Button>
              </Box>
            )}
          </Box>

          {/* Navigation Items */}
          <List sx={{ flex: 1, pt: 1 }}>
            {mobileNavItems.map((item) => (
              <ListItem
                key={item.href}
                component="a"
                href={item.href}
                onClick={handleDrawerClose}
                sx={{
                  py: 2,
                  px: 3,
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  ...(pathname === item.href && {
                    backgroundColor: 'action.selected',
                    borderRight: '3px solid',
                    borderColor: 'primary.main',
                  })
                }}
              >
                <ListItemText 
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: pathname === item.href ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Footer Auth only when logged out */}
          {(!session?.user && !isPending) && (
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Auth isMobile={true} />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default withMetrics(NavBar);
