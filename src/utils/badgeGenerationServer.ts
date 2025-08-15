import { 
  assignBadgeTextToApp, 
  assignBadgeClassToApp 
} from './badgeAssignmentService';

// Server-side HTML string generator for easy copy-paste with deterministic badge assignment
export async function generateVerificationBadgeHtmlServer(
  appName: string, 
  appUrl: string, 
  appId: string,
  variant: 'default' | 'compact' | 'minimal' = 'default',
  theme: 'light' | 'dark' = 'light'
): Promise<string> {
  // Get deterministic badge text and class for this app
  const badgeText = await assignBadgeTextToApp(appId);
  const badgeClass = await assignBadgeClassToApp(appId);

  const baseStyles = `
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: ${variant === 'compact' ? '8px 12px' : variant === 'minimal' ? '6px 10px' : '12px 16px'};
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: ${variant === 'minimal' ? '12px' : '14px'};
    font-weight: 500;
    border: 1px solid;
    cursor: pointer;
  `;

  const lightStyles = `
    background-color: #ffffff;
    color: #2563eb;
    border-color: #dbeafe;
  `;

  const darkStyles = `
    background-color: #1e293b;
    color: #60a5fa;
    border-color: #334155;
  `;

  const styles = baseStyles + (theme === 'dark' ? darkStyles : lightStyles);

  if (variant === 'minimal') {
    return `
      <a href="${appUrl}" target="_blank" rel="noopener noreferrer" 
         style="${styles}" 
         class="${badgeClass}" 
         title="View ${appName} on BasicUtils"
         data-verification="true"
         data-app-id="${appId}"
         data-badge-text="${badgeText}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <span>${badgeText}</span>
      </a>
    `;
  }

  if (variant === 'compact') {
    return `
      <a href="${appUrl}" target="_blank" rel="noopener noreferrer" 
         style="${styles}" 
         class="${badgeClass}" 
         title="View ${appName} on BasicUtils"
         data-verification="true"
         data-app-id="${appId}"
         data-badge-text="${badgeText}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <span>${badgeText}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
      </a>
    `;
  }

  return `
    <a href="${appUrl}" target="_blank" rel="noopener noreferrer" 
       style="${styles}" 
       class="${badgeClass}" 
       title="View ${appName} on BasicUtils"
       data-verification="true"
       data-app-id="${appId}"
       data-badge-text="${badgeText}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <span style="font-weight: 600;">${badgeText}</span>
        <span style="font-size: 12px; opacity: 0.8;">View ${appName} on BasicUtils</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
      </svg>
    </a>
  `;
}

// Generate multiple badge variations for anti-tracking with consistent text
export async function generateAntiTrackingBadgesServer(
  appName: string, 
  appUrl: string, 
  appId: string,
  count: number = 3
): Promise<string[]> {
  const badges: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const variant = i === 0 ? 'default' : i === 1 ? 'compact' : 'minimal';
    const theme = i % 2 === 0 ? 'light' : 'dark';
    
    badges.push(await generateVerificationBadgeHtmlServer(appName, appUrl, appId, variant, theme));
  }
  
  return badges;
}

// Generate SEO-optimized badge with deterministic text
export async function generateSEOOptimizedBadgeServer(
  appName: string, 
  appUrl: string, 
  appId: string,
  customText?: string,
  includeSchema: boolean = true
): Promise<string> {
  // Use deterministic badge text if no custom text provided
  const badgeText = customText || await assignBadgeTextToApp(appId);
  const badgeClass = await assignBadgeClassToApp(appId);
  
  const badgeHtml = `
    <a href="${appUrl}" target="_blank" rel="noopener noreferrer" 
       style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 8px; text-decoration: none; transition: all 0.2s ease-in-out; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; border: 1px solid; cursor: pointer; background-color: #ffffff; color: #2563eb; border-color: #dbeafe;" 
       class="${badgeClass}-seo" 
       title="View ${appName} on BasicUtils"
       data-verification="true"
       data-app-name="${appName}"
       data-app-id="${appId}"
       data-badge-text="${badgeText}"
       data-verification-type="seo">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      <span>${badgeText}</span>
    </a>
  `;
  
  if (includeSchema) {
    const schemaMarkup = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "${appName}",
        "url": "${appUrl}",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "provider": {
          "@type": "Organization",
          "name": "BasicUtils",
          "url": "https://basicutils.com"
        }
      }
      </script>
    `;
    
    return badgeHtml + schemaMarkup;
  }
  
  return badgeHtml;
} 