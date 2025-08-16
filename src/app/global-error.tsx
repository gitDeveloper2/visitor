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
import {
  Server,
  RefreshCw,
  Home,
  Wifi,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const theme = useTheme();

  return (
    <html>
      <body>
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
            {/* Server Error Icon */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.error.light}20, ${theme.palette.error.main}20)`,
                mb: 4,
                border: `2px solid ${theme.palette.error.main}30`,
                position: 'relative',
              }}
            >
              <Server
                size={70}
                color={theme.palette.error.main}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: theme.palette.warning.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              >
                <AlertTriangle size={20} color="white" />
              </Box>
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
              Server Error
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
              We're experiencing technical difficulties on our end. 
              Our team has been notified and is working to resolve this issue.
            </Typography>

            {/* Error Code */}
            <Paper
              sx={{
                p: 2,
                mb: 4,
                background: theme.custom?.glass?.background,
                border: `1px solid ${theme.custom?.glass?.border}`,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Albert Sans", monospace',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                Error Code: {error.digest || 'UNKNOWN'}
              </Typography>
            </Paper>

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

            {/* Status Information */}
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
                What you can do:
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 3,
                  mb: 3,
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
                    <RefreshCw size={16} />
                    Refresh the page
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                    }}
                  >
                    Sometimes a simple refresh can resolve temporary issues.
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
                    <Wifi size={16} />
                    Check your connection
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                    }}
                  >
                    Ensure you have a stable internet connection.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
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
              </Box>
            </Paper>
          </Box>
        </Container>
      </body>
    </html>
  );
} 