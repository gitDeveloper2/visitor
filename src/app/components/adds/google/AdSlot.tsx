"use client";

import React from "react";
import { adRegistry } from "./AdRegistry";

export default function AdSlot({ slot }: { slot: number }) {
  try {
    const ad = adRegistry[slot] ?? null;
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AdSlot] Render slot:', slot, 'Found:', Boolean(ad));
    }
    return <>{ad}</>;
  } catch (e) {
    console.error('[AdSlot] Error rendering slot:', slot, e);
    return null;
  }
}


