import type { Metadata } from "next";
import { inter, poppins, outfit, plusJakartaSans, albertSans, fontClasses } from "./styles/fonts";
import "./globals.css";
import "./styles/responsive.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '../context/ThemeContext';
import GlobalStyles from "@styles/globalStyles";
import Script from "next/script";  // Import Script component
import Navbar from "@components/layout/Navbar";
import "@styles/quilstyles.module.css"
// Footer removed - now handled by individual pages
import { Analytics } from "@vercel/analytics/next"
import Footer from "@components/Footer";
import DonateButton from "@components/DonateButton";
import AuthProvider from "../context/authContexts";
// import CookieConsent from "@components/CookieConsent";
import { CookieConsentProvider } from "../context/CookieConsentContext";

import CookieConsent from "@/components/CookieConsent";
import AdSenseLoader from "@/components/AdSenseLoader";

const APPID=process.env.NEXT_PUBLIC_FACEBOOK_APPID
const ADMINID=process.env.NEXT_PUBLIC_FACEBOOK_ADMIN_ID
export const metadata: Metadata = {
  title: {
    template: "%s",
    default:""
  },
  description: "Simple solutions for a better life",
  icons: {
    icon: "/favicon.ico",
  },
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
 
 return (
    <html lang="en" suppressHydrationWarning className={fontClasses.all}>
       
      <meta name="trustpilot-one-time-domain-verification-id" content="8820f90d-483a-4d7c-a05a-8d1a308cc460"/>
      <meta property="fb:app_id" content={APPID}/>
<meta property="fb:admins" content={ADMINID}/>
<meta name="color-scheme" content="dark light" />
<meta name="theme-color" content="#0b0b0c" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=localStorage.getItem('theme-mode');var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(m?'dark':'light');var r=document.documentElement;r.setAttribute('data-theme',t);r.style.colorScheme=t;}catch(e){}})();`
        }}
      />

      {/* AdSense script moved to ConsentAwareScripts component */}
       
        <Script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0&appId=1532583460736509"
        />
      <body className={inter.className}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div id="fb-root"></div>
        <AppRouterCacheProvider>
            <ThemeProvider> 
              <AuthProvider>
                <CookieConsentProvider>
                  <GlobalStyles />
                  <Analytics/>
                  <div style={{ 
                    minHeight: "100vh",
                    display: "flex", 
                    flexDirection: "column",
                    overflow: "hidden" // Prevent horizontal scroll
                  }}>
                    <Navbar />
                    <DonateButton/>
                    <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
                      {children}
                    </main>
                    <div style={{ width: '100%', maxWidth: '300px', margin: '10px auto', textAlign: 'center' }}>
            
                    </div>
                    {/* Footer removed - now handled by individual pages */}
                    <Footer/>
                  </div>
                  
                  {/* Cookie Consent Banner */}
                  <CookieConsent />
                  
                  {/* AdSense Script Loader */}
                  <AdSenseLoader />
                  
                </CookieConsentProvider>
              </AuthProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
