"use client";

import { Container, CircularProgress, Alert, Box, Grid, Typography, Button } from "@mui/material";
import { usePackageMetrics } from "@/features/compare/hooks/usePackageStats";
import { PackageSelector } from "@/features/compare/components/PackageSelector";
import { DownloadHistoryChart } from "@/features/compare/components/ComparisonChart";
import { transformHistoryData } from "@/features/compare/utils";
import { TimeRangeSelector } from "@/features/compare/components/TimeRangeSelector";
import { Grouping, PackageMetrics, TimeRange } from "@/features/compare/compare.types";
import { MetricsPanel } from "@/features/compare/components/MetricsPanel";
import { GroupingSelector } from "@/features/compare/components/GroupingSelector";
import { EmbedStarChart } from "@/features/compare/components/npmcompareEmbed";
import utils from "@/features/githubstars/utils";
import { GitHub } from "@mui/icons-material";  // Import the icons
import { FaNpm } from "react-icons/fa";
import TokenManager from "@/features/githubstars/components/TokenManager";
import { useSyncQueryParams } from "@/features/compare/hooks/useSyncQueryParams";
import { ShareActions } from "@/features/compare/components/ShareActions";
import { useEffect, useMemo, useRef, useState } from "react";
import { Replay } from "@mui/icons-material";  // Import icon
import { MetricsPanelSkeleton } from "./skeletons/MetricsPanelSkeleton";

export default function NpmComponent() {
  const [selectedPackages, setSelectedPackages] = useState<string[]>(["react"]);
  const [timeRange, setTimeRange] = useState<TimeRange>("last-year");
  const { data, loading, error,retryFetch } = usePackageMetrics(selectedPackages, timeRange);
  const [grouping, setGrouping] = useState<Grouping>("weekly");
  const chartRef = useRef<HTMLDivElement>(null); 
    const npmChartRef = useRef<HTMLDivElement>(null); 
    const githubChartRef = useRef<HTMLDivElement>(null); 
    const [contentReady, setContentReady] = useState(false);
    const [errorReady, setErrorReady] = useState(false);

    const [showChartSkeleton, setShowChartSkeleton] = useState(true);

    useEffect(() => {
      if (loading) {
        setShowChartSkeleton(true);
      } else if (!loading && !error && data && Object.keys(data).length > 0) {
        setShowChartSkeleton(false);
      } else {
        setShowChartSkeleton(true); // <-- this ensures skeleton stays during error or bad data
      }
    }, [loading, data, error]);
    
 
  useSyncQueryParams({
    selectedPackages,
    setSelectedPackages,
    timeRange,
    setTimeRange,
    grouping,
    setGrouping,
  });
  

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
  
  const repoList = useMemo(() => getRepoList(data), [data]);
  const totalSelected = useMemo(() => selectedPackages.length, [selectedPackages]);
  const validRepos = repoList.length;
  const missingRepoCount = totalSelected - validRepos;
  const showMissingRepoAlert = contentReady && missingRepoCount > 0;
  useEffect(() => {
    if (!loading) {
      if (!error && data && Object.keys(data).length > 0) {
        setContentReady(true);
        setErrorReady(false);
      } else if (error) {
        setContentReady(false);
        setErrorReady(true);
      } else {
        setContentReady(false);
        setErrorReady(false);
      }
    } else {
      setContentReady(false);
      setErrorReady(false);
    }
  }, [loading, error, data]);
  
  
    
  

  
  return (
    <Container sx={{ py: 4,mb:10 }}>
      {/* Time Range Selector */}
      <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
  {/* Left: Selectors */}
  <Grid item xs={12} md={8}>
    <Grid container spacing={{xs:0,md:2}} >
      <Grid item xs={6}  >
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </Grid>
      <Grid   item xs={6}>
        <GroupingSelector value={grouping} onChange={setGrouping} />
      </Grid>
      <Grid  item xs={12} >
        <PackageSelector
          selectedPackages={selectedPackages}
          onChange={setSelectedPackages}
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Right: Token Manager */}
  <Grid item xs={12} md={4} >
    <Box >
    <TokenManager contentReady={contentReady} />
    </Box>
  </Grid>
</Grid>



    
      {error && errorReady&& <Alert severity="error" sx={{ mt: 4 }}>{error}
      <Button
      sx={{ml:2}}
            variant="outlined"
            color="primary"
            onClick={retryFetch}
            startIcon={<Replay />}
          >
            Retry
          </Button>
          
          </Alert>}

      
  <Box ref={chartRef}>
    <Grid container spacing={3} sx={{ mt: 0 }}>
      <Grid item xs={12}>
        <ShareActions
          githubChartRef={githubChartRef}
          npmChartRef={npmChartRef}
          chartRef={chartRef}
        />
      </Grid>

      {contentReady && missingRepoCount > 0 && !loading && (
  <Grid item xs={12}>
    <Alert severity="warning" sx={{ mb: 3 }}>
      One or more selected packages don’t have a linked GitHub repository.
    </Alert>
  </Grid>
)}




<Grid item xs={12} md={6} ref={npmChartRef} sx={{ minHeight: { xs: 300, sm: 400 }, mb: { xs: 3, md: 0 } }}>
  <Typography textAlign="center" variant="h5" gutterBottom>
    <Box component="span" sx={{ verticalAlign: "middle", display: "inline-flex", mr: 1 }}>
      <FaNpm size={24} color="#cb0000" />
    </Box>
    NPM Download History
  </Typography>
  <DownloadHistoryChart
    data={chartData}
    packageNames={selectedPackages}
    timeRange={timeRange}
    grouping={grouping}
    loading={showChartSkeleton}
  />
</Grid>


      <Grid item xs={12} md={6} ref={githubChartRef} sx={{ minHeight: { xs: 300, sm: 400 } }}>
        <Typography textAlign="center" variant="h5" gutterBottom>
          <GitHub sx={{ verticalAlign: "middle", mr: 1 }} />
          GitHub Stars History
        </Typography>
        <EmbedStarChart contentReady={contentReady} repos={repoList} />

{contentReady && repoList.length === 0 && (
  <Alert severity="warning" sx={{ mt: 2 }}>
    One or more selected packages don’t have a linked GitHub repository.
  </Alert>
)}




      </Grid>
    </Grid>
  </Box>


{loading ? (
  <MetricsPanelSkeleton />
) : (
  <MetricsPanel data={data} selectedPackages={selectedPackages} />
)}




    </Container>
    
  );
}
