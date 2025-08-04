// components/EmbedStarChartSkeleton.tsx
import { Box, Skeleton } from "@mui/material";

export function EmbedStarChartSkeleton() {
  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 2 }}>
      {/* Title */}
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />

      {/* Chart area */}
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />

      {/* Footer controls or stats */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={80} height={24} />
      </Box>
    </Box>
  );
}
