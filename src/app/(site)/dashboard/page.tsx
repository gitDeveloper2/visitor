"use client";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useAuthState } from "@/hooks/useAuth";
import { getShadow, getGlassStyles } from "@/utils/themeUtils";
import { User, AppWindow, FileText } from "lucide-react";

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 8 } }}>
          <Typography variant={isMobile ? "h5" : "h6"}>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 8 } }}>
          <Typography variant="h6">Please sign in to access the dashboard.</Typography>
        </Box>
      </Container>
    );
  }

  const dashboardItems = [
    {
      title: "Submit App",
      description: "Share your application with the community",
      icon: <AppWindow size={isMobile ? 20 : 24} />,
      href: "/dashboard/submit/app",
      color: "primary.main",
    },
    {
      title: "Submit Blog",
      description: "Write and publish your thoughts",
      icon: <FileText size={isMobile ? 20 : 24} />,
      href: "/dashboard/submit/blog",
      color: "secondary.main",
    },
    {
      title: "My Apps",
      description: "Manage your submitted applications",
      icon: <AppWindow size={isMobile ? 20 : 24} />,
      href: "/dashboard/my-apps",
      color: "success.main",
    },
    {
      title: "My Blogs",
      description: "View and edit your blog posts",
      icon: <FileText size={isMobile ? 20 : 24} />,
      href: "/dashboard/my-blogs",
      color: "info.main",
    },
    {
      title: "Profile Settings",
      description: "Update your profile information",
      icon: <User size={isMobile ? 20 : 24} />,
      href: "/dashboard/profile",
      color: "warning.main",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography
        variant={isMobile ? "h4" : "h3"}
        gutterBottom
        align="center"
        sx={{
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
          fontWeight: 600,
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, 'elegant'),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
                minHeight: isSmallMobile ? 200 : 220,
              }}
            >
              <CardContent sx={{
                flexGrow: 1,
                textAlign: 'center',
                p: { xs: 2, sm: 3 },
                '&:last-child': { pb: { xs: 2, sm: 3 } }
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: { xs: 1.5, sm: 2 },
                    color: item.color
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    mb: { xs: 1, sm: 1.5 }
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{
                justifyContent: 'center',
                pb: { xs: 2, sm: 2 },
                px: { xs: 2, sm: 3 }
              }}>
                <Button
                  component={Link}
                  href={item.href}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderColor: item.color,
                    color: item.color,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    '&:hover': {
                      backgroundColor: item.color,
                      color: 'white',
                    }
                  }}
                >
                  Open
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
