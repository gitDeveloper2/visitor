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
import Link from "next/link";
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

  if (isPending) {
    return <CircularProgress size={24} />;
  }

  if (!session?.user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1.25 : 2,
          justifyContent: isMobile ? 'stretch' : 'center',
          alignItems: isMobile ? 'stretch' : 'center',
          width: '100%'
        }}
      >
        <Button
          component={Link}
          href="/auth/signin"
          variant="contained"
          fullWidth={isMobile}
          sx={{ py: 1 }}
        >
          Login
        </Button>
        <Button
          component={Link}
          href="/auth/signup"
          variant="outlined"
          fullWidth={isMobile}
          sx={{ py: 1 }}
        >
          Create account
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
        PaperProps={{
          sx: {
            minWidth: 220,
            p: 1,
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
          href="/dashboard/profile"
          onClick={handleMenuClose}
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

        <MenuItem 
          component={Link}
          href="/dashboard"
          onClick={handleMenuClose}
        >
          Dashboard
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Stack>
  );
};

export default Auth;
