"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../../../auth-client";
import {
  alpha,
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { ExpandMore } from "@mui/icons-material";
import MainNavLinks from "./MainNavLinks";
export const navItemSx = {
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  color: 'text.primary',
  px: 2,
  py: 1.2,
  borderRadius: 1,
  '&:hover': {
    backgroundColor: (theme) =>
      alpha(theme.palette.primary.main, 0.08),
    color: 'text.primary',
  },
  '&.Mui-selected': {
    backgroundColor: (theme) =>
      alpha(theme.palette.primary.main, 0.15),
    fontWeight: 600,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 32,
    color: 'inherit',
  },
};

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
        },
      },
    });
  };

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleGoToDashboard = () => {
    handleMenuClose();
    router.push("/dashboard");
  };
  const handleGoToUser = () => {
    handleMenuClose();
    router.push("/dashboard/profile");
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* 🔹 Left: Logo */}
          <Box
            component="a"
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Box sx={{ width: 36, height: 36, position: "relative" }}>
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
            <Typography variant="h6" fontWeight={600} noWrap>
              mOL
            </Typography>
          </Box>
          <MainNavLinks />

          {/* 🔹 Right: Auth section */}
          {isPending ? (
            <CircularProgress size={24} />
          ) : session?.user ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 0 }}
                aria-controls={open ? "user-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                
                  src={session.user.image || undefined}
                  alt={session.user.name || "User"}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
              <IconButton onClick={handleMenuOpen} size="small">
  <ExpandMore fontSize="small" />
</IconButton>


              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: { minWidth: 220, p: 1 },
                  },
                }}
              >
                <MenuItem onClick={handleGoToUser} sx={{ ...navItemSx, flexDirection: 'column', alignItems: 'flex-start' }}>
  <Typography variant="subtitle2" noWrap>
    {session.user.name}
  </Typography>
  <Typography
    variant="body2"
    color="text.secondary"
    noWrap
    sx={{ maxWidth: 200 }}
  >
    {session.user.email}
  </Typography>
</MenuItem>


                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={handleGoToDashboard} sx={navItemSx}>
  Dashboard
</MenuItem>
<MenuItem onClick={handleLogout} sx={navItemSx}>
  Logout
</MenuItem>


              </Menu>
            </Stack>
          ) : (
            <Button variant="outlined" onClick={handleSignIn}>
              Sign in
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
