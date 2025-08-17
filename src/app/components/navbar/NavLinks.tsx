"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import Link from "next/link";

export default function NavLinks() {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Button
        component={Link}
        href="/"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Home
      </Button>
      
      <Button
        component={Link}
        href="/launch"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Tools
      </Button>
      
      <Button
        component={Link}
        href="/blogs"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Blog
      </Button>
      
      <Button
        component={Link}
        href="/pricing"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Pricing
      </Button>
    </Box>
  );
}