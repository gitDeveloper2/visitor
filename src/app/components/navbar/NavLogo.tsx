import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const NavLogo: React.FC = () => {
  return (
    <Box
      component={Link}
      href="/"
      aria-label="BasicUtils Home"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <Image
          src="/logo.png"
          alt="BasicUtils logo"
          width={28}
          height={28}
          priority
          style={{ display: 'block', borderRadius: 6 }}
        />
      </Box>
      <Typography
        variant="h6"
        component={'span'}
        sx={{
          display: { xs: 'none', sm: 'inline' },
          fontWeight: 700,
          letterSpacing: 0.2,
          color: 'primary.main',
          '& span': { color: 'secondary.dark' },
        }}
      >
        Basic<span>Utils</span>
      </Typography>
    </Box>
  );
};

export default NavLogo;
