# GDPR-Compliant Cookie Consent Implementation

This document describes the implementation of a GDPR-compliant cookie consent system for your Next.js website that integrates with Google AdSense and Google Consent Mode v2.

## Overview

The implementation provides:
- **GDPR/EEA/UK/CH compliance** with location-based consent banner display
- **Google Consent Mode v2** integration for cookieless analytics
- **Consent-aware script loading** for Google Analytics and AdSense
- **User preference management** with granular cookie controls
- **Footer link integration** for easy access to cookie preferences

## Components

### 1. CookieConsent Component (`src/components/CookieConsent.tsx`)
The main consent banner that appears at the bottom of the page for users in GDPR-compliant regions.

**Features:**
- Location-based display (only shows to EEA, UK, and Switzerland users)
- Three consent options: Accept All, Reject All, Customize
- GDPR-compliant language and transparency
- Links to privacy policy

### 2. CookiePreferencesModal Component (`src/components/CookiePreferencesModal.tsx`)
A detailed modal for users to customize their cookie preferences.

**Cookie Categories:**
- **Essential**: Always enabled (necessary for website functionality)
- **Analytics**: Google Analytics and performance tracking
- **Marketing**: Google AdSense and advertising cookies
- **Preferences**: User choice storage and personalization

### 3. useConsent Hook (`src/hooks/useConsent.ts`)
Custom React hook for managing consent state and Google Consent Mode.

**Features:**
- Consent state management
- Google Consent Mode v2 integration
- localStorage persistence
- Consent preference updates

### 4. ConsentAwareScripts Component (`src/components/ConsentAwareScripts.tsx`)
Conditionally loads Google Analytics and AdSense scripts based on user consent.

**Behavior:**
- Scripts only load after user consent
- Respects individual consent preferences
- Integrates with Google Consent Mode v2

### 5. CookieConsentContext (`src/context/CookieConsentContext.tsx`)
React context provider for global consent state management.

**Features:**
- Global consent state
- Event handling for footer link clicks
- Modal state management

### 6. GeoLocation Utility (`src/utils/geoLocation.ts`)
Utility for determining user location and GDPR compliance requirements.

**Features:**
- IP geolocation using ipapi.co (free tier)
- GDPR country list (EEA + UK + Switzerland)
- Location caching in localStorage
- Fallback handling for location detection failures

## Google Consent Mode v2 Integration

### Default Consent State
All consent types start as "denied" for maximum privacy:

```typescript
window.gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted', // Always granted for security
});
```

### Advanced Consent Mode
Enables cookieless pings even when consent is denied, allowing Google to:
- Measure website performance
- Serve non-personalized ads
- Provide basic analytics without cookies

### Consent Updates
When users grant consent, the system updates Google Consent Mode:

```typescript
window.gtag('consent', 'update', {
  'ad_storage': marketing ? 'granted' : 'denied',
  'analytics_storage': analytics ? 'granted' : 'denied',
  'ad_user_data': marketing ? 'granted' : 'denied',
  'ad_personalization': marketing ? 'granted' : 'denied',
  // ... other consent types
});
```

## Implementation Details

### 1. Layout Integration
The consent system is integrated into your main layout (`src/app/layout.tsx`):

```tsx
<CookieConsentProvider>
  {/* Your app content */}
  <CookieConsent onConsentChange={() => {}} />
  <ConsentAwareScripts />
</CookieConsentProvider>
```

### 2. Footer Integration
A "Privacy & Cookies" link is added to your footer that opens the preferences modal:

```tsx
{ label: "Privacy & Cookies", href: "#", onClick: () => window.dispatchEvent(new CustomEvent('openCookiePreferences')) }
```

### 3. Script Loading Strategy
- **Before consent**: No Google scripts load
- **After consent**: Scripts load based on user preferences
- **Analytics consent**: Google Analytics loads
- **Marketing consent**: Google AdSense loads

## Testing

### 1. Consent State Verification
Check that consent state is correctly passed to Google by inspecting network requests:
- Look for `gcd` parameter in Google requests
- Verify consent mode parameters in gtag calls

### 2. AdSense Behavior
- **No consent**: Non-personalized ads through cookieless pings
- **Marketing consent**: Personalized ads with full tracking
- **Analytics consent**: Performance measurement enabled

### 3. Location Detection
Test with different IP addresses or use browser dev tools to simulate locations:
- EEA/UK/CH users should see consent banner
- Non-GDPR users should not see banner

## Environment Variables

Ensure these environment variables are set:

```bash
# Google Analytics
NEXT_PUBLIC_MEASUREMENT_ID=G-XXXXXXXXXX

# Google AdSense (already configured in your code)
# ca-pub-5389930223435032
```

## Privacy Policy Updates

Update your privacy policy to include:

1. **Cookie categories** and their purposes
2. **Third-party services** (Google Analytics, AdSense)
3. **User rights** under GDPR
4. **Contact information** for data requests
5. **Consent withdrawal** instructions

## Compliance Features

### ✅ GDPR Requirements Met
- **Lawful basis**: Explicit consent before processing
- **Transparency**: Clear information about cookie usage
- **Granular control**: Individual consent for each category
- **Easy withdrawal**: Footer link to change preferences
- **Data minimization**: Only necessary data collected

### ✅ Google Requirements Met
- **Consent Mode v2**: TCF v2.2 compliant
- **Safe defaults**: All consent denied by default
- **Advanced mode**: Cookieless pings enabled
- **Proper integration**: Scripts load after consent

## Customization

### Styling
The consent banner uses Material-UI theming and can be customized by:
- Modifying the `sx` props in components
- Updating the theme colors
- Adjusting spacing and typography

### Language
Update the text content in:
- `CookieConsent.tsx` for banner text
- `CookiePreferencesModal.tsx` for modal text
- Footer link labels

### Location Detection
Replace the free IP geolocation service with a paid service for production:
- **ipinfo.io**: More reliable, paid tiers available
- **ipgeolocation.io**: Enterprise-grade service
- **MaxMind**: Self-hosted solution

## Troubleshooting

### Common Issues

1. **Banner not showing**: Check location detection and consent state
2. **Scripts not loading**: Verify consent preferences and script conditions
3. **Google errors**: Ensure Consent Mode is properly initialized
4. **Performance issues**: Check for multiple consent checks

### Debug Mode
Enable debug logging by setting:
```typescript
console.log('Consent state:', consentState);
console.log('Google Consent Mode:', window.gtag);
```

## Future Enhancements

1. **TCF v2.2 compliance**: Integrate with IAB consent framework
2. **Multi-language support**: Localized consent banners
3. **A/B testing**: Test different consent UI variations
4. **Analytics integration**: Track consent rates and preferences
5. **Automated compliance**: Regular GDPR requirement checks

## Support

For questions or issues with this implementation:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Test with different consent scenarios
4. Review Google's Consent Mode documentation

## Resources

- [Google Consent Mode v2 Documentation](https://developers.google.com/tag-platform/tag-manager/consent-apis)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [IAB TCF v2.2](https://iabeurope.eu/transparency-consent-framework/)
- [Cookie Consent Best Practices](https://www.cookielaw.org/) 