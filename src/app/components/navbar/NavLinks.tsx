"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { DeploymentFlagService } from "@/utils/deploymentFlags";

export default function NavLinks() {
  const isLaunchEnabled = DeploymentFlagService.isLaunchPageEnabled();
  
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Button
        component={Link}
        href="/"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Home
      </Button>
      
      {isLaunchEnabled && (
        <Button
          component={Link}
          href="/launch"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Tools
        </Button>
      )}
      
      <Button
        component={Link}
        href="/dashboard"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Dashboard
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