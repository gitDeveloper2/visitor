// components/ads/AdRegistry.tsx
import React from "react";
import GoogleAd from "./GoogleAd";
export const adRegistry: Record<number, React.ReactNode> = {
  1: <GoogleAd slot="8145805054" />,
  2: <GoogleAd slot="8596397043" />,
  3: <GoogleAd slot="5743244244" />,
};
