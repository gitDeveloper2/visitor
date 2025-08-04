'use client';

import { useEffect } from 'react';

export const SidebarLongAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : '95364a793f31081706f4fb3f406f4dcd',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
    `;
    document.getElementById('sidebar-long-ad')?.appendChild(script);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/95364a793f31081706f4fb3f406f4dcd/invoke.js';
    document.getElementById('sidebar-long-ad')?.appendChild(invokeScript);
  }, []);

  return <div id="sidebar-long-ad" style={{ margin: '10px 0' }}></div>;
};
