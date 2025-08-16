# Uniform Authentication Protection System

## Overview

This document outlines the comprehensive authentication protection system implemented for the BasicUtils Next.js application. The system provides uniform, maintainable authentication protection across all protected pages and components.

## Architecture

The authentication system consists of several key components:

### 1. Core Components

#### `AuthGuard` (Client-side)
- **Location**: `src/components/auth/AuthGuard.tsx`
- **Purpose**: Client-side authentication protection for React components
- **Features**: 
  - Role-based access control
  - Suspended account detection
  - Custom fallback components
  - Beautiful auth display components

#### `ServerAuthGuard` (Server-side)
- **Location**: `src/components/auth/ServerAuthGuard.tsx`
- **Purpose**: Server-side authentication protection for layouts and server components
- **Features**:
  - Server-side redirects
  - Higher-order component support
  - SEO-friendly protection

#### `AuthRequiredDisplay` (UI Component)
- **Location**: `src/components/auth/AuthRequiredDisplay.tsx`
- **Purpose**: Beautiful, modern UI for authentication states
- **States**:
  - Loading
  - Unauthenticated
  - Unauthorized (wrong role)
  - Suspended account

#### `ProtectedRoute` (Advanced Protection)
- **Location**: `src/components/auth/ProtectedRoute.tsx`
- **Purpose**: Advanced protection with additional checks
- **Features**:
  - Pro user requirements
  - Email verification checks
  - Custom validation functions

### 2. Hooks

#### `useAuthGuard`
- **Location**: `src/hooks/useAuthGuard.ts`
- **Purpose**: Custom hook for authentication guard logic
- **Features**:
  - Automatic redirects
  - Custom callbacks
  - Authorization state management

#### `usePermission` & `usePermissions`
- **Purpose**: Permission checking hooks
- **Available Permissions**:
  - `admin`: Admin role
  - `moderator`: Admin or moderator role
  - `user`: Any authenticated user
  - `pro`: Pro user status
  - `create-content`: Can create content (not suspended)
  - `edit-content`: Can edit content (admin/moderator)
  - `delete-content`: Can delete content (admin only)
  - `manage-users`: Can manage users (admin only)
  - `access-admin`: Can access admin panel (admin only)

## Usage Examples

### 1. Basic Page Protection

#### Client Component Protection
```tsx
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function MyProtectedPage() {
  return (
    <AuthGuard requiredRole="admin" redirectTo="/auth/signin">
      <div>This content is only visible to admins</div>
    </AuthGuard>
  );
}
```

#### Server Component Protection
```tsx
import { ServerAuthGuard } from '@/components/auth/ServerAuthGuard';

export default async function MyProtectedLayout({ children }) {
  return (
    <ServerAuthGuard requiredRole="admin" redirectTo="/auth/signin">
      {children}
    </ServerAuthGuard>
  );
}
```

### 2. Layout Protection

#### Admin Layout
```tsx
// src/app/(site)/dashboard/admin/layout.tsx
import { ServerAuthGuard } from "@/components/auth/ServerAuthGuard";

export default async function AdminLayout({ children }) {
  return (
    <ServerAuthGuard requiredRole="admin" redirectTo="/auth/signin">
      {children}
    </ServerAuthGuard>
  );
}
```

#### Dashboard Layout
```tsx
// src/app/(site)/dashboard/layout.tsx
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard redirectTo="/auth/signin">
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}
```

### 3. Conditional Rendering

#### Show/Hide Based on Permissions
```tsx
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ConditionalRender } from '@/components/auth/ProtectedRoute';
import { usePermission } from '@/hooks/useAuthGuard';

function MyComponent() {
  const canEditContent = usePermission('edit-content');
  
  return (
    <div>
      <h1>My Content</h1>
      
      <ConditionalRender condition={canEditContent}>
        <button>Edit Content</button>
      </ConditionalRender>
      
      <AuthGuard requiredRole="admin" showAuthDisplay={false}>
        <button>Admin Only Action</button>
      </AuthGuard>
    </div>
  );
}
```

### 4. Advanced Protection

#### Pro User Protection
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProFeaturePage() {
  return (
    <ProtectedRoute requirePro={true} redirectTo="/upgrade">
      <div>Premium content here</div>
    </ProtectedRoute>
  );
}
```

#### Custom Validation
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CustomProtectedPage() {
  const customCheck = (user) => {
    return user.emailVerified && user.pro;
  };
  
  return (
    <ProtectedRoute 
      customCheck={customCheck}
      redirectTo="/verify-email"
    >
      <div>Custom protected content</div>
    </ProtectedRoute>
  );
}
```

### 5. Higher-Order Components

#### Using withAuth
```tsx
import { withAuth } from '@/components/auth/ServerAuthGuard';

function MyComponent() {
  return <div>Protected content</div>;
}

export default withAuth(MyComponent, {
  requiredRole: 'admin',
  redirectTo: '/auth/signin'
});
```

#### Using withProtection
```tsx
import { withProtection } from '@/components/auth/ProtectedRoute';

function MyComponent() {
  return <div>Protected content</div>;
}

export default withProtection(MyComponent, {
  requirePro: true,
  redirectTo: '/upgrade'
});
```

## Authentication States

### 1. Loading State
- Shows a loading spinner while checking authentication
- Prevents flash of unauthorized content

### 2. Unauthenticated State
- User is not signed in
- Shows sign-in and sign-up options
- Beautiful card-based UI with clear call-to-action

### 3. Unauthorized State
- User is signed in but lacks required permissions
- Shows required role information
- Provides navigation to appropriate pages

### 4. Suspended State
- User account has been suspended
- Shows suspension message
- Provides contact support option

## Best Practices

### 1. Choose the Right Protection Level

#### Use ServerAuthGuard for:
- Layout files
- Server components
- SEO-critical pages
- Initial page loads

#### Use AuthGuard for:
- Client components
- Interactive features
- Dynamic content
- User-specific functionality

### 2. Role Hierarchy
```typescript
// Role hierarchy (most to least privileged)
admin > moderator > user

// Permission inheritance
admin: has all permissions
moderator: has user + moderator permissions
user: has basic user permissions
```

### 3. Redirect Strategy
- **Public pages**: No protection needed
- **User pages**: Redirect to `/auth/signin`
- **Admin pages**: Redirect to `/auth/signin` (then to dashboard if wrong role)
- **Pro features**: Redirect to `/upgrade`

### 4. Error Handling
```tsx
// Custom error handling
<AuthGuard 
  requiredRole="admin"
  fallback={<CustomErrorComponent />}
  onUnauthorized={() => console.log('User lacks admin role')}
>
  {children}
</AuthGuard>
```

## Migration Guide

### From Old System

#### Before (Manual checks)
```tsx
// Old way
const { data: session, isPending } = authClient.useSession();

if (isPending) return <Loading />;
if (!session?.user) return <SignInPrompt />;
if (session.user.role !== 'admin') return <AccessDenied />;

return <ProtectedContent />;
```

#### After (Uniform system)
```tsx
// New way
import { AuthGuard } from '@/components/auth/AuthGuard';

<AuthGuard requiredRole="admin">
  <ProtectedContent />
</AuthGuard>
```

### Updating Existing Layouts

#### Admin Layouts
```tsx
// Replace manual checks with ServerAuthGuard
import { ServerAuthGuard } from "@/components/auth/ServerAuthGuard";

export default async function AdminLayout({ children }) {
  return (
    <ServerAuthGuard requiredRole="admin" redirectTo="/auth/signin">
      {children}
    </ServerAuthGuard>
  );
}
```

#### Dashboard Layouts
```tsx
// Wrap dashboard content with AuthGuard
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard redirectTo="/auth/signin">
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}
```

## Testing

### 1. Test Different User Roles
```typescript
// Test with different user types
const testUsers = [
  { role: 'user', shouldAccess: false },
  { role: 'moderator', shouldAccess: false },
  { role: 'admin', shouldAccess: true },
];
```

### 2. Test Authentication States
- Unauthenticated users
- Suspended users
- Users with insufficient permissions
- Loading states

### 3. Test Redirects
- Verify correct redirect destinations
- Test redirect after successful authentication
- Test redirect for unauthorized access

## Security Considerations

### 1. Server-Side Protection
- Always use `ServerAuthGuard` for critical pages
- Never rely solely on client-side protection
- Implement proper session validation

### 2. Role Validation
- Validate roles on both client and server
- Use consistent role checking logic
- Implement proper role hierarchy

### 3. Session Management
- Proper session timeout handling
- Secure session storage
- CSRF protection

## Troubleshooting

### Common Issues

#### 1. Infinite Redirects
```tsx
// Problem: Redirecting to protected page
<AuthGuard redirectTo="/dashboard"> // This causes redirect loop

// Solution: Redirect to public page
<AuthGuard redirectTo="/auth/signin">
```

#### 2. Missing Role Checks
```tsx
// Problem: Only checking authentication
<AuthGuard> // Missing role requirement

// Solution: Add role requirement
<AuthGuard requiredRole="admin">
```

#### 3. Client/Server Mismatch
```tsx
// Problem: Using client component in server layout
// Solution: Use ServerAuthGuard for layouts
```

### Debug Mode
```tsx
// Enable debug logging
<AuthGuard 
  requiredRole="admin"
  onUnauthorized={() => console.log('Auth failed')}
>
  {children}
</AuthGuard>
```

## Performance Considerations

### 1. Lazy Loading
- Auth components are lightweight
- Minimal impact on bundle size
- Efficient re-renders

### 2. Caching
- Session data is cached appropriately
- Minimal API calls for auth checks
- Optimized for frequent auth checks

### 3. Bundle Optimization
- Tree-shaking friendly exports
- Minimal dependencies
- Efficient component structure

## Future Enhancements

### 1. Planned Features
- Multi-factor authentication support
- Advanced permission system
- Audit logging
- Session analytics

### 2. Customization Options
- Custom auth display themes
- Configurable redirect strategies
- Advanced permission rules
- Integration with external auth providers

---

This authentication system provides a robust, maintainable, and user-friendly way to protect your application's content while ensuring a smooth user experience across all authentication states. 