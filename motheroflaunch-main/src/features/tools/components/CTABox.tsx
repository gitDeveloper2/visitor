'use client';

import { Box, Button, Typography, Paper } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Link from 'next/link';

export default function CTABox() {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <RocketLaunchIcon color="primary" />
        <Typography variant="h6">Ready to Launch?</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Get discovered, collect feedback, and earn backlinks — all in one place.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        component={Link}
        href="/dashboard/tools/new"
      >
        Launch Your Tool
      </Button>

      <Box mt={2} display="flex" gap={1} alignItems="flex-start">
        <LightbulbIcon fontSize="small" color="warning" />
        <Typography variant="caption" color="text.secondary">
          Tip: Strong taglines with keywords boost clicks and SEO.
        </Typography>
      </Box>
    </Paper>
  );
}
