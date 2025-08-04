"use client"
import { useEffect, useRef, useState } from "react";
import { Box, Alert, Grid, CircularProgress, Button, Typography, Container } from "@mui/material";
import TokenManager from "@/features/githubstars/components/TokenManager";
import RepoInput from "@/features/githubstars/components/RepoInput";
import StarHistoryChart from "@/features/githubstars/components/StarHistoryChart";
import { useStarHistory } from "@/features/githubstars/hooks/useStarHistory";
import utils from "@/features/githubstars/utils";
import { useRouter, useSearchParams } from 'next/navigation';
import { ShareActions } from "@/features/githubstars/components/ShareActions";
import { useToken } from "@/features/shared/context/TokenContext";
import { GitHub, Replay } from "@mui/icons-material";

export default function StarsComponent() {
  const [repos, setRepos] = useState<string[]>([]);
  const { token, status } = useToken();
  const [isFetching, setIsFetching] = useState(false);

  const { fetchHistory, loading, error } = useStarHistory();
  const [mergedData, setMergedData] = useState<{ date: string; [repoName: string]: string|number }[]>([]);
  const chartRef = useRef<HTMLDivElement>(null); 
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const initial = searchParams.get("repos");
    if (initial) {
      const parsed = initial.split(",").map(r => r.trim()).filter(Boolean);
      setRepos(parsed);
    }
  }, []);
  useEffect(() => {
    if (status === "ready" && repos.length > 0) {
      handleSubmit(repos);
    }
  }, [token, status, repos]);
  const handleAddRepo = (repo: string) => {
    const cleaned = utils.cleanRepo(repo);
    if (cleaned && !repos.includes(cleaned)) {
      const nextRepos = [...repos, cleaned];
      setRepos(nextRepos);
      const url = `?repos=${nextRepos.join(",")}`;
      router.replace(url, { scroll: false });
      handleSubmit(nextRepos); // trigger load
    }
  };
  
  const handleRemoveRepo = (repo: string) => {
    const nextRepos = repos.filter((r) => r !== repo);
    setRepos(nextRepos);
    const url = nextRepos.length ? `?repos=${nextRepos.join(",")}` : "";
    router.replace(url, { scroll: false });
    if (nextRepos.length > 0) {
      handleSubmit(nextRepos); // trigger load
    } else {
      setMergedData([]); // clear chart
    }
  };
  
  

const handleSubmit = async (customRepos?: string[]) => {
  const targets = Array.isArray(customRepos) ? customRepos : repos;
  if (!Array.isArray(targets)) {
    console.error("handleSubmit expected an array, got:", targets);
    return;
  }

  setMergedData([]);
  setIsFetching(true); // ⬅️ START manual fetch indicator

  const results: Record<string, { date: string; count: number }[]> = {};

  const fetches = targets.map(async (repo) => {
    const result = await fetchHistory(repo, token || "");
    if (result && Array.isArray(result)) {
      results[repo] = result;
    }
  });

  await Promise.all(fetches);
  const transformedData = utils.mergeRepoDataForRecharts(results);
  setMergedData(transformedData);
  setIsFetching(false); // ⬅️ END manual fetch indicator
};

  
  
  const handleRetry = () => {
    handleSubmit(repos); // Retry the fetch
  };

  return (
    <Container sx={{ py: 4 }}>
    {/* <Box sx={{ p: 4 }}> */}
      <Grid container spacing={2}>
  {/* Token Manager - Left side (smaller) */}
  <Grid item xs={12}  md={ 8 }  >

      <RepoInput
        loading={loading}
        repos={repos}
        onAdd={handleAddRepo}
        onRemove={handleRemoveRepo}
        onSubmit={handleSubmit}
      />
      </Grid>
      <Grid item xs={12}  md={ 4 }  >

      <TokenManager contentReady={true} />
      </Grid>
      </Grid>
{/* Unified Error & Loading UI */}
{(isFetching || loading || error) && (
  <Box sx={{ mt: 6, mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
    {error && (
      <Alert severity="error" sx={{ mt: 4 }}>
        <Typography>{error.message}</Typography>
        <Box mt={2}>
          <Button variant="outlined" color="inherit" onClick={handleRetry} startIcon={<Replay />}>
            Retry
          </Button>
        </Box>
      </Alert>
    )}

    {!error && (loading || isFetching) && (
      <>
        <CircularProgress size={32} sx={{ mb: 2 }} />
        <Typography variant="h6">Loading charts...</Typography>
      </>
    )}
  </Box>
)}




      {/* Render one chart for all repositories */}
      {mergedData.length > 0 && (
  <Box sx={{ mt: 4, mb: 2 }}>
    <ShareActions chartRef={chartRef} />

    {/* Wrap both title and chart with the same ref */}
    <Box ref={chartRef}sx={{
      maxWidth: "100%", // ensures it doesn't overflow
      mx: "auto",        // centers it
      width: "100%",     // takes up the container's width
      px: { xs:1, sm: 3, md: 5 }, // optional: responsive padding
    }}>
      <Typography textAlign="center" variant="h5" gutterBottom>
        <GitHub sx={{ verticalAlign: "middle", mr: 1 }} />
        GitHub Stars History
      </Typography>

      <StarHistoryChart loading={false} data={mergedData} />
    </Box>
  </Box>
)}


    </Container>
  
  );
}
