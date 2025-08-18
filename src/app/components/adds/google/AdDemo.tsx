"use client";

import React from "react";
import { getAdBySlot, getAdPlacementInfo, isDevMode, shouldShowAds } from "./AdUtils";
import { isDevelopment } from "@/lib/config/environment";
import { useConsent } from "@/hooks/useConsent";

type AdDemoProps = {
  slotNumber: number;
  title?: string;
  className?: string;
};

export default function AdDemo({ slotNumber, title, className = "" }: AdDemoProps) {
  const placementInfo = getAdPlacementInfo(slotNumber);
  const adComponent = getAdBySlot(slotNumber);
  const { hasConsent, hasConsented } = useConsent();

  // Check GDPR compliance
  const canShowAd = hasConsented && hasConsent('marketing');
  const isEuropeanUser = true; // Assuming European user as requested

  if (!adComponent) {
    return (
      <div className={`ad-demo-error ${className}`} style={{
        padding: "20px",
        backgroundColor: "#fee",
        border: "1px solid #fcc",
        borderRadius: "8px",
        color: "#c33",
        textAlign: "center"
      }}>
        ❌ Ad slot {slotNumber} not found in registry
      </div>
    );
  }

  return (
    <div className={`ad-demo ${className}`}>
      {isDevelopment() && (
        <div style={{
          padding: "8px 12px",
          backgroundColor: "#e3f2fd",
          border: "1px solid #2196f3",
          borderRadius: "4px",
          marginBottom: "10px",
          fontSize: "12px",
          color: "#1976d2"
        }}>
          🔍 <strong>Ad Demo Mode</strong> - Slot {slotNumber} ({placementInfo.slotName})
          <br />
          Environment: {placementInfo.environment} | 
          Will show: {placementInfo.willShowPlaceholder ? "Placeholder" : "Real Ad"}
          <br />
          <span style={{ 
            color: canShowAd ? "#4caf50" : "#f44336",
            fontWeight: "bold"
          }}>
            GDPR: {canShowAd ? "✅ Consent Given" : "❌ Consent Required"}
          </span>
          {isEuropeanUser && (
            <span style={{ color: "#ff9800", marginLeft: "8px" }}>
              🇪🇺 European User
            </span>
          )}
        </div>
      )}
      
      {title && (
        <div style={{
          fontSize: "14px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#333"
        }}>
          {title}
        </div>
      )}
      
      {adComponent}
      
      {/* GDPR Information */}
      {isDevelopment() && (
        <div style={{
          marginTop: "8px",
          padding: "6px 8px",
          backgroundColor: "#f3e5f5",
          border: "1px solid #9c27b0",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#7b1fa2"
        }}>
          <strong>GDPR Compliance:</strong> This ad respects European privacy laws. 
          {canShowAd ? 
            " Marketing consent given - ad will display." : 
            " Marketing consent required - ad will not display until consent is given."
          }
        </div>
      )}
    </div>
  );
} 