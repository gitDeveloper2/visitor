// Client-safe badge assignment functions
// These functions make API calls instead of direct database access

import { isBuildTime, getBaseUrl } from '@/lib/config/environment';

export async function assignBadgeTextToAppClient(appId: string): Promise<string> {
  try {
    // During build time, return fallback to prevent build failures
    if (isBuildTime()) {
      console.log('Build time detected, returning fallback badge text');
      return 'Verified by BasicUtils';
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/badge-assignment/text?appId=${encodeURIComponent(appId)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return result.badgeText;
    } else {
      console.error('Failed to get badge text:', result.error);
      return 'Verified by BasicUtils'; // Fallback
    }
  } catch (error) {
    console.error('Error getting badge text:', error);
    return 'Verified by BasicUtils'; // Fallback
  }
}

export async function assignBadgeClassToAppClient(appId: string): Promise<string> {
  try {
    // During build time, return fallback to prevent build failures
    if (isBuildTime()) {
      console.log('Build time detected, returning fallback badge class');
      return 'verified-badge';
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/badge-assignment/class?appId=${encodeURIComponent(appId)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return result.badgeClass;
    } else {
      console.error('Failed to get badge class:', result.error);
      return 'verified-badge'; // Fallback
    }
  } catch (error) {
    console.error('Error getting badge class:', error);
    return 'verified-badge'; // Fallback
  }
}

export async function getBadgeTextVariationsClient(appId: string, count: number = 3): Promise<string[]> {
  try {
    // During build time, return fallback to prevent build failures
    if (isBuildTime()) {
      console.log('Build time detected, returning fallback badge text variations');
      return ['Verified by BasicUtils'];
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/badge-assignment/variations?appId=${encodeURIComponent(appId)}&count=${count}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return result.textVariations;
    } else {
      console.error('Failed to get badge text variations:', result.error);
      return ['Verified by BasicUtils']; // Fallback
    }
  } catch (error) {
    console.error('Error getting badge text variations:', error);
    return ['Verified by BasicUtils']; // Fallback
  }
}

export async function getBadgeClassVariationsClient(appId: string, count: number = 3): Promise<string[]> {
  try {
    // During build time, return fallback to prevent build failures
    if (isBuildTime()) {
      console.log('Build time detected, returning fallback badge class variations');
      return ['verified-badge'];
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/badge-assignment/class-variations?appId=${encodeURIComponent(appId)}&count=${count}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return result.classVariations;
    } else {
      console.error('Failed to get badge class variations:', result.error);
      return ['verified-badge']; // Fallback
    }
  } catch (error) {
    console.error('Error getting badge class variations:', error);
    return ['verified-badge']; // Fallback
  }
}

export async function getBadgeAssignmentInfoClient(appId: string) {
  try {
    // During build time, return fallback to prevent build failures
    if (isBuildTime()) {
      console.log('Build time detected, returning fallback badge assignment info');
      return null;
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/badge-assignment/info?appId=${encodeURIComponent(appId)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to get badge assignment info:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Error getting badge assignment info:', error);
    return null;
  }
} 