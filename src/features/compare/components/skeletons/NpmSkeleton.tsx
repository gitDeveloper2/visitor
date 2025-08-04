"use client";

import { Box, Skeleton } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export function DownloadHistoryChartSkeleton({ isLoaded }: { isLoaded: boolean }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const maxVisible = isMobile ? 2 : 3;

  const [isVisible, setIsVisible] = useState(true); // controls opacity
  const [isMounted, setIsMounted] = useState(true); // controls presence

  // When actual chart is loaded, start fade out
  useEffect(() => {
    if (isLoaded) {
      setIsVisible(false); // trigger opacity transition
      const timeout = setTimeout(() => {
        setIsMounted(false); // remove after fade-out
      }, 1000); // match transition duration

      return () => clearTimeout(timeout);
    }
  }, [isLoaded]);

  if (!isMounted) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 300, sm: 400 },
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      {/* Label row skeleton */}
      <Box
        sx={{
          margin: "0 32px 0 84px",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          maxHeight: 48,
          px: 2,
          py: 0.5,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {Array.from({ length: maxVisible }).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              maxWidth: 140,
              flexShrink: 0,
            }}
          >
            <Skeleton variant="circular" width={10} height={10} />
            <Skeleton
              variant="text"
              width={isMobile ? 60 : 100}
              height={isMobile ? 12 : 16}
            />
          </Box>
        ))}
        <Skeleton
          variant="rounded"
          width={isMobile ? 40 : 50}
          height={20}
          sx={{ flexShrink: 0 }}
        />
      </Box>

      {/* Chart skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={`calc(100% - 48px)`}
      />
    </Box>
  );
}
