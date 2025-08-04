'use client';

import { useEffect } from 'react';

export const FooterAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : '679cc28f219e9c32ea74204d2bed9b40',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    document.getElementById('footer-ad')?.appendChild(script);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/679cc28f219e9c32ea74204d2bed9b40/invoke.js';
    document.getElementById('footer-ad')?.appendChild(invokeScript);
  }, []);

  return <div id="footer-ad" style={{ textAlign: 'center', margin: '20px 0' }}></div>;
};
