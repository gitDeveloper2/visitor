'use client';

import { useAuthState } from './useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseAuthGuardOptions {
  requiredRole?: string;
  redirectTo?: string;
  onUnauthorized?: () => void;
  onUnauthenticated?: () => void;
}

interface UseAuthGuardReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  user: any;
  session: any;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
  const {
    requiredRole,
    redirectTo = '/auth/signin',
    onUnauthorized,
    onUnauthenticated,
  } = options;

  const { session, isLoading, isAuthenticated, user } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated || !session?.user) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else if (redirectTo) {
        router.push(redirectTo);
      }
      return;
    }

    // Check if user has required role
    if (requiredRole && user?.role !== requiredRole) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        router.push('/dashboard');
      }
      return;
    }

    // Check if user is suspended
    if (user?.suspended) {
      router.push('/auth/suspended');
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    session,
    user,
    requiredRole,
    redirectTo,
    onUnauthorized,
    onUnauthenticated,
    router,
  ]);

  const isAuthorized = !isLoading && 
    isAuthenticated && 
    session?.user && 
    (!requiredRole || user?.role === requiredRole) &&
    !user?.suspended;

  return {
    isAuthorized,
    isLoading,
    user,
    session,
  };
}

// Hook for checking specific permissions
export function usePermission(permission: string): boolean {
  const { user, isAuthenticated } = useAuthState();

  if (!isAuthenticated || !user) {
    return false;
  }

  // Define permission mappings
  const permissions = {
    'admin': user.role === 'admin',
    'moderator': user.role === 'admin' || user.role === 'moderator',
    'user': true, // All authenticated users
    'pro': user.pro === true,
    'create-content': !user.suspended,
    'edit-content': user.role === 'admin' || user.role === 'moderator',
    'delete-content': user.role === 'admin',
    'manage-users': user.role === 'admin',
    'access-admin': user.role === 'admin',
  };

  return permissions[permission as keyof typeof permissions] || false;
}

// Hook for checking multiple permissions
export function usePermissions(permissions: string[]): Record<string, boolean> {
  const { user, isAuthenticated } = useAuthState();

  if (!isAuthenticated || !user) {
    return permissions.reduce((acc, permission) => {
      acc[permission] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }

  const permissionMap = {
    'admin': user.role === 'admin',
    'moderator': user.role === 'admin' || user.role === 'moderator',
    'user': true,
    'pro': user.pro === true,
    'create-content': !user.suspended,
    'edit-content': user.role === 'admin' || user.role === 'moderator',
    'delete-content': user.role === 'admin',
    'manage-users': user.role === 'admin',
    'access-admin': user.role === 'admin',
  };

  return permissions.reduce((acc, permission) => {
    acc[permission] = permissionMap[permission as keyof typeof permissionMap] || false;
    return acc;
  }, {} as Record<string, boolean>);
} 