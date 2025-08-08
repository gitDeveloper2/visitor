"use client";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../auth-client";

type AuthProps = {
  isMobile: boolean;
};

const Auth: React.FC<AuthProps> = ({ isMobile }) => {
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

  const handleGoToDashboard = () => {
    handleMenuClose();
    router.push("/dashboard");
  };

  const handleGoToUser = () => {
    handleMenuClose();
    router.push("/dashboard/profile");
  };

  if (isPending) {
    return <CircularProgress size={24} />;
  }

  if (!session?.user) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: isMobile ? "flex-start" : "center",
          alignItems: "center",
        }}
      >
        <Button variant="outlined" onClick={() => router.push("/auth/signup")}>
          Sign Up
        </Button>
        <Button variant="contained" onClick={() => router.push("/auth/signin")}>
          Login
        </Button>
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
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
        <MenuItem
          onClick={handleGoToUser}
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
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

        <MenuItem onClick={handleGoToDashboard}>Dashboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Stack>
  );
};

export default Auth;
