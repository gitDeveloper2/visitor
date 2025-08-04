"use client";

import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { FaNpm } from "react-icons/fa";

export default function NpmComponentSkeleton() {
  return (
    <Container
      sx={{
        py: 4,
        mb: 10,
        minHeight: "100vh", // fills screen
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Selectors Row */}
      <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
        {/* Left Column - Time Range, Grouping, Package Selector */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={{ xs: 0, md: 2 }}>
            <Grid item xs={6}>
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="rounded" height={56} />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Skeleton variant="rounded" height={56} />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Token Manager */}
        <Grid item xs={12} md={4}>
          <Skeleton variant="rounded" height={120} />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="text" width="30%" height={32} />
          </Grid>

          {/* NPM Chart */}
          <Grid item xs={12} md={6}>
            <Typography textAlign="center" variant="h5" gutterBottom>
              <Box component="span" sx={{ verticalAlign: "middle", display: "inline-flex", mr: 1 }}>
                <FaNpm size={24} color="#cb0000" />
              </Box>
              NPM Download History
            </Typography>
            <Skeleton variant="rectangular" height={400} />
          </Grid>

          {/* GitHub Chart */}
          <Grid item xs={12} md={6}>
            <Typography textAlign="center" variant="h5" gutterBottom>
              <GitHub sx={{ verticalAlign: "middle", mr: 1 }} />
              GitHub Stars History
            </Typography>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>

      {/* Metrics Panel Placeholder */}
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    </Container>
  );
}
