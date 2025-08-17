import { useAuthState } from './useAuth';

export interface OnboardingStatus {
  needsOnboarding: boolean;
  onboardingCompleted: boolean;
  hasRequiredFields: boolean;
  missingFields: string[];
}

export function useOnboarding(): OnboardingStatus {
  const { user } = useAuthState();

  if (!user) {
    return {
      needsOnboarding: false,
      onboardingCompleted: false,
      hasRequiredFields: false,
      missingFields: [],
    };
  }

  // Type assertion to access onboarding fields
  const userWithOnboarding = user as any;

  const missingFields: string[] = [];
  
  // Check required fields
  if (!userWithOnboarding.bio) missingFields.push('bio');
  if (!userWithOnboarding.jobTitle) missingFields.push('jobTitle');
  
  // Optional fields (for reference)
  if (!userWithOnboarding.websiteUrl) missingFields.push('websiteUrl');
  if (!userWithOnboarding.twitterUsername) missingFields.push('twitterUsername');
  if (!userWithOnboarding.linkedinUsername) missingFields.push('linkedinUsername');

  const hasRequiredFields = missingFields.length === 0;
  const onboardingCompleted = userWithOnboarding.onboardingCompleted || false;
  const needsOnboarding = userWithOnboarding.needsOnboarding || !onboardingCompleted || !hasRequiredFields;

  return {
    needsOnboarding,
    onboardingCompleted,
    hasRequiredFields,
    missingFields,
  };
}

// Hook to check if user can access protected content
export function useOnboardingGuard(): {
  canAccess: boolean;
  isLoading: boolean;
  redirectTo: string | null;
} {
  const { isLoading } = useAuthState();
  const onboardingStatus = useOnboarding();

  if (isLoading) {
    return {
      canAccess: false,
      isLoading: true,
      redirectTo: null,
    };
  }

  if (onboardingStatus.needsOnboarding) {
    return {
      canAccess: false,
      isLoading: false,
      redirectTo: '/onboarding',
    };
  }

  return {
    canAccess: true,
    isLoading: false,
    redirectTo: null,
  };
} 