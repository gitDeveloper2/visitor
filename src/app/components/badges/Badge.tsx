import * as React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { EmojiObjects } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export type VerifiedBadgeProps = {
  size?: "small" | "md";
  variant?: "pill" | "ribbon" | "founder";
  label?: string;
};

export default function Badge({
  size = "small",
  variant = "pill",
  label = "Verified",
}: VerifiedBadgeProps) {
  const theme = useTheme();
  const primaryGradient =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue("--gradient-primary")
      : "";

  const background = primaryGradient
    ? `linear-gradient(90deg, ${primaryGradient})`
    : undefined;

  // Shared pill styles—uses theme gradient when variant="pill"
  const commonSX = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    px: variant === "pill" ? (size === "small" ? 1 : 1.25) : 0,
    py: variant === "pill" ? (size === "small" ? 0.25 : 0.5) : 0,
    borderRadius: variant === "pill" ? 999 : 0,
    fontWeight: 600,
    fontSize: size === "small" ? 12 : 13,
    color: theme.palette.primary.contrastText,
    bgcolor:
      variant === "pill"
        ? theme.custom.gradients.primary
        : background
        ? "transparent"
        : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  } as const;

  if (variant === "ribbon") {
    return (
      <Box
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          transform: "rotate(10deg)",
          px: 1.25,
          py: 0.25,
          borderRadius: 1,
          boxShadow: `0 4px 12px ${
            theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.08)"
          }`,
          background:
            background ??
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          color: theme.palette.primary.contrastText,
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 16 }} />
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{label}</Typography>
      </Box>
    );
  }

  if (variant === "founder") {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: 0.5,
          px: 1,
          py: 0.25,
          borderRadius: 999,
          fontWeight: 500,
          fontSize: 11,
          color: theme.palette.primary.contrastText,
          background: theme.custom.gradients.primary,
          boxShadow: `0 4px 12px ${
            theme.palette.mode === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)"
          }`,
        }}
      >
        <EmojiObjects sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: 11, fontWeight: 500 }}>{label}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...commonSX,
        ...(variant !== "pill" && background ? { background } : {}),
        boxShadow: `0 6px 18px ${
          theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(99,102,241,0.12)"
        }`,
      }}
      aria-hidden
    >
      <CheckCircleIcon sx={{ fontSize: size === "small" ? 14 : 16 }} />
      <Typography
        sx={{
          fontSize: size === "small" ? 12 : 13,
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
