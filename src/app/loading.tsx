'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
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
          {/* Loading Animation */}
          <Box
            sx={{
              position: 'relative',
              mb: 4,
            }}
          >
            {/* Outer Ring */}
            <CircularProgress
              size={120}
              thickness={2}
              sx={{
                color: theme.palette.primary.main,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            
            {/* Inner Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}20)`,
                border: `2px solid ${theme.palette.primary.main}30`,
              }}
            >
              <Loader2
                size={24}
                color={theme.palette.primary.main}
                style={{
                  animation: 'spin 2s linear infinite',
                }}
              />
            </Box>
          </Box>

          {/* Loading Text */}
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontFamily: '"Poppins", "Outfit", sans-serif',
            }}
          >
            Loading...
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'text.secondary',
              maxWidth: 500,
              lineHeight: 1.6,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            Please wait while we prepare your content. This should only take a moment.
          </Typography>

          {/* Dots Animation */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 4,
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </Box>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            
            @keyframes pulse {
              0%, 100% {
                opacity: 0.4;
                transform: scale(1);
              }
              50% {
                opacity: 1;
                transform: scale(1.2);
              }
            }
          `}</style>
        </Box>
      </Container>
    </Box>
  );
} 