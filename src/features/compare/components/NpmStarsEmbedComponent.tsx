"use client";

import {  useEffect, useRef, useState } from "react";
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { decodeParams, transformHistoryData } from "@/features/compare/utils";
import { usePackageMetrics } from "@/features/compare/hooks/usePackageStats";
import { Grouping, PackageMetrics, TimeRange } from "@/features/compare/compare.types";
import { DownloadHistoryChart } from "@/features/compare/components/ComparisonChart";
import { EmbedStarChart } from "@/features/compare/components/npmcompareEmbed";
import utils from "@/features/githubstars/utils";
import { GitHub, Replay } from "@mui/icons-material";
import { FaNpm } from "react-icons/fa";
import EmbedFooter from "@/features/shared/components/embdedFooter";


export default function NpmStarsEmbedComponent() {
  const searchParams = useSearchParams();
  const chartRef = useRef<HTMLDivElement>(null);

  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("last-year");
  const [grouping, setGrouping] = useState<Grouping>("weekly");

  useEffect(() => {
    const urlPackages = searchParams.get("packages");
    const urlHash = searchParams.get("hash");

    if (urlPackages) {
      setSelectedPackages(urlPackages.split(",").filter(Boolean));
    }

    if (urlHash) {
      const decoded = decodeParams(Number(urlHash));
      setTimeRange(decoded.timeRange);
      setGrouping(decoded.grouping);
    }
  }, [searchParams]);

  const { data, loading, error,retryFetch } = usePackageMetrics(selectedPackages, timeRange);
  const chartData = transformHistoryData(data, grouping);

  const getRepoList = (data: Record<string, PackageMetrics>): string[] => {
    return Object.entries(data)
      .map(([pkgName, pkgMetrics]) => {
        const rawRepo = pkgMetrics?.bundle?.repository;
        const cleaned = rawRepo ? utils.cleanRepo(rawRepo) : null;
        if (!cleaned) console.warn(`No GitHub repo found for "${pkgName}"`);
        return cleaned;
      })
      .filter(Boolean) as string[];
  };

  const repoList = getRepoList(data);
  const totalSelected = selectedPackages.length;
  const validRepos = repoList.length;
  const missingRepoCount = totalSelected - validRepos;
  const showGitHubChart = validRepos > 0;
  const showMissingRepoAlert = missingRepoCount > 0;

  return (

    <Container sx={{ py: 4 }}>
      {loading && <CircularProgress sx={{ mt: 4 }} />}
      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
          <Button
            variant="outlined"
            color="primary"
            onClick={retryFetch}
            startIcon={<Replay />}
          >
            Retry
          </Button>
        </Alert>
      )}

      {!loading && !error && (
        <Box ref={chartRef} sx={{mb:4}}>
          <Grid container spacing={3}>
          <Grid item xs={12}>
              {showMissingRepoAlert && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  One or more selected packages don’t have a linked GitHub repository.
                </Alert>
              )}
            </Grid>

            <Grid item xs={6} >
              <Typography textAlign="center" variant="h6" gutterBottom>
                <Box component="span" sx={{ verticalAlign: "middle", display: "inline-flex", mr: 1 }}>
                  <FaNpm size={24} color="#cb0000" />
                </Box>
                NPM Download History
              </Typography>
              <DownloadHistoryChart

              loading={false}
                data={chartData}
                packageNames={selectedPackages}
                timeRange={timeRange}
                grouping={grouping}
              />
            </Grid>

            <Grid item xs={6} >
              <Typography textAlign="center" variant="h6" gutterBottom>
                <GitHub sx={{ verticalAlign: "middle", mr: 1 }} />
                GitHub Stars History
              </Typography>
              {showGitHubChart ? (
                <>
                <EmbedStarChart contentReady={true} repos={repoList} />
                
                </>
                
              ) : (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  One or more selected packages don’t have a linked GitHub repository.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Box>
      )}


<EmbedFooter/>
    </Container>
   
  );
}
