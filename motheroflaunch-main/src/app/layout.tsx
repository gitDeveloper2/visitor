import { Inter } from "next/font/google";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../features/shared/theme";
import { ReactQueryProvider } from "../features/shared/components/ReactQueryProvider";
import { EditorOverlayProvider, Providers } from "../features/providers/providers";
import { VotesProvider } from "@features/providers/VotesContext";
import { Footer } from "@features/shared/components/Footer";
import { Navbar } from "@features/shared/components/navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Providers>

          <ReactQueryProvider>
          <VotesProvider>
          <EditorOverlayProvider> {/* ✅ wrap it here */}

          <Navbar/>
            {children}
            <Footer/>
            <div id="step-content-portal-root"></div>
</EditorOverlayProvider>
</VotesProvider>

            </ReactQueryProvider>
          </Providers>

        </ThemeProvider>
        
      </body>
    </html>
  );
}
