// Main authentication components
export { AuthGuard } from './AuthGuard';
export { AuthRequiredDisplay } from './AuthRequiredDisplay';
export { ServerAuthGuard, withAuth } from './ServerAuthGuard';
export { ProtectedRoute, withProtection, ConditionalRender } from './ProtectedRoute';

// Re-export hooks for convenience
export { useAuthGuard, usePermission, usePermissions } from '@/hooks/useAuthGuard';
export { useAuthState, usePermissions as useAuthPermissions } from '@/hooks/useAuth'; 