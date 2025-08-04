// src/features/compare/service/npmAPI.ts
import { NpmDownloadsResponse, NpmDownloadHistoryResponse, BundleInfo, } from "../compare.types";
import { getDateRange } from "../utils";
import { npmSlice } from "@/features/caching/delegator"

export async function fetchNpmDownloads(packageName: string): Promise<NpmDownloadsResponse> {
  const cacheKey = `fetchNpmDownloads:${packageName}:last-month`;
  const cached = await npmSlice.get(cacheKey);
  if (cached) return cached as NpmDownloadsResponse;
  const res = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${packageName}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch last-month downloads for ${packageName}`);
  }

  const data = await res.json();
  npmSlice.set(cacheKey, data);
  return data;
}

export async function fetchNpmDownloadHistory(
  packageName: string, 
  timeRange: string // Accept timeRange as a parameter
): Promise<NpmDownloadHistoryResponse> {
  // If you want to transform 'timeRange' into actual date ranges
  const range = getDateRange(timeRange);  // Modify getDateRange to handle "last-7-days", "last-year", etc.
  const cacheKey = `fetchNpmDownloadHistory:${packageName}:${range}`;
  const cached = await npmSlice.get(cacheKey);
  if (cached) return cached as NpmDownloadHistoryResponse;
  const res = await fetch(
    `https://api.npmjs.org/downloads/range/${range}/${packageName}`
  );

  if (!res.ok) throw new Error(`Failed to fetch downloads for ${packageName}`);
  const data = await res.json();
  npmSlice.set(cacheKey, data);
  return data;
}

export async function fetchBundleSize(packageName: string): Promise<BundleInfo> {
  const cacheKey = `fetchBundleSize:${packageName}`;
  const cached = await npmSlice.get(cacheKey);
  if (cached) return cached as BundleInfo;
  const res = await fetch(`/api/bundlephobia?package=${packageName}`);

  if (!res.ok)
    throw new Error(`Failed to fetch bundle size for ${packageName}`);
    const data = await res.json();
    npmSlice.set(cacheKey, data);
    return data;
}
export async function fetchNpmRepository(pkg: string): Promise<string | null> {
 
  const res = await fetch(`https://registry.npmjs.org/${pkg}`);
  if (!res.ok) return null;

  const data = await res.json();

  const url = data.repository?.url as string | undefined;
  if (!url) return null;

  // Strip "git+", ".git", and convert to standard GitHub URL
  return url
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/^git:/, 'https:'); // handle legacy git://
}
