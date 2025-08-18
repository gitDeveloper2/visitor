// Utility to detect user location for GDPR compliance
// This helps determine if the cookie consent banner should be shown

export interface GeoLocationData {
  country: string;
  region?: string;
  city?: string;
  ip?: string;
}

// List of countries that require GDPR compliance
export const GDPR_COMPLIANCE_COUNTRIES = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IS', // Iceland
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LI', // Liechtenstein
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'NO', // Norway
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
  'UK', // United Kingdom
  'CH', // Switzerland
];

/**
 * Check if a country code requires GDPR compliance
 */
export const isGDPRCompliantCountry = (countryCode: string): boolean => {
  return GDPR_COMPLIANCE_COUNTRIES.includes(countryCode.toUpperCase());
};

/**
 * Get user location using IP geolocation
 * This is a basic implementation - you may want to use a service like:
 * - ipapi.co (free tier available)
 * - ipinfo.io (free tier available)
 * - ipgeolocation.io (paid)
 */
export const getUserLocation = async (): Promise<GeoLocationData | null> => {
  try {
    // Try to get location from a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    
    return {
      country: data.country_code,
      region: data.region,
      city: data.city,
      ip: data.ip,
    };
  } catch (error) {
    console.warn('Failed to get user location:', error);
    return null;
  }
};

/**
 * Check if the current user should see the GDPR consent banner
 * Defaults to true if location detection fails (safer approach)
 */
export const shouldShowGDPRBanner = async (): Promise<boolean> => {
  try {
    const location = await getUserLocation();
    
    if (!location || !location.country) {
      // If we can't determine location, show banner (safer approach)
      return true;
    }

    return isGDPRCompliantCountry(location.country);
  } catch (error) {
    console.warn('Error determining GDPR compliance:', error);
    // Default to showing banner if there's an error
    return true;
  }
};

/**
 * Get user location synchronously (for immediate use)
 * Returns null if location is not yet available
 */
export const getUserLocationSync = (): GeoLocationData | null => {
  // This would need to be populated by a previous async call
  // For now, return null - you could store this in localStorage
  // after the first successful location detection
  return null;
};

/**
 * Store user location in localStorage for future use
 */
export const storeUserLocation = (location: GeoLocationData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('user-location', JSON.stringify(location));
    localStorage.setItem('user-location-timestamp', Date.now().toString());
  } catch (error) {
    console.warn('Failed to store user location:', error);
  }
};

/**
 * Get stored user location from localStorage
 */
export const getStoredUserLocation = (): GeoLocationData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('user-location');
    const timestamp = localStorage.getItem('user-location-timestamp');
    
    if (!stored || !timestamp) return null;
    
    // Check if location data is less than 24 hours old
    const age = Date.now() - parseInt(timestamp);
    if (age > 24 * 60 * 60 * 1000) {
      // Data is too old, remove it
      localStorage.removeItem('user-location');
      localStorage.removeItem('user-location-timestamp');
      return null;
    }
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to get stored user location:', error);
    return null;
  }
}; 