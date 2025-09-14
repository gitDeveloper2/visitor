/**
 * Frontend-only domain utilities for founder stories
 * Simple domain extraction utility without storage
 */

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
