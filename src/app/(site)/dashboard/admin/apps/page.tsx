"use client";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import { Box, Typography, Container, Paper } from "@mui/material";
import { getShadow, getGlassStyles } from "../../../../../utils/themeUtils";
import { useTheme } from "@mui/material/styles";
import AppTable from "./AppTable";

export default function AdminAppsPage() {
  const theme = useTheme();

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Manage Submitted Apps
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          View, approve, reject or feature submitted apps.
        </Typography>

        <Paper
          sx={{
            ...getGlassStyles(theme),
            boxShadow: getShadow(theme, "elegant"),
            borderRadius: 3,
            p: 3,
          }}
        >
          <AppTable />
        </Paper>
      </Container>
    </Box>
  );
}
