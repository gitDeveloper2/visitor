'use client';

import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Lock as LockIcon,
  Security as SecurityIcon,
  Block as BlockIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AuthRequiredDisplayProps {
  type: 'loading' | 'unauthenticated' | 'unauthorized' | 'suspended';
  redirectTo?: string;
  requiredRole?: string;
}

export function AuthRequiredDisplay({
  type,
  redirectTo = '/auth/signin',
  requiredRole,
}: AuthRequiredDisplayProps) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push(redirectTo);
  };

  const getDisplayConfig = () => {
    switch (type) {
      case 'loading':
        return {
          icon: <CircularProgress size={48} />,
          title: 'Loading...',
          subtitle: 'Please wait while we verify your authentication',
          color: 'primary' as const,
          showActions: false,
        };

      case 'unauthenticated':
        return {
          icon: <LockIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
          title: 'Authentication Required',
          subtitle: 'Please sign in to access this page',
          color: 'primary' as const,
          showActions: true,
          actions: [
            {
              label: 'Sign In',
              variant: 'contained' as const,
              onClick: handleSignIn,
              href: '/auth/signin',
            },
            {
              label: 'Sign Up',
              variant: 'outlined' as const,
              href: '/auth/signup',
            },
          ],
        };

      case 'unauthorized':
        return {
          icon: <SecurityIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
          title: 'Access Denied',
          subtitle: `This page requires ${requiredRole || 'admin'} privileges`,
          color: 'warning' as const,
          showActions: true,
          actions: [
            {
              label: 'Go to Dashboard',
              variant: 'contained' as const,
              href: '/dashboard',
            },
            {
              label: 'Contact Support',
              variant: 'outlined' as const,
              href: '/contact',
            },
          ],
        };

      case 'suspended':
        return {
          icon: <BlockIcon sx={{ fontSize: 48, color: 'error.main' }} />,
          title: 'Account Suspended',
          subtitle: 'Your account has been suspended. Please contact support for assistance.',
          color: 'error' as const,
          showActions: true,
          actions: [
            {
              label: 'Contact Support',
              variant: 'contained' as const,
              href: '/contact',
            },
            {
              label: 'Sign Out',
              variant: 'outlined' as const,
              onClick: () => router.push('/auth/signout'),
            },
          ],
        };

      default:
        return {
          icon: <PersonIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
          title: 'Authentication Required',
          subtitle: 'Please sign in to continue',
          color: 'primary' as const,
          showActions: true,
          actions: [
            {
              label: 'Sign In',
              variant: 'contained' as const,
              onClick: handleSignIn,
            },
          ],
        };
    }
  };

  const config = getDisplayConfig();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 3,
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Icon */}
          <Box sx={{ mb: 3 }}>
            {config.icon}
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            {config.title}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            {config.subtitle}
          </Typography>

          {/* Role requirement chip */}
          {type === 'unauthorized' && requiredRole && (
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={<SecurityIcon />}
                label={`Required: ${requiredRole}`}
                color="warning"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          )}

          {/* Warning for suspended accounts */}
          {type === 'suspended' && (
            <Alert
              severity="error"
              icon={<WarningIcon />}
              sx={{ mb: 3, textAlign: 'left' }}
            >
              Your account has been suspended due to a violation of our terms of service. 
              Please contact our support team to resolve this issue.
            </Alert>
          )}

          {/* Actions */}
          {config.showActions && config.actions && (
            <Stack spacing={2} sx={{ mt: 3 }}>
              {config.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  size="large"
                  fullWidth
                  onClick={action.onClick}
                  component={action.href ? Link : 'button'}
                  href={action.href}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          )}

          {/* Additional info for unauthenticated users */}
          {type === 'unauthenticated' && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Don't have an account? Create one to get started.
              </Typography>
              
              <Button
                variant="text"
                component={Link}
                href="/auth/signup"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Create Account
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 