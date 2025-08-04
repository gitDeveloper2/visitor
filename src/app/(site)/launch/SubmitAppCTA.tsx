"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Rocket } from "lucide-react";
import { getGlassStyles, getShadow, commonStyles } from "../../../utils/themeUtils";
import Link from "next/link";

export default function SubmitAppCTA() {
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
        <Rocket size={36} color={theme.palette.primary.main} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Launch your app to thousands of developers 🚀
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Get featured, verified, and gain visibility in the dev community.
          </Typography>
        </Box>
      </Stack>

      <Button
        component={Link}
        href="/submit"
        variant="contained"
        sx={{
          borderRadius: "999px",
          px: 3,
          py: 1.2,
          fontWeight: 600,
          color: theme.palette.primary.contrastText,
          bgcolor: theme.palette.primary.main,
          ":hover": {
            bgcolor: theme.palette.primary.dark,
          },
        }}
      >
        Submit Your App
      </Button>
    </Paper>
  );
}
