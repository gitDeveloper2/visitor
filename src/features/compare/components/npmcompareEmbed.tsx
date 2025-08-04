import { useEffect, useState } from "react";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import StarHistoryChart from "@/features/githubstars/components/StarHistoryChart";
import { useStarHistory } from "@/features/githubstars/hooks/useStarHistory";
import utils from "@/features/githubstars/utils";
import { Replay } from "@mui/icons-material";
import { useToken } from "@/features/shared/context/TokenContext";
import { StarHistoryChartSkeleton } from "./skeletons/StarSkeleton";
import { DownloadHistoryChartSkeleton } from "./skeletons/NpmSkeleton";

type EmbedStarChartProps = {
  repos: string[];
  contentReady:boolean;
};

export function EmbedStarChart({ repos, contentReady }: EmbedStarChartProps) {
  const { fetchHistory } = useStarHistory();
  const [data, setData] = useState<any[]>([]);
  const { token, status } = useToken();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [delayedReady, setDelayedReady] = useState(false);

  const loadData = async () => {
  

    setLoading(true);
    setError(null);
    setDelayedReady(false);

    try {
      const results: Record<string, { date: string; count: number }[]> = {};
      const fetches = repos.map(async (repo) => {
        const result = await fetchHistory(repo, token ?? "");

        if (result && Array.isArray(result)) {
          results[repo] = result;
        } else {
          throw new Error(
            `Failed to fetch star history for "${repo}". You may have hit GitHub's rate limit. Create a personal access token to increase your request limit.`
          );
        }
      });

      await Promise.all(fetches);

      const merged = utils.mergeRepoDataForRecharts(results);
      setData(merged);
    } catch (err) {
      const message = (err as Error).message || "Unknown error while fetching star history.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    if (repos.length) {
      loadData();
    }
  }, [repos, token, status]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!loading && contentReady && !error) {
      timeout = setTimeout(() => {
        setDelayedReady(true);
      }, 3000);
    } else {
      setDelayedReady(false);
    }

    return () => clearTimeout(timeout);
  }, [loading, contentReady, error]);

  
  // ✅ Safe to return conditionally AFTER all hooks are called
  const loaderOn=loading || status === "loading" || !contentReady
  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          {error}
          <br />
          <Button sx={{ mt: 2 }} variant="outlined" color="primary" onClick={loadData} startIcon={<Replay />}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }
  if (!delayedReady) {
    return <DownloadHistoryChartSkeleton isLoaded={false} />;
  }
  



  return <>{data.length > 0 && <StarHistoryChart loading={loaderOn } data={data} />}</>;
}

