'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  Alert,
} from '@mui/material';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh',
          justifyContent: 'center',
        }}
      >
        {/* Error Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.error.light}20, ${theme.palette.error.main}20)`,
            mb: 4,
            border: `2px solid ${theme.palette.error.main}30`,
          }}
        >
          <AlertTriangle
            size={60}
            color={theme.palette.error.main}
          />
        </Box>

        {/* Main Message */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            fontWeight: 700,
            mb: 2,
            color: 'text.primary',
            fontFamily: '"Poppins", "Outfit", sans-serif',
          }}
        >
          Something Went Wrong
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem' },
            color: 'text.secondary',
            maxWidth: 600,
            mb: 4,
            lineHeight: 1.6,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          We encountered an unexpected error. Don't worry, our team has been notified 
          and we're working to fix this issue.
        </Typography>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              maxWidth: 600,
              textAlign: 'left',
              '& .MuiAlert-message': {
                fontFamily: '"Albert Sans", monospace',
                fontSize: '0.875rem',
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Error Details:
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.75rem',
                fontFamily: '"Albert Sans", monospace',
                backgroundColor: 'background.paper',
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {error.message}
              {error.digest && `\nError ID: ${error.digest}`}
            </Typography>
          </Alert>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            mb: 6,
          }}
        >
          <Button
            onClick={reset}
            variant="contained"
            size="large"
            startIcon={<RefreshCw size={20} />}
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
            Try Again
          </Button>

          <Button
            component={Link}
            href="/"
            variant="outlined"
            size="large"
            startIcon={<Home size={20} />}
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
            Go Home
          </Button>
        </Box>

        {/* Help Section */}
        <Paper
          sx={{
            p: 4,
            maxWidth: 600,
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
            }}
          >
            Need Help?
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Bug size={16} />
                Report Issue
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                If this error persists, please report it to our support team with the error details.
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'left' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Shield size={16} />
                Check Status
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                Check if there are any ongoing maintenance or service issues.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Button
              component={Link}
              href="/contactus"
              variant="text"
              size="small"
              sx={{
                color: 'text.secondary',
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
              size="small"
              sx={{
                color: 'text.secondary',
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

            <Button
              component={Link}
              href="/status"
              variant="text"
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Service Status
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 