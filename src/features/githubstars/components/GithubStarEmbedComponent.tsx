// app/embed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import StarHistoryChart from "@/features/githubstars/components/StarHistoryChart";
import { useSearchParams } from "next/navigation";
import { useStarHistory } from "@/features/githubstars/hooks/useStarHistory";
import utils from "@/features/githubstars/utils";

export default function GithubStarsEmbedComponent() {
  const searchParams = useSearchParams();
  const { fetchHistory } = useStarHistory();
  const [data, setData] = useState<{ date: string; [repoName: string]: number|string }[]>([]);

  useEffect(() => {
    const param = searchParams.get("repos");
    if (!param) return;
    const repos = param.split(",").map((r) => r.trim()).filter(Boolean);

    (async () => {
      const results: Record<string, { date: string; count: number }[]> = {};
      const fetches = repos.map(async (repo) => {
        const result = await fetchHistory(repo, "");
        if (result && Array.isArray(result)) {
          results[repo] = result;
        }
      });
      await Promise.all(fetches);
      const merged = utils.mergeRepoDataForRecharts(results);
      setData(merged);
    })();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
       
      {data.length > 0 && <StarHistoryChart loading={false} data={data} />}

    </Box>

  );
}
