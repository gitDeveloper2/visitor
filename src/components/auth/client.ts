// Client-side authentication components and hooks
// This file should only be imported in client components

export { AuthGuard } from './AuthGuard';
export { AuthRequiredDisplay } from './AuthRequiredDisplay';
export { ProtectedRoute, withProtection, ConditionalRender } from './ProtectedRoute';
export { OnboardingGuard, withOnboardingGuard } from './OnboardingGuard';

// Re-export hooks for convenience
export { useAuthGuard, usePermission, usePermissions } from '@/hooks/useAuthGuard';
export { useAuthState, usePermissions as useAuthPermissions } from '@/hooks/useAuth'; 