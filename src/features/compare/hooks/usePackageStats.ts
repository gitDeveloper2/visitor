import { useEffect, useState } from "react";
import {
  fetchNpmDownloads,
  fetchNpmDownloadHistory,
  fetchNpmRepository,
} from "@/features/compare/service/npmAPI";
import { BundleInfo, PackageMetrics, UsePackageMetricsResult } from "../compare.types";
import { TimeRange } from "../compare.types";  // Import TimeRange if not already imported
import { EMPTY_BUNDLE_INFO } from "../constants";

// Update the return type to include the retryFetch function
export function usePackageMetrics(
  packageNames: string[],
  timeRange: TimeRange
): UsePackageMetricsResult & { retryFetch: () => void } {  // Updated return type
  const [data, setData] = useState<Record<string, PackageMetrics>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retry state
  const [retry, setRetry] = useState(0); // A counter to trigger retries

  useEffect(() => {
    if (packageNames.length === 0) {
      setData({});
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          packageNames.map(async (pkg) => {
            const [downloads, history, repo] = await Promise.all([
              fetchNpmDownloads(pkg),
              fetchNpmDownloadHistory(pkg, timeRange), // Pass timeRange here
              fetchNpmRepository(pkg),
            ]);

            const bundle = { ...EMPTY_BUNDLE_INFO, repository: repo } as BundleInfo;
            const res = [pkg, { downloads, history, bundle }] as unknown as [string, PackageMetrics];

            return res;
          })
        );

        const combined = Object.fromEntries(results);
        setData(combined);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [packageNames, timeRange, retry]);  // Add retry as a dependency

  // Retry function
  const retryFetch = () => setRetry((prev) => prev + 1);

  return { data, loading, error, retryFetch };  // Return retryFetch along with other state
}
