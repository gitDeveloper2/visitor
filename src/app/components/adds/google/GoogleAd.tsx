"use client";

import { useEffect } from "react";
import { isDevelopment } from "@/lib/config/environment";
import { useConsent } from "@/hooks/useConsent";
import AdPlaceholder from "./AdPlaceholder";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type GoogleAdProps = {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function GoogleAd({ slot, className = "", style = {} }: GoogleAdProps) {
  const { hasConsent, hasConsented } = useConsent();

  // Check if marketing consent is given (required for ads in Europe)
  const canShowAd = hasConsented && hasConsent('marketing');

  // Always register the effect to keep hook order stable across renders.
  // Only push ads when we're in production and consent allows it.
  useEffect(() => {
    if (isDevelopment()) return;
    if (!canShowAd) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(`Ad push failed for slot ${slot}:`, e);
    }
  }, [slot, canShowAd]);

  // In development, show placeholder only if consent is given
  if (isDevelopment()) {
    if (!canShowAd) {
      return (
        <div className={`ad-consent-required ${className}`} style={{
          display: "block",
          width: "100%",
          minHeight: "90px",
          backgroundColor: "#fff3cd",
          border: "2px dashed #ffc107",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#856404",
          fontSize: "14px",
          fontFamily: "monospace",
          textAlign: "center",
          padding: "20px",
          margin: "10px 0",
          position: "relative",
          ...style,
        }}>
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              🔒 GDPR Consent Required
            </div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>
              Slot: {slot}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "4px" }}>
              Marketing consent needed to show ad
            </div>
          </div>
        </div>
      );
    }
    return <AdPlaceholder slot={slot} className={className} style={style} />;
  }

  // In production, show real AdSense ad only if consent is given
  if (!canShowAd) {
    return null; // Don't show anything without consent in production
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-5389930223435032"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
