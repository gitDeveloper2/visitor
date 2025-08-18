// components/ads/AdRegistry.tsx
import React from "react";
import GoogleAd from "./GoogleAd";

// Ad styling configurations for different types
const adStyles = {
  header: {
    marginBottom: "20px",
    marginTop: "10px",
  },
  sidebar: {
    marginBottom: "20px",
    position: "sticky" as const,
    top: "20px",
  },
  footer: {
    marginTop: "20px",
    marginBottom: "10px",
  },
  content: {
    margin: "20px 0",
  },
};

export const adRegistry: Record<number, React.ReactNode> = {
  // Original blog content ads
  1: <GoogleAd slot="8145805054" style={adStyles.content} />,  // 1stH2
  2: <GoogleAd slot="8596397043" style={adStyles.content} />,  // 3rdH2  
  3: <GoogleAd slot="5743244244" style={adStyles.content} />,  // 3rdh2
  
  // Dashboard ads (One ad per page - banner only)
  10: <GoogleAd slot="DEMO_SLOT_123" style={adStyles.header} />, // DashboardHeader - DEMO SLOT
  
  // Blog list ads
  20: <GoogleAd slot="3456789012" style={adStyles.header} />, // BlogListHeader
  
  // Launch/Apps ads
  30: <GoogleAd slot="5678901234" style={adStyles.header} />, // LaunchHeader
};
