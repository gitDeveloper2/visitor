// src/features/compare/types.ts

export interface NpmDownloadsResponse {
  downloads: number;
  start: string;
  end: string;
}
export interface NpmDownloadHistory {
  downloads: { day: string; downloads: number }[];
  start: string;
  end: string;
  package: string;
}

export interface NpmDownloadHistoryResponse {
  downloads: { [date: string]: number };
  from: string;
  to: string;
}


export interface BundleInfo {
  assets: {
    gzip: number;
    name: string;
    size: number;
    type: string;
  }[];
  dependencyCount: number;
  dependencySizes: {
    approximateSize: number;
    name: string;
  }[];
  description: string;
  gzip: number;
  hasJSModule: string;
  hasJSNext: boolean;
  hasSideEffects: boolean;
  isModuleType: boolean;
  name: string;
  peerDependencies: string[];
  repository: string;
  scoped: boolean;
  size: number;
  version: string;
}



export type HistoryChartPoint = {
  date: string;
  [packageName: string]: string | number;
};
export interface PackageMetrics {
  downloads: NpmDownloadsResponse;
  history: NpmDownloadHistory;
  bundle: BundleInfo;
}

export interface UsePackageMetricsResult {
  data: Record<string, PackageMetrics>;
  loading: boolean;
  error: string | null;
}

export interface NpmSearchResponse {
  objects: { package: { name: string } }[];
}

export type TimeRange = "last-7-days" | "last-30-days" | "last-90-days" | "last-year" | "custom";
export type Grouping = "daily" | "weekly" | "monthly";
export interface HistoryPoint {
  date: string;
  [packageName: string]: string | number;
}