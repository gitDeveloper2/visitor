import { useState, useEffect, useCallback } from 'react';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface ConsentState {
  hasConsented: boolean;
  preferences: ConsentPreferences;
  consentDate: string | null;
}

export const useConsent = () => {
  const [consentState, setConsentState] = useState<ConsentState>({
    hasConsented: false,
    preferences: {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    },
    consentDate: null,
  });

  // Load consent from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedConsent = localStorage.getItem('cookie-consent');
      const storedDate = localStorage.getItem('cookie-consent-date');
      
      if (storedConsent) {
        const preferences = JSON.parse(storedConsent);
        setConsentState({
          hasConsented: true,
          preferences,
          consentDate: storedDate,
        });
      }
    } catch (error) {
      console.error('Error loading consent preferences:', error);
    }
  }, []);

  // Initialize Google Consent Mode v2
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize gtag if not already present
    window.gtag = window.gtag || function() {
      (window.dataLayer = window.dataLayer || []).push(arguments);
    };

    // Set default consent mode (denied for all)
    window.gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied',
      'security_storage': 'granted', // Always granted for security
    });

    // Enable advanced consent mode for cookieless pings
    window.gtag('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied',
      'security_storage': 'granted',
    });
  }, []);

  // Update Google Consent Mode when preferences change
  const updateGoogleConsent = useCallback((preferences: ConsentPreferences) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    const consentUpdate: any = {
      'ad_storage': preferences.marketing ? 'granted' : 'denied',
      'analytics_storage': preferences.analytics ? 'granted' : 'denied',
      'ad_user_data': preferences.marketing ? 'granted' : 'denied',
      'ad_personalization': preferences.marketing ? 'granted' : 'denied',
      'functionality_storage': preferences.preferences ? 'granted' : 'denied',
      'personalization_storage': preferences.preferences ? 'granted' : 'denied',
      'security_storage': 'granted', // Always granted
    };

    window.gtag('consent', 'update', consentUpdate);
  }, []);

  // Save consent preferences
  const saveConsent = useCallback((preferences: ConsentPreferences) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('cookie-consent', JSON.stringify(preferences));
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
      
      setConsentState({
        hasConsented: true,
        preferences,
        consentDate: new Date().toISOString(),
      });

      updateGoogleConsent(preferences);
    } catch (error) {
      console.error('Error saving consent preferences:', error);
    }
  }, [updateGoogleConsent]);

  // Update specific consent preference
  const updateConsentPreference = useCallback((key: keyof ConsentPreferences, value: boolean) => {
    const newPreferences = { ...consentState.preferences, [key]: value };
    setConsentState(prev => ({ ...prev, preferences: newPreferences }));
  }, [consentState.preferences]);

  // Check if specific consent is granted
  const hasConsent = useCallback((type: keyof ConsentPreferences) => {
    return consentState.preferences[type];
  }, [consentState.preferences]);

  // Reset consent (for testing or user request)
  const resetConsent = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-consent-date');
      
      setConsentState({
        hasConsented: false,
        preferences: {
          necessary: true,
          analytics: false,
          marketing: false,
          preferences: false,
        },
        consentDate: null,
      });

      // Reset Google Consent Mode to defaults
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'functionality_storage': 'denied',
          'personalization_storage': 'denied',
          'security_storage': 'granted',
        });
      }
    } catch (error) {
      console.error('Error resetting consent:', error);
    }
  }, []);

  return {
    ...consentState,
    saveConsent,
    updateConsentPreference,
    hasConsent,
    resetConsent,
    updateGoogleConsent,
  };
};

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
} 