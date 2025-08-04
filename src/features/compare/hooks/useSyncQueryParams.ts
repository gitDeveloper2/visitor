import { useEffect, useState } from "react";
import { decodeParams, encodeParams } from "../utils";
import { useSearchParams } from "next/navigation";
import { Grouping, TimeRange } from "../compare.types";

interface UseSyncQueryParamsOptions {
  selectedPackages: string[];
  setSelectedPackages: (pkgs: string[]) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  grouping: Grouping;
  setGrouping: (grouping: Grouping) => void;
}

export function useSyncQueryParams({
  selectedPackages,
  setSelectedPackages,
  timeRange,
  setTimeRange,
  grouping,
  setGrouping,
}: UseSyncQueryParamsOptions) {
  const searchParams = useSearchParams();
  const [hasInitialized, setHasInitialized] = useState(false);

  // On initial client-side load, sync from URL → state
  useEffect(() => {
    if (typeof window === "undefined" || hasInitialized) return;

    const urlPackages = searchParams.get("packages");
    const urlHash = searchParams.get("hash");

    // Only update state if URL contains values
    if (urlPackages) {
      const pkgs = urlPackages.split(",").filter(Boolean);
      setSelectedPackages(pkgs);
    }

    if (urlHash) {
      const decoded = decodeParams(Number(urlHash));
      setTimeRange(decoded.timeRange);
      setGrouping(decoded.grouping);
    }

    setHasInitialized(true);
  }, [searchParams, hasInitialized, setSelectedPackages, setTimeRange, setGrouping]);

  // Push state → URL (only after initial load)
  useEffect(() => {
    if (!hasInitialized) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("packages", selectedPackages.join(","));
    const hash = encodeParams(timeRange, grouping);
    params.set("hash", hash.toString());

    const newUrl = `?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedPackages, timeRange, grouping, searchParams, hasInitialized]);
}
