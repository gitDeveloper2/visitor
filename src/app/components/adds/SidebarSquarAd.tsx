'use client';

import { useEffect } from 'react';

export const SidebarSquareAd = () => {
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
    document.getElementById('sidebar-square-ad')?.appendChild(script);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/679cc28f219e9c32ea74204d2bed9b40/invoke.js';
    document.getElementById('sidebar-square-ad')?.appendChild(invokeScript);
  }, []);

  return <div id="sidebar-square-ad" style={{ margin: '10px 0' }}></div>;
};
