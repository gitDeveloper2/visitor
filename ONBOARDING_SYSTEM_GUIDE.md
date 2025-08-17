# Onboarding System Implementation Guide

## Overview

This document outlines the comprehensive onboarding system implemented for the BasicUtils Next.js application. The system ensures that new users complete their profile setup before accessing protected content, providing a smooth user experience and consistent author information across the platform.

## Architecture

The onboarding system consists of several key components:

### 1. Core Components

#### `OnboardingGuard` (Client-side)
- **Location**: `src/components/auth/OnboardingGuard.tsx`
- **Purpose**: Client-side onboarding protection for React components
- **Features**: 
  - Automatic redirect to onboarding page
  - Loading states during checks
  - Custom fallback components
  - Seamless integration with existing auth system

#### `withOnboardingGuard` (Higher-Order Component)
- **Purpose**: HOC for protecting components that require completed onboarding
- **Features**:
  - Automatic wrapping of components
  - Configurable redirect paths
  - Custom fallback components

### 2. Custom Hooks

#### `useOnboarding`
- **Location**: `src/hooks/useOnboarding.ts`
- **Purpose**: Hook for checking onboarding status
- **Returns**:
  - `needsOnboarding`: Boolean indicating if user needs onboarding
  - `onboardingCompleted`: Boolean indicating if onboarding is marked complete
  - `hasRequiredFields`: Boolean indicating if required fields are filled
  - `missingFields`: Array of missing field names

#### `useOnboardingGuard`
- **Purpose**: Hook for checking if user can access protected content
- **Returns**:
  - `canAccess`: Boolean indicating if user can access content
  - `isLoading`: Boolean indicating loading state
  - `redirectTo`: String indicating where to redirect if needed

### 3. Database Schema

The onboarding system adds the following fields to the user schema:

```typescript
// Onboarding fields
bio: { type: "string", defaultValue: "", input: false },
jobTitle: { type: "string", defaultValue: "", input: false },
websiteUrl: { type: "string", defaultValue: "", input: false },
twitterUsername: { type: "string", defaultValue: "", input: false },
linkedinUsername: { type: "string", defaultValue: "", input: false },
onboardingCompleted: { type: "boolean", defaultValue: false, input: false },
needsOnboarding: { type: "boolean", defaultValue: true, input: false },
```

### 4. Onboarding Flow

1. **User Registration**: New users are automatically marked as needing onboarding
2. **Dashboard Access**: Users trying to access dashboard are redirected to onboarding
3. **Profile Completion**: Users fill out required and optional profile fields
4. **Completion**: Onboarding is marked complete and users can access protected content

## Implementation Details

### 1. Auth Configuration Updates

The auth configuration (`src/app/auth.ts`) has been updated to:

- Include onboarding fields in the user schema
- Initialize onboarding fields during user creation
- Include onboarding fields in the session data

```typescript
// User schema additions
user: {
  additionalFields: {
    // ... existing fields
    bio: { type: "string", defaultValue: "", input: false },
    jobTitle: { type: "string", defaultValue: "", input: false },
    websiteUrl: { type: "string", defaultValue: "", input: false },
    twitterUsername: { type: "string", defaultValue: "", input: false },
    linkedinUsername: { type: "string", defaultValue: "", input: false },
    onboardingCompleted: { type: "boolean", defaultValue: false, input: false },
    needsOnboarding: { type: "boolean", defaultValue: true, input: false },
  },
},

// Database hooks for initialization
databaseHooks: {
  user: {
    create: {
      before: async (user, ctx) => {
        // Initialize onboarding fields for new users
        return {
          data: {
            ...user,
            // ... other fields
            bio: "",
            jobTitle: "",
            websiteUrl: "",
            twitterUsername: "",
            linkedinUsername: "",
            onboardingCompleted: false,
            needsOnboarding: true,
          },
        };
      },
    },
  },
},

// Session inclusion
plugins: [
  customSession(async ({ user, session }) => {
    return {
      user: {
        // ... existing fields
        bio: u.bio ?? "",
        jobTitle: u.jobTitle ?? "",
        websiteUrl: u.websiteUrl ?? "",
        twitterUsername: u.twitterUsername ?? "",
        linkedinUsername: u.linkedinUsername ?? "",
        onboardingCompleted: u.onboardingCompleted ?? false,
        needsOnboarding: u.needsOnboarding ?? true,
      },
      session: { ...session },
    };
  }),
],
```

### 2. Dashboard Protection

The dashboard layout (`src/app/(site)/dashboard/layout.tsx`) now uses the OnboardingGuard:

```typescript
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard redirectTo="/auth/signin">
      <OnboardingGuard redirectTo="/onboarding">
        <DashboardContent>{children}</DashboardContent>
      </OnboardingGuard>
    </AuthGuard>
  );
}
```

### 3. Onboarding Page

The onboarding page (`src/app/(site)/onboarding/page.tsx`) provides:

- Multi-step form for profile completion
- Validation of required fields
- API integration for saving profile data
- Automatic redirect to dashboard upon completion

### 4. API Integration

The profile API (`src/app/api/user/profile/route.ts`) handles:

- Fetching current profile data
- Updating profile with onboarding information
- Marking onboarding as complete

## Usage Examples

### 1. Basic Page Protection

```tsx
import { OnboardingGuard } from '@/components/auth';

export default function MyProtectedPage() {
  return (
    <OnboardingGuard redirectTo="/onboarding">
      <div>This content requires completed onboarding</div>
    </OnboardingGuard>
  );
}
```

### 2. Higher-Order Component

```tsx
import { withOnboardingGuard } from '@/components/auth';

function MyComponent() {
  return <div>Protected content</div>;
}

const ProtectedComponent = withOnboardingGuard(MyComponent, {
  redirectTo: '/onboarding',
  fallback: <div>Checking onboarding status...</div>
});

export default ProtectedComponent;
```

### 3. Conditional Rendering

```tsx
import { useOnboarding } from '@/hooks/useOnboarding';

function MyComponent() {
  const { needsOnboarding, hasRequiredFields } = useOnboarding();
  
  if (needsOnboarding) {
    return <div>Please complete onboarding first</div>;
  }
  
  return <div>Your content here</div>;
}
```

### 4. Layout Protection

```tsx
// src/app/(site)/protected-layout/layout.tsx
import { OnboardingGuard } from '@/components/auth';

export default function ProtectedLayout({ children }) {
  return (
    <OnboardingGuard redirectTo="/onboarding">
      {children}
    </OnboardingGuard>
  );
}
```

## Onboarding Fields

### Required Fields
- **bio**: User's professional bio/description
- **jobTitle**: User's professional role or title

### Optional Fields
- **websiteUrl**: User's personal or company website
- **twitterUsername**: User's Twitter handle
- **linkedinUsername**: User's LinkedIn profile username

### System Fields
- **onboardingCompleted**: Boolean flag indicating completion
- **needsOnboarding**: Boolean flag indicating if onboarding is needed

## Testing the System

### 1. New User Flow
1. Register a new user
2. Try to access `/dashboard`
3. Should be redirected to `/onboarding`
4. Complete the onboarding form
5. Should be redirected back to `/dashboard`

### 2. Existing User Flow
1. Access `/dashboard` with incomplete profile
2. Should be redirected to `/onboarding`
3. Complete missing fields
4. Should be redirected back to `/dashboard`

### 3. Completed User Flow
1. Access `/dashboard` with complete profile
2. Should access dashboard normally
3. No redirects should occur

## Example Page

Visit `/dashboard/example-onboarding-guard` to see working examples of all onboarding guard implementations.

## Benefits

### ✅ **Consistent User Experience**
- All users complete the same onboarding flow
- Consistent author information across the platform
- Professional appearance for content submissions

### ✅ **Improved Content Quality**
- Authors have complete profiles
- Better credibility for submitted content
- Professional presentation

### ✅ **Flexible Implementation**
- Multiple ways to implement protection
- Easy to add to existing components
- Configurable redirect paths

### ✅ **Maintainable Code**
- Centralized onboarding logic
- Reusable components and hooks
- Clear separation of concerns

## Files Created/Modified

### New Files:
- `src/components/auth/OnboardingGuard.tsx` - Onboarding protection component
- `src/hooks/useOnboarding.ts` - Onboarding status hooks
- `src/app/(site)/dashboard/example-onboarding-guard/page.tsx` - Example page
- `ONBOARDING_SYSTEM_GUIDE.md` - This documentation

### Modified Files:
- `src/app/auth.ts` - Added onboarding fields to schema and session
- `src/components/auth/index.ts` - Added OnboardingGuard exports
- `src/app/(site)/dashboard/layout.tsx` - Integrated OnboardingGuard

### Existing Files (No Changes):
- `src/app/(site)/onboarding/page.tsx` - Already implemented
- `src/app/api/user/profile/route.ts` - Already implemented

## Next Steps

1. **Test the Implementation**: Verify that new users are properly redirected to onboarding
2. **Customize Fields**: Add or modify onboarding fields as needed
3. **Style the Onboarding Page**: Customize the UI to match your brand
4. **Add Analytics**: Track onboarding completion rates
5. **Implement Progressive Onboarding**: Consider breaking onboarding into smaller steps for better UX 