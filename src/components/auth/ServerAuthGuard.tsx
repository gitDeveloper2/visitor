import { redirect } from 'next/navigation';
import { getServerSession, hasRole, isAuthenticated } from './server';
import { AuthRequiredDisplay } from './AuthRequiredDisplay';

interface ServerAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export async function ServerAuthGuard({
  children,
  requiredRole,
  redirectTo = '/auth/signin',
  fallback,
}: ServerAuthGuardProps) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session?.user) {
    if (redirectTo) {
      redirect(redirectTo);
    }
    return fallback || <AuthRequiredDisplay type="unauthenticated" />;
  }

  // Check if user has required role
  if (requiredRole && session.user.role !== requiredRole) {
    return fallback || <AuthRequiredDisplay type="unauthorized" requiredRole={requiredRole} />;
  }

  // Check if user is suspended
  if (session.user.suspended) {
    return fallback || <AuthRequiredDisplay type="suspended" />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

// Higher-order function for creating protected layouts
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options: {
    requiredRole?: string;
    redirectTo?: string;
  } = {}
) {
  return async function ProtectedComponent(props: T) {
    return (
      <ServerAuthGuard
        requiredRole={options.requiredRole}
        redirectTo={options.redirectTo}
      >
        <Component {...props} />
      </ServerAuthGuard>
    );
  };
} 