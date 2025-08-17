'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import { Home } from 'lucide-react';
import { Search } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', // Account for navbar height
        width: '100%',
        overflow: 'hidden', // Prevent scrollbars
        px: { xs: 2, sm: 3 }, // Add horizontal padding
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', sm: '8rem', md: '12rem' }, // Reduced font size on mobile
              fontWeight: 900,
              background: theme.custom?.gradients?.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 0.8,
              mb: 2,
              fontFamily: '"Outfit", "Poppins", sans-serif',
            }}
          >
            404
          </Typography>

          {/* Main Message */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }, // Reduced font size on mobile
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontFamily: '"Poppins", "Outfit", sans-serif',
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' }, // Reduced font size on mobile
              color: 'text.secondary',
              maxWidth: 600,
              mb: 4,
              lineHeight: 1.6,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            Oops! The page you're looking for seems to have wandered off. 
            It might have been moved, deleted, or never existed in the first place.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              mb: 4, // Reduced margin on mobile
            }}
          >
            <Button
              component={Link}
              href="/"
              variant="contained"
              size="large"
              startIcon={<Home size={20} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: theme.custom?.gradients?.primary,
                '&:hover': {
                  background: theme.custom?.gradients?.primary,
                  opacity: 0.9,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Go Home
            </Button>

            <Button
              component={Link}
              href="/tools"
              variant="outlined"
              size="large"
              startIcon={<Search size={20} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Tools
            </Button>
          </Box>

          {/* Helpful Links */}
          <Paper
            sx={{
              p: { xs: 3, sm: 4 }, // Reduced padding on mobile
              maxWidth: 500,
              background: theme.custom?.glass?.background,
              border: `1px solid ${theme.custom?.glass?.border}`,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: 'text.primary',
                fontFamily: '"Poppins", sans-serif',
                fontSize: { xs: '1rem', sm: '1.125rem' }, // Reduced font size on mobile
              }}
            >
              Looking for something specific?
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Button
                component={Link}
                href="/blogs"
                variant="text"
                startIcon={<Construction size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }, // Reduced font size on mobile
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Blog & Articles
              </Button>

              <Button
                component={Link}
                href="/aboutus"
                variant="text"
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }, // Reduced font size on mobile
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                About Us
              </Button>

              <Button
                component={Link}
                href="/contactus"
                variant="text"
                startIcon={<Construction size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }, // Reduced font size on mobile
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Contact Support
              </Button>

              <Button
                component={Link}
                href="/faqs"
                variant="text"
                startIcon={<Search size={16} />}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }, // Reduced font size on mobile
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                FAQ
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
  