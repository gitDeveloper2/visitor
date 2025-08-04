'use client';

import { useEffect } from 'react';

export const TopBannerAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : '3e448d10ea94ffd327e80b3b0497da86',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    document.getElementById('top-banner-ad')?.appendChild(script);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/3e448d10ea94ffd327e80b3b0497da86/invoke.js';
    document.getElementById('top-banner-ad')?.appendChild(invokeScript);
  }, []);

  return <div id="top-banner-ad" style={{ textAlign: 'center', margin: '10px 0' }}></div>;
};
