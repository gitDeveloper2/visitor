"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { getGlassStyles, getShadow, commonStyles } from "../../../utils/themeUtils";
import React from "react";

interface UnifiedCTAProps {
  title: string;
  subtitle?: string;
  href: string;
  buttonText: string;
  leftIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
}

export default function UnifiedCTA({
  title,
  subtitle,
  href,
  buttonText,
  leftIcon,
  startIcon,
}: UnifiedCTAProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        mt: 6,
        borderRadius: "1rem",
        p: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        ...getGlassStyles(theme),
        boxShadow: getShadow(theme, "elegant"),
        backdropFilter: "blur(16px)",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        {leftIcon && <Box sx={{ display: "flex" }}>{leftIcon}</Box>}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>

      <Button
        component={Link}
        href={href}
        variant="contained"
        sx={commonStyles.gradientButton(theme)}
        startIcon={startIcon}
      >
        {buttonText}
      </Button>
    </Paper>
  );
}

