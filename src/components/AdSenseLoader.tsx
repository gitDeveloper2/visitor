"use client";

import React, { useEffect } from 'react';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';
import { isProduction } from '@/lib/config/environment';

const AdSenseLoader: React.FC = () => {
  const { hasConsent, hasConsented } = useConsent();

  // Only load AdSense script if:
  // 1. We're in production mode
  // 2. User has given consent
  // 3. Marketing consent is specifically given (required for ads in Europe)
  if (!isProduction() || !hasConsented || !hasConsent('marketing')) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5389930223435032"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        // Initialize ads after script loads
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          // Push any existing ads
          const adElements = document.querySelectorAll('.adsbygoogle');
          adElements.forEach((adElement) => {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              console.error('Ad push failed:', e);
            }
          });
        }
      }}
    />
  );
};

export default AdSenseLoader; 