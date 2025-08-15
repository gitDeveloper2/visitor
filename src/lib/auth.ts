import { auth } from '../app/auth';
import { headers } from 'next/headers';

/**
 * Get the current session on the server side
 * This replaces getServerSession from NextAuth
 */
export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session?.user;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(requiredRole: string) {
  const session = await getServerSession();
  return session?.user?.role === requiredRole;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  return hasRole('admin');
}

/**
 * Check if user is pro
 */
export async function isPro() {
  const session = await getServerSession();
  return session?.user?.pro === true;
}

/**
 * Get current user ID
 */
export async function getCurrentUserId() {
  const session = await getServerSession();
  return session?.user?.id;
}

/**
 * Get current user email
 */
export async function getCurrentUserEmail() {
  const session = await getServerSession();
  return session?.user?.email;
}

/**
 * Get current user role
 */
export async function getCurrentUserRole() {
  const session = await getServerSession();
  return session?.user?.role || 'user';
}

/**
 * Check if user is suspended
 */
export async function isUserSuspended() {
  const session = await getServerSession();
  return session?.user?.suspended === true;
} 