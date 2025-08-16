'use client';

import React from 'react';
import { useAuthState } from '@/hooks/useAuth';
import { AuthRequiredDisplay } from './AuthRequiredDisplay';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showAuthDisplay?: boolean;
}

export function AuthGuard({
  children,
  requiredRole,
  fallback,
  redirectTo,
  showAuthDisplay = true,
}: AuthGuardProps) {
  const { session, isLoading, isAuthenticated, user } = useAuthState();

  // Show loading state
  if (isLoading) {
    return fallback || <AuthRequiredDisplay type="loading" />;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !session?.user) {
    if (showAuthDisplay) {
      return <AuthRequiredDisplay type="unauthenticated" redirectTo={redirectTo} />;
    }
    return fallback || null;
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    if (showAuthDisplay) {
      return <AuthRequiredDisplay type="unauthorized" requiredRole={requiredRole} />;
    }
    return fallback || null;
  }

  // Check if user is suspended
  if (user?.suspended) {
    if (showAuthDisplay) {
      return <AuthRequiredDisplay type="suspended" />;
    }
    return fallback || null;
  }

  // User is authenticated and authorized
  return <>{children}</>;
} 