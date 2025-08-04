import { BundleInfo,TimeRange } from "./compare.types";

export const TIME_RANGE_OPTIONS: { label: string; value: TimeRange }[] = [
    { label: "Last 7 Days", value: "last-7-days" },
    { label: "Last 30 Days", value: "last-30-days" },
    { label: "Last 90 Days", value: "last-90-days" },
    { label: "Last Year", value: "last-year" },
    // { label: "Custom Range", value: "custom" },
  ];

export const combinationToHash: Record<string, number> = {
  "last-7-days_daily": 1,
  "last-7-days_weekly": 2,
  "last-7-days_monthly": 3,
  "last-30-days_daily": 4,
  "last-30-days_weekly": 5,
  "last-30-days_monthly": 6,
  "last-90-days_daily": 7,
  "last-90-days_weekly": 8,
  "last-90-days_monthly": 9,
  "last-year_daily": 10,
  "last-year_weekly": 11,
  "last-year_monthly": 12,
  "custom_daily": 13,
  "custom_weekly": 14,
  "custom_monthly": 15,
};

export const EMPTY_BUNDLE_INFO: BundleInfo = {
  assets: [],
  dependencyCount: 0,
  dependencySizes: [],
  description: '',
  gzip: 0,
  hasJSModule: '',
  hasJSNext: false,
  hasSideEffects: false,
  isModuleType: false,
  name: '',
  peerDependencies: [],
  repository: '',
  scoped: false,
  size: 0,
  version: '',
};
