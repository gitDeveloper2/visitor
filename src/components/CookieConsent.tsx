"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Link, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close, Settings, CheckCircle, Cancel } from '@mui/icons-material';
import { useCookieConsent } from '../context/CookieConsentContext';
import { ConsentPreferences } from '../hooks/useConsent';
import { shouldShowGDPRBanner, getStoredUserLocation } from '../utils/geoLocation';

interface CookieConsentProps {
  onConsentChange?: (consent: ConsentPreferences) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const theme = useTheme();
  const { openPreferences, hasConsent, hasConsented, preferences, saveConsent } = useCookieConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [localConsent, setLocalConsent] = useState<ConsentPreferences>(preferences);

  // Check if user is in EEA, UK, or Switzerland
  const [isRequiredRegion, setIsRequiredRegion] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLocation = async () => {
      // First check stored location
      const storedLocation = getStoredUserLocation();
      if (storedLocation) {
        // Use stored location if available
        setIsRequiredRegion(true); // For now, assume stored location means GDPR applies
        return;
      }

      // If no stored location, check current location
      try {
        const shouldShow = await shouldShowGDPRBanner();
        setIsRequiredRegion(shouldShow);
      } catch (error) {
        console.warn('Failed to determine location, defaulting to show banner:', error);
        setIsRequiredRegion(true); // Default to showing banner (safer approach)
      }
    };

    checkLocation();
  }, []);

  // Check if consent banner should be shown
  useEffect(() => {
    if (typeof window === 'undefined' || isRequiredRegion === null) return;
    
    if (!hasConsented && isRequiredRegion) {
      setShowBanner(true);
    }
  }, [hasConsented, isRequiredRegion]);

  // Sync local consent with context preferences
  useEffect(() => {
    setLocalConsent(preferences);
  }, [preferences]);

  // Initialize Google Consent Mode v2
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Google Consent Mode v2
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

  const handleAcceptAll = () => {
    const newConsent: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    setLocalConsent(newConsent);
    saveConsentToStorage(newConsent);
    updateGoogleConsent(newConsent);
    setShowBanner(false);
    onConsentChange?.(newConsent);
  };

  const handleRejectAll = () => {
    const newConsent: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    
    setLocalConsent(newConsent);
    saveConsentToStorage(newConsent);
    updateGoogleConsent(newConsent);
    setShowBanner(false);
    onConsentChange(newConsent);
  };

  const handleSavePreferences = () => {
    saveConsentToStorage(localConsent);
    updateGoogleConsent(localConsent);
    setShowBanner(false);
    setShowPreferences(false);
    onConsentChange(localConsent);
  };

  const saveConsentToStorage = (consentData: ConsentPreferences) => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  };

  const updateGoogleConsent = (consentData: ConsentPreferences) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    const consentUpdate: any = {
      'ad_storage': consentData.marketing ? 'granted' : 'denied',
      'analytics_storage': consentData.analytics ? 'granted' : 'denied',
      'ad_user_data': consentData.marketing ? 'granted' : 'denied',
      'ad_personalization': consentData.marketing ? 'granted' : 'denied',
      'functionality_storage': consentData.preferences ? 'granted' : 'denied',
      'personalization_storage': consentData.preferences ? 'granted' : 'denied',
      'security_storage': 'granted', // Always granted
    };

    window.gtag('consent', 'update', consentUpdate);
  };

  // Listen for footer link click to open preferences
  useEffect(() => {
    const handleOpenPreferences = () => {
      setShowBanner(false);
      // The preferences will be shown by the context provider
    };

    window.addEventListener('openCookiePreferences', handleOpenPreferences);
    
    return () => {
      window.removeEventListener('openCookiePreferences', handleOpenPreferences);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <>
      {/* Main Consent Banner - LEFT SIDE ONLY */}
      {showBanner && (
        <Paper
          elevation={24}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 'auto',
            width: window.innerWidth < 600 ? '100%' : window.innerWidth < 960 ? '400px' : '500px',
            zIndex: 10000,
            borderRadius: '0 8px 0 0',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: `1px solid ${theme.palette.divider}`,
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: '16px 24px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  We value your privacy
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  We use cookies and similar technologies to provide, protect, and improve our services. 
                  By clicking "Accept All", you consent to our use of cookies for analytics, marketing, 
                  and personalization. You can customize your preferences or reject non-essential cookies.
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  This site uses Google AdSense and analytics. Learn more in our{' '}
                  <Link href="/privacy" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                    Privacy Policy
                  </Link>
                  .
                </Typography>
              </Box>
              <Button
                onClick={() => setShowBanner(false)}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                <Close />
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => setShowPreferences(true)}
                startIcon={<Settings />}
                sx={{ 
                  minWidth: 140,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2',
                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2',
                  '&:hover': {
                    borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                Customize
              </Button>
              <Button
                variant="outlined"
                onClick={handleRejectAll}
                startIcon={<Cancel />}
                sx={{ 
                  minWidth: 140,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#d32f2f',
                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#d32f2f',
                  '&:hover': {
                    borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#d32f2f',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(211, 47, 47, 0.04)'
                  }
                }}
              >
                Reject All
              </Button>
              <Button
                variant="contained"
                onClick={handleAcceptAll}
                startIcon={<CheckCircle />}
                sx={{ 
                  minWidth: 140,
                  backgroundColor: theme.palette.mode === 'dark' ? '#4caf50' : '#2e7d32',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#45a049' : '#1b5e20'
                  }
                }}
              >
                Accept All
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Detailed Preferences Modal - LEFT SIDE ONLY */}
      {showPreferences && (
        <Paper
          elevation={24}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 'auto',
            width: window.innerWidth < 600 ? '100%' : window.innerWidth < 960 ? '400px' : '500px',
            zIndex: 10000,
            borderRadius: '0 8px 0 0',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: `1px solid ${theme.palette.divider}`,
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: '16px 24px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Cookie Preferences
              </Typography>
              <Button
                onClick={() => setShowPreferences(false)}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                <Close />
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Essential Cookies
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                These cookies are necessary for the website to function properly. They cannot be disabled.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main' }} />
                <Typography variant="body2">Always enabled</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Analytics Cookies
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  checked={localConsent.analytics}
                  onChange={(e) => setLocalConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                  style={{ transform: 'scale(1.2)' }}
                />
                <Typography variant="body2">Enable analytics cookies</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Marketing Cookies
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Used to deliver personalized advertisements and track advertising campaign performance.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  checked={localConsent.marketing}
                  onChange={(e) => setLocalConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                  style={{ transform: 'scale(1.2)' }}
                />
                <Typography variant="body2">Enable marketing cookies</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Preference Cookies
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Allow the website to remember choices you make and provide enhanced, more personal features.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  checked={localConsent.preferences}
                  onChange={(e) => setLocalConsent(prev => ({ ...prev, preferences: e.target.checked }))}
                  style={{ transform: 'scale(1.2)' }}
                />
                <Typography variant="body2">Enable preference cookies</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => setShowPreferences(false)}
                sx={{ minWidth: 140 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSavePreferences}
                sx={{ minWidth: 140 }}
              >
                Save Preferences
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default CookieConsent; 