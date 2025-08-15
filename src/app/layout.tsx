import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '../context/ThemeContext';
import GlobalStyles from "@styles/globalStyles";
import Script from "next/script";  // Import Script component
import Navbar from "@components/layout/Navbar";
import { Category } from "./data/CatgoriesData";
import { fetchProcessedCategories } from "../lib/services/mongo/links";
import "@styles/quilstyles.module.css"
// Footer removed - now handled by individual pages
import { Analytics } from "@vercel/analytics/next"
import Footer from "@components/Footer";
import DonateButton from "@components/DonateButton";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ['latin'], // This loads the Latin subset.
  weight: ['400', '700'], // Add the desired font weights, e.g., normal (400) and bold (700)
});
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
 
 const categories:Category[]=await fetchProcessedCategories()
 
 return (
    <html lang="en" suppressHydrationWarning>
       
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

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5389930223435032"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
       
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
              <GlobalStyles />
              <Analytics/>
              <div style={{ minHeight: "90vh" }}>
                <Navbar categories={categories}  />
                <DonateButton/>
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
               <div style={{ width: '100%', maxWidth: '300px', margin: '10px auto', textAlign: 'center' }}>
      
    </div>

              
                {/* Footer removed - now handled by individual pages */}
                <Footer/>
              </div>
            </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
