// app/providers.tsx or app/layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@/context/ThemeContext';
import GlobalStyles from "@/app/styles/globalStyles";
import { Analytics } from "@vercel/analytics/next";
import AuthProvider from "@/context/authContexts";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieConsent from "@/components/CookieConsent";
import AdSenseLoader from "@/components/AdSenseLoader";
import { VotesProvider } from '@/features/providers/VotesContext';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppRouterCacheProvider>
      <ThemeProvider>
        <AuthProvider>
          <CookieConsentProvider>
            <GlobalStyles />
            <Analytics />
            <CookieConsent />
            <AdSenseLoader />
            <QueryClientProvider client={queryClient}>
              <VotesProvider>
                {children}
              </VotesProvider>
            </QueryClientProvider>
          </CookieConsentProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
