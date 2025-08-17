'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingGuard } from '@/hooks/useOnboarding';
import { Box, CircularProgress } from '@mui/material';

interface OnboardingGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function OnboardingGuard({
  children,
  redirectTo = '/onboarding',
  fallback,
}: OnboardingGuardProps) {
  const router = useRouter();
  const { canAccess, isLoading, redirectTo: guardRedirectTo } = useOnboardingGuard();

  useEffect(() => {
    if (!isLoading && !canAccess && guardRedirectTo) {
      console.log('User needs onboarding, redirecting...', { redirectTo: guardRedirectTo });
      router.push(guardRedirectTo);
    }
  }, [canAccess, isLoading, guardRedirectTo, router]);

  // Show loading state while checking
  if (isLoading) {
    return fallback || (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If user needs onboarding, don't render children
  if (!canAccess) {
    return fallback || (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // User has completed onboarding, render children
  return <>{children}</>;
}

// Higher-order component for protecting pages that require completed onboarding
export function withOnboardingGuard<T extends object>(
  Component: React.ComponentType<T>,
  options: Omit<OnboardingGuardProps, 'children'> = {}
) {
  return function WithOnboardingGuard(props: T) {
    return (
      <OnboardingGuard {...options}>
        <Component {...props} />
      </OnboardingGuard>
    );
  };
} 