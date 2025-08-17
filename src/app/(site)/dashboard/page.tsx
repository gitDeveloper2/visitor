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
} from "@mui/material";
import Link from "next/link";
import { useAuthState } from "@/hooks/useAuth";
import { getShadow, getGlassStyles } from "@/utils/themeUtils";
import { Person, Apps, Article } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuthState();

  // Debug logging
  console.log('Dashboard - User data:', user);
  console.log('Dashboard - Loading state:', isLoading);

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6">Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  // Show message if not authenticated
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6">Please sign in to access the dashboard.</Typography>
        </Box>
      </Container>
    );
  }

  const dashboardItems = [
    {
      title: "Submit App",
      description: "Share your application with the community",
      icon: <Apps size={24} />,
      href: "/dashboard/submit/app",
      color: "primary.main",
    },
    {
      title: "Submit Blog",
      description: "Write and publish your thoughts",
      icon: <Article size={24} />,
      href: "/dashboard/submit/blog",
      color: "secondary.main",
    },
    {
      title: "My Apps",
      description: "Manage your submitted applications",
      icon: <Apps size={24} />,
      href: "/dashboard/my-apps",
      color: "success.main",
    },
    {
      title: "My Blogs",
      description: "View and edit your blog posts",
      icon: <Article size={24} />,
      href: "/dashboard/my-blogs",
      color: "info.main",
    },
    {
      title: "Profile Settings",
      description: "Update your profile information",
      icon: <Person size={24} />,
      href: "/dashboard/profile",
      color: "warning.main",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                ...getGlassStyles(),
                ...getShadow(),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2,
                    color: item.color 
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  component={Link}
                  href={item.href}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: item.color,
                    color: item.color,
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
