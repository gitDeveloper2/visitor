"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConsent, ConsentPreferences } from '../hooks/useConsent';
import CookiePreferencesModal from '../components/CookiePreferencesModal';

interface CookieConsentContextType {
  openPreferences: () => void;
  hasConsent: (type: keyof ConsentPreferences) => boolean;
  hasConsented: boolean;
  preferences: ConsentPreferences;
  saveConsent: (preferences: ConsentPreferences) => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const consent = useConsent();

  // Listen for custom event from footer link
  useEffect(() => {
    const handleOpenPreferences = () => {
      setShowPreferences(true);
    };

    window.addEventListener('openCookiePreferences', handleOpenPreferences);
    
    return () => {
      window.removeEventListener('openCookiePreferences', handleOpenPreferences);
    };
  }, []);

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const value: CookieConsentContextType = {
    openPreferences,
    hasConsent: consent.hasConsent,
    hasConsented: consent.hasConsented,
    preferences: consent.preferences,
    saveConsent: consent.saveConsent,
    resetConsent: consent.resetConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      
      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal 
        isOpen={showPreferences} 
        onClose={() => setShowPreferences(false)} 
      />
    </CookieConsentContext.Provider>
  );
}; 