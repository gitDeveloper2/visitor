"use client";

import { Box, Container, Grid, Skeleton, Typography, Alert } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { FaNpm } from "react-icons/fa";

export default function MainContentSkeleton() {
  return (
    <Container sx={{ py: 4, mb: 10 }}>
      {/* Time Range + Grouping + Package Selectors + Token Manager */}
      <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
        {/* Left: Selectors */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={{ xs: 0, md: 2 }}>
            <Grid item xs={6}>
              <Skeleton variant="rounded" height={40} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="rounded" height={40} />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Skeleton variant="rounded" height={56} />
            </Grid>
          </Grid>
        </Grid>

        {/* Right: Token Manager */}
        <Grid item xs={12} md={4}>
          <Skeleton variant="rounded" height={100} />
        </Grid>
      </Grid>

      {/* Share actions */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Skeleton variant="rounded" height={40} width="30%" />
        </Grid>

        {/* Chart Panels */}
        <Grid item xs={12} md={6} sx={{ minHeight: { xs: 300, sm: 400 }, mb: { xs: 3, md: 0 } }}>
          <Typography textAlign="center" variant="h5" gutterBottom>
            <Box component="span" sx={{ verticalAlign: "middle", display: "inline-flex", mr: 1 }}>
              <FaNpm size={24} color="#cb0000" />
            </Box>
            <Skeleton width={200} height={30} sx={{ mx: "auto" }} />
          </Typography>
          <Skeleton variant="rounded" height={300} />
        </Grid>

        <Grid item xs={12} md={6} sx={{ minHeight: { xs: 300, sm: 400 } }}>
          <Typography textAlign="center" variant="h5" gutterBottom>
            <GitHub sx={{ verticalAlign: "middle", mr: 1 }} />
            <Skeleton width={200} height={30} sx={{ mx: "auto" }} />
          </Typography>
          <Skeleton variant="rounded" height={300} />
        </Grid>
      </Grid>

      {/* Metrics Panel Skeleton */}
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rounded" height={48} width="30%" sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
