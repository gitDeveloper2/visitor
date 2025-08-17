'use client';

import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { OnboardingGuard, withOnboardingGuard } from '@/components/auth/client';
import { useOnboarding } from '@/hooks/useOnboarding';

// Example 1: Using OnboardingGuard component
function ExampleWithComponent() {
  return (
    <OnboardingGuard redirectTo="/onboarding">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Example 1: Using OnboardingGuard Component
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This content is only visible to users who have completed onboarding.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          If a user hasn't completed onboarding, they will be redirected to /onboarding.
        </Typography>
      </Paper>
    </OnboardingGuard>
  );
}

// Example 2: Using withOnboardingGuard HOC
function ExampleWithHOC() {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Example 2: Using withOnboardingGuard HOC
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This component is wrapped with the withOnboardingGuard HOC.
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        The HOC automatically handles the onboarding check and redirect.
      </Typography>
    </Paper>
  );
}

// Example 3: Using useOnboarding hook for conditional rendering
function ExampleWithHook() {
  const { needsOnboarding, onboardingCompleted, hasRequiredFields, missingFields } = useOnboarding();

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Example 3: Using useOnboarding Hook
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Onboarding Status:</strong>
      </Typography>
      
      <Box sx={{ ml: 2, mb: 2 }}>
        <Typography variant="body2">
          • Needs Onboarding: {needsOnboarding ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          • Onboarding Completed: {onboardingCompleted ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          • Has Required Fields: {hasRequiredFields ? 'Yes' : 'No'}
        </Typography>
        {missingFields.length > 0 && (
          <Typography variant="body2" color="error">
            • Missing Fields: {missingFields.join(', ')}
          </Typography>
        )}
      </Box>

      {needsOnboarding ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="warning.main" gutterBottom>
            You need to complete onboarding to access this content.
          </Typography>
          <Button variant="contained" href="/onboarding" sx={{ mt: 1 }}>
            Complete Onboarding
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" color="success.main">
          ✅ You have completed onboarding and can access this content!
        </Typography>
      )}
    </Paper>
  );
}

// Wrap the HOC example
const ProtectedExampleWithHOC = withOnboardingGuard(ExampleWithHOC, {
  redirectTo: '/onboarding',
  fallback: <div>Checking onboarding status...</div>
});

export default function OnboardingGuardExamplePage() {
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Onboarding Guard Examples
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page demonstrates different ways to implement onboarding protection in your application.
      </Typography>

      <ExampleWithComponent />
      <ProtectedExampleWithHOC />
      <ExampleWithHook />

      <Paper sx={{ p: 3, mt: 4, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          How to Use Onboarding Guards
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>1. Component Wrapper:</strong>
        </Typography>
        <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.875rem' }}>
{`<OnboardingGuard redirectTo="/onboarding">
  <YourProtectedContent />
</OnboardingGuard>`}
        </Box>

        <Typography variant="body2" sx={{ mb: 2, mt: 3 }}>
          <strong>2. Higher-Order Component:</strong>
        </Typography>
        <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.875rem' }}>
{`const ProtectedComponent = withOnboardingGuard(YourComponent, {
  redirectTo: '/onboarding'
});`}
        </Box>

        <Typography variant="body2" sx={{ mb: 2, mt: 3 }}>
          <strong>3. Hook for Conditional Logic:</strong>
        </Typography>
        <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.875rem' }}>
{`const { needsOnboarding, hasRequiredFields } = useOnboarding();

if (needsOnboarding) {
  // Show onboarding prompt or redirect
}`}
        </Box>
      </Paper>
    </Box>
  );
} 