import { authClient } from '../app/auth-client';

/**
 * Custom hook that provides authentication state and methods
 * This replaces useSession and other NextAuth hooks
 */
export function useAuthState() {
  try {
    const { data: session, isPending, error } = authClient.useSession();
    console.log(session)
    
    // Determine authentication status based on session data
    const isAuthenticated = !!session?.user;
    const isUnauthenticated = !isPending && !session?.user;

  return {
    // Session state
    session,
    user: session?.user as any,
    
    // Loading states
    isLoading: isPending,
    isAuthenticated,
    isUnauthenticated,
    
    // Auth methods
    signIn: authClient.signIn,
    signOut: authClient.signOut,
    signUp: authClient.signUp,
    
    // User properties
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    userName: session?.user?.name,
    userRole: (session?.user as any)?.role || 'user',
    isPro: (session?.user as any)?.pro || false,
    isSuspended: (session?.user as any)?.suspended || false,
    userAvatar: (session?.user as any)?.avatarUrl || session?.user?.image,
    userGithubUsername: (session?.user as any)?.githubUsername,
    userSocialAccounts: (session?.user as any)?.socialAccounts || [],
    userKind: (session?.user as any)?.kind,
    
    // Helper methods
    hasRole: (role: string) => (session?.user as any)?.role === role,
    isAdmin: () => (session?.user as any)?.role === 'admin',
    isModerator: () => (session?.user as any)?.role === 'moderator',
  };
  } catch (error) {
    console.error('Error in useAuthState:', error);
    // Return default values if there's an error
    return {
      session: null,
      user: null,
      isLoading: true,
      isAuthenticated: false,
      isUnauthenticated: false,
      signIn: authClient.signIn,
      signOut: authClient.signOut,
      signUp: authClient.signUp,
      userId: null,
      userEmail: null,
      userName: null,
      userRole: 'user',
      isPro: false,
      isSuspended: false,
      userAvatar: null,
      userGithubUsername: null,
      userSocialAccounts: [],
      userKind: null,
      hasRole: () => false,
      isAdmin: () => false,
      isModerator: () => false,
    };
  }
}

/**
 * Hook for checking if user has specific permissions
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuthState();
  
  return {
    canCreateContent: isAuthenticated && !user?.suspended,
    canEditContent: isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator'),
    canDeleteContent: isAuthenticated && user?.role === 'admin',
    canManageUsers: isAuthenticated && user?.role === 'admin',
    canAccessAdmin: isAuthenticated && user?.role === 'admin',
    isProUser: isAuthenticated && user?.pro,
  };
}

/**
 * Hook for authentication actions
 */
export function useAuthActions() {
  return {
    signInWithEmail: (email: string, password: string) => 
      authClient.signIn.email({ email, password }),
    signInWithGoogle: () => authClient.signIn.social({ provider: 'google' }),
    signInWithGithub: () => authClient.signIn.social({ provider: 'github' }),
    signUpWithEmail: (email: string, password: string, name?: string) => 
      authClient.signUp.email({ email, password, name }),
    signOut: () => authClient.signOut(),
    resetPassword: (newPassword: string, token?: string) => authClient.resetPassword({ newPassword, token }),
    verifyEmail: (token: string) => authClient.verifyEmail({ token }),
  };
} 