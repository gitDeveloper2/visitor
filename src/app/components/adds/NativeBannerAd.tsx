'use client';

import { useEffect } from 'react';

export const NativeBannerAd = () => {
  useEffect(() => {
    // Create and append the ad script
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//pl25027557.profitablecpmrate.com/f385ad005f94ea29cdc312f0f2e6c6d4/invoke.js';
    document.getElementById('native-banner-ad')?.appendChild(script);
  }, []);

  return (
    <div
      id="native-banner-ad"
      style={{ margin: '20px auto', textAlign: 'center' }}
    >
      {/* This div must match the required ID for the script */}
      <div id="container-f385ad005f94ea29cdc312f0f2e6c6d4"></div>
    </div>
  );
};
