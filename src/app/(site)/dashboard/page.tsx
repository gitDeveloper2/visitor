"use client";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import { Box, Container, Grid, Paper, Typography, Chip, Stack, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getGlassStyles, getShadow } from "../../../utils/themeUtils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  apps: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    verification: {
      pending: number;
      verified: number;
      failed: number;
      not_required: number;
    };
  };
  blogs: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const StatCard = ({
  title,
  total,
  pending,
  approved,
  rejected,
  manageLink,
  stats,
}: {
  title: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  manageLink: string;
  stats: Stats;
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        ...getGlassStyles(theme),
        boxShadow: getShadow(theme, "elegant"),
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Total submissions: <strong>{total}</strong>
      </Typography>

      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        <Chip label={`Pending: ${pending}`} color="warning" variant="filled" size="small" />
        <Chip label={`Approved: ${approved}`} color="success" variant="filled" size="small" />
        <Chip label={`Rejected: ${rejected}`} color="error" variant="filled" size="small" />
        {title === "Apps" && (
          <>
            <Chip label={`Verification Pending: ${stats.apps.verification.pending}`} color="default" variant="outlined" size="small" />
            <Chip label={`Verified: ${stats.apps.verification.verified}`} color="default" variant="outlined" size="small" />
          </>
        )}
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button component={Link} href={manageLink} variant="contained" size="small">
          Manage {title}
        </Button>
        {title === "Apps" && (
          <Button component={Link} href="/dashboard/admin/verification" variant="outlined" size="small">
            Verification
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default function AdminDashboardPage() {
  const theme = useTheme();
  const [stats, setStats] = useState<Stats>({
    apps: { total: 0, pending: 0, approved: 0, rejected: 0, verification: { pending: 0, verified: 0, failed: 0, not_required: 0 } },
    blogs: { total: 0, pending: 0, approved: 0, rejected: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box component="main" sx={{ bgcolor: "background.default", py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="main" sx={{ bgcolor: "background.default", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="error" mb={4}>
            Error loading dashboard: {error}
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Overview of all submitted content. Review and manage apps and blogs.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StatCard
              title="Apps"
              total={stats.apps.total}
              pending={stats.apps.pending}
              approved={stats.apps.approved}
              rejected={stats.apps.rejected}
              manageLink="/dashboard/admin/apps"
              stats={stats}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <StatCard
              title="Blogs"
              total={stats.blogs.total}
              pending={stats.blogs.pending}
              approved={stats.blogs.approved}
              rejected={stats.blogs.rejected}
              manageLink="/dashboard/admin/blogs"
              stats={stats}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
