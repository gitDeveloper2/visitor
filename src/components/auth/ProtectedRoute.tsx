'use client';

import React from 'react';
import { AuthGuard } from './AuthGuard';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
  fallback?: React.ReactNode;
  showAuthDisplay?: boolean;
  // Additional protection options
  requirePro?: boolean;
  requireVerified?: boolean;
  customCheck?: (user: any) => boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
  fallback,
  showAuthDisplay = true,
  requirePro = false,
  requireVerified = false,
  customCheck,
}: ProtectedRouteProps) {
  const { isAuthorized, isLoading, user } = useAuthGuard({
    requiredRole,
    redirectTo,
  });

  // Additional checks
  const additionalChecks = () => {
    if (!user) return false;
    
    // Pro user check
    if (requirePro && !user.pro) {
      return false;
    }
    
    // Email verification check (if implemented)
    if (requireVerified && !user.emailVerified) {
      return false;
    }
    
    // Custom check
    if (customCheck && !customCheck(user)) {
      return false;
    }
    
    return true;
  };

  const isFullyAuthorized = isAuthorized && additionalChecks();

  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  if (!isFullyAuthorized) {
    if (showAuthDisplay) {
      // Determine the type of auth display to show
      let displayType: 'unauthenticated' | 'unauthorized' | 'suspended' = 'unauthenticated';
      
      if (user?.suspended) {
        displayType = 'suspended';
      } else if (user && !isAuthorized) {
        displayType = 'unauthorized';
      }
      
      return (
        <AuthGuard
          requiredRole={requiredRole}
          redirectTo={redirectTo}
          showAuthDisplay={true}
        >
          <div>This should not render</div>
        </AuthGuard>
      );
    }
    return fallback || null;
  }

  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withProtection<T extends object>(
  Component: React.ComponentType<T>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function ProtectedComponent(props: T) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Conditional rendering component
export function ConditionalRender({
  children,
  condition,
  fallback,
}: {
  children: React.ReactNode;
  condition: boolean;
  fallback?: React.ReactNode;
}) {
  if (!condition) {
    return fallback || null;
  }
  
  return <>{children}</>;
} 