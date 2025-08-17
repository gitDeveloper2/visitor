// Environment configuration for handling build-time vs runtime differences

export const isBuildTime = () => {
  return process.env.NODE_ENV === 'production' && typeof window === 'undefined';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const getBaseUrl = () => {
  // Check if we're on the server side
  if (typeof window === 'undefined') {
    // Server-side: always use localhost in development
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    
    // Production: use environment variable or default
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://basicutils.com';
  }
  // Client-side: use relative URL
  return '';
};

export const getApiUrl = (endpoint: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${endpoint}`;
};

// Configuration for different environments
export const config = {
  development: {
    apiBaseUrl: 'http://localhost:3000',
    enableDebugLogging: true,
    useFallbacks: false,
  },
  production: {
    apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://basicutils.com',
    enableDebugLogging: false,
    useFallbacks: true,
  },
  build: {
    apiBaseUrl: 'https://basicutils.com',
    enableDebugLogging: false,
    useFallbacks: true,
  }
};

export const getCurrentConfig = () => {
  if (isBuildTime()) {
    return config.build;
  }
  return config[process.env.NODE_ENV as keyof typeof config] || config.development;
};
