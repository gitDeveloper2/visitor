# NextAuth to Better Auth Migration Guide

## Overview
This document outlines the migration from NextAuth to Better Auth in the BasicUtils project. All NextAuth dependencies and usage have been replaced with Better Auth equivalents.

## What Was Changed

### 1. Dependencies Removed
- `next-auth` package removed from package.json
- `next-auth` types and configurations deleted

### 2. Files Updated

#### Core Auth Files
- ✅ `src/app/auth.ts` - Better Auth configuration (already existed)
- ✅ `src/app/auth-client.ts` - Better Auth client (already existed)
- ✅ `src/context/authContexts.tsx` - Updated to use Better Auth provider
- ✅ `src/app/layout.tsx` - Updated to use new auth provider

#### New Auth Utilities
- ✅ `src/lib/auth.ts` - New server-side auth utilities
- ✅ `src/hooks/useAuth.ts` - New client-side auth hooks
- ✅ `src/types/better-auth.d.ts` - New Better Auth types

#### API Routes Updated
- ✅ `src/app/api/articles/route.ts`
- ✅ `src/app/api/articles/admin.ts`
- ✅ `src/app/api/users/admin.ts`
- ✅ `src/app/api/news/route.ts`
- ✅ `src/app/api/content/route.ts`
- ✅ `src/app/api/content-news/route.ts`
- ✅ `src/app/api/apps/route.ts`
- ✅ `src/app/api/apps/admin.ts`

#### Admin Pages Updated
- ✅ `src/app/(administratorpage)/layout.tsx`
- ✅ `src/app/(administratorpage)/content/[domain]/[slug]/page.tsx`
- ✅ `src/app/(administratorpage)/content-news/[domain]/[slug]/page.tsx`

### 3. Files Deleted
- ❌ `src/lib/config/auth.ts` - Old NextAuth configuration
- ❌ `src/types/next-auth.d.ts` - Old NextAuth types

## Migration Details

### Server-Side Authentication

#### Before (NextAuth)
```typescript
import { getServerSession } from 'next-auth';

const session = await getServerSession();
```

#### After (Better Auth)
```typescript
import { getServerSession } from '../../../lib/auth';

const session = await getServerSession();
```

### Client-Side Authentication

#### Before (NextAuth)
```typescript
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
```

#### After (Better Auth)
```typescript
import { useAuthState } from '../hooks/useAuth';

const { session, isLoading, isAuthenticated, user } = useAuthState();
```

### Auth Provider

#### Before (NextAuth)
```typescript
import { SessionProvider } from 'next-auth/react';

<SessionProvider session={session}>
  {children}
</SessionProvider>
```

#### After (Better Auth)
```typescript
import AuthProvider from '../context/authContexts';

<AuthProvider>
  {children}
</AuthProvider>
```

## New Auth Utilities

### Server-Side Functions
- `getServerSession()` - Get current session
- `isAuthenticated()` - Check if user is authenticated
- `hasRole(role)` - Check if user has specific role
- `isAdmin()` - Check if user is admin
- `isPro()` - Check if user is pro
- `getCurrentUserId()` - Get current user ID
- `getCurrentUserEmail()` - Get current user email
- `getCurrentUserRole()` - Get current user role
- `isUserSuspended()` - Check if user is suspended

### Client-Side Hooks
- `useAuthState()` - Main authentication state hook
- `usePermissions()` - Permission checking hook
- `useAuthActions()` - Authentication actions hook

## Environment Variables

### Removed (NextAuth)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Required (Better Auth)
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `BETTER_AUTH_URL` (optional)

## Testing the Migration

### 1. Check Authentication Flow
- Test sign in/up with email
- Test social login (Google, GitHub)
- Verify session persistence
- Test sign out

### 2. Check Protected Routes
- Verify admin pages require authentication
- Verify role-based access control
- Test API route protection

### 3. Check User Data
- Verify user profile data loads correctly
- Check role and permission checks
- Test pro user features

## Common Issues and Solutions

### Issue: Session not persisting
**Solution**: Check that Better Auth cookies are being set correctly and the domain configuration is correct.

### Issue: Social login not working
**Solution**: Verify OAuth provider credentials are set correctly in environment variables.

### Issue: Role checks failing
**Solution**: Ensure the user object structure matches the expected Better Auth format.

### Issue: API routes returning 401
**Solution**: Check that the `getServerSession()` function is working correctly and returning the expected session data.

## Rollback Plan

If issues arise, you can temporarily rollback by:

1. Reinstalling NextAuth: `npm install next-auth@^4.24.7`
2. Restoring the old auth files from git
3. Reverting the import changes in API routes

## Next Steps

1. **Test thoroughly** - Ensure all authentication flows work correctly
2. **Update documentation** - Update any documentation that references NextAuth
3. **Monitor performance** - Better Auth should provide improved performance
4. **Consider additional features** - Better Auth offers more advanced features like:
   - Multi-factor authentication
   - Advanced session management
   - Better security features

## Support

If you encounter issues during the migration:
1. Check the Better Auth documentation
2. Review the migration changes in this document
3. Check the console for any error messages
4. Verify environment variables are set correctly 