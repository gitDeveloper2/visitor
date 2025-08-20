"use client";

import React from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Container,
} from "@mui/material";

type Props = {
  user: {
    name: string;
    avatarUrl: string;
    stats: {
      tools: number;
      upvotes: number;
      recentVotes: number;
    };
    nextLaunch: { name: string; date: string } | null;
    recentActivity: string[];
  };
};

export const DashboardOverviewClient: React.FC<Props> = ({ user }) => {
  const theme = useTheme();

  return (
    <Container maxWidth={'md'}>
    <Box  display="flex" flexDirection="column" gap={6}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={4} alignItems="center">
          <Avatar src={user.avatarUrl} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h5">Welcome back, {user.name}!</Typography>
            <Typography variant="body2" color="text.secondary">
              Creator
            </Typography>
          </Box>
        </Stack>
        <Button variant="outlined" href="/dashboard/profile">
          Edit Profile
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {[
          { title: "Tools Submitted", value: user.stats.tools },
          { title: "Total Upvotes", value: user.stats.upvotes },
          {
            title: "Recent Votes",
            value: `+${user.stats.recentVotes} in last 30 days`,
          },
        ].map((stat, i) => (
          <Grid size={{xs:12,sm:4}} key={i} >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                transition: "0.2s",
                "&:hover": { boxShadow: theme.shadows[4] },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {user.nextLaunch ? (
        <Card sx={{ borderRadius: 3, backgroundColor: theme.palette.action.hover }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Box>
              <Typography variant="h6" mb={1}>
                Upcoming Launch
              </Typography>
              <Typography variant="body1">
                {user.nextLaunch.name} — launching on {user.nextLaunch.date}
              </Typography>
            </Box>
            <Button variant="contained" href="/dashboard/my-tools">
              Manage Tool
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography>No upcoming launches.</Typography>
      )}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>
            Recent Activity
          </Typography>
          <Stack
            spacing={1}
            component="ul"
            sx={{ pl: 2, m: 0, color: theme.palette.text.secondary }}
          >
            {user.recentActivity.map((item, i) => (
              <Box key={i} component="li" sx={{ listStyleType: "disc" }}>
                {item}
              </Box>
            ))}
          </Stack>
         
        </CardContent>
      </Card>
    </Box>
    </Container>
  );
}
