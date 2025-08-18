import { isDevelopment, isProduction } from "@/lib/config/environment";
import { adRegistry } from "./AdRegistry";

/**
 * Get an ad component by slot number
 * @param slotNumber - The ad slot number from the registry
 * @returns The ad component or null if not found
 */
export const getAdBySlot = (slotNumber: number) => {
  return adRegistry[slotNumber] || null;
};

/**
 * Check if ads should be shown (production only)
 * @returns boolean indicating if ads should be displayed
 */
export const shouldShowAds = () => {
  return isProduction();
};

/**
 * Check if we're in development mode (for showing placeholders)
 * @returns boolean indicating if we're in development
 */
export const isDevMode = () => {
  return isDevelopment();
};

/**
 * Get ad placement info for debugging
 * @param slotNumber - The ad slot number
 * @returns Object with placement information
 */
export const getAdPlacementInfo = (slotNumber: number) => {
  const slotNames: Record<number, string> = {
    1: "1stH2",
    2: "3rdH2", 
    3: "3rdh2",
    10: "DashboardHeader",
    11: "DashboardSidebar",
    20: "BlogListHeader",
    21: "BlogListFooter",
    30: "LaunchHeader",
    31: "LaunchSidebar",
    50: "SubmitAppHeader",
    51: "SubmitAppSidebar",
    52: "SubmitBlogHeader",
    53: "SubmitBlogSidebar",
  };

  return {
    slotNumber,
    slotName: slotNames[slotNumber] || "Unknown",
    environment: isDevelopment() ? "development" : "production",
    willShowAd: shouldShowAds(),
    willShowPlaceholder: isDevMode(),
  };
}; 