"use client";
import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { ScrollableLabelRow } from "@/features/shared/ScrollableLabelRow";

const PLACEHOLDER_REPOS = ["repo-a", "repo-b", "repo-c"];

export function StarHistoryChartSkeleton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 300, sm: 400 },
      }}
    >
      <ScrollableLabelRow>
        {PLACEHOLDER_REPOS.map((repo) => (
          <Box
            key={repo}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              maxWidth: 140,
              minWidth: 0,
              flexShrink: 0,
              mr: 2,
              justifyContent: "center",
            }}
          >
            <Skeleton variant="circular" width={10} height={10} />
            <Skeleton variant="text" width={isMobile ? 50 : 100} height={16} />
          </Box>
        ))}
      </ScrollableLabelRow>

      <Skeleton
        variant="rectangular"
        height={isMobile ? 240 : 320}
        sx={{ borderRadius: 2, mt: 2 }}
      />
    </Box>
  );
}
