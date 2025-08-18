"use client";

import React from "react";
import { isDevelopment } from "@/lib/config/environment";

type AdPlaceholderProps = {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function AdPlaceholder({ slot, className = "", style = {} }: AdPlaceholderProps) {
  if (!isDevelopment()) {
    return null;
  }

  const defaultStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    minHeight: "90px",
    backgroundColor: "#f0f0f0",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    fontSize: "14px",
    fontFamily: "monospace",
    textAlign: "center",
    padding: "20px",
    margin: "10px 0",
    position: "relative",
    ...style,
  };

  return (
    <div className={`ad-placeholder ${className}`} style={defaultStyle}>
      <div>
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
          📢 AdSense Placeholder
        </div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          Slot: {slot}
        </div>
        <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "4px" }}>
          GDPR Compliant - Marketing consent given
        </div>
        <div style={{ fontSize: "10px", opacity: 0.4, marginTop: "2px" }}>
          (Real AdSense ad will show in production)
        </div>
      </div>
    </div>
  );
} 