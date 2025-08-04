"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import { Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import { Grouping, HistoryPoint, TimeRange } from "@/features/compare/compare.types";
import { formatYAxis } from "../utils";
import { getColor } from "@/features/shared/utils";
import { ScrollableLabelRow } from "@/features/shared/ScrollableLabelRow";
import { DownloadHistoryChartSkeleton } from "./skeletons/NpmSkeleton";
import { useEffect, useState } from "react";

interface DownloadHistoryChartProps {
  data: HistoryPoint[];
  packageNames: string[];
  timeRange: TimeRange;
  grouping: Grouping;
  loading:boolean;
}

export function DownloadHistoryChart({
  data,
  packageNames,
  grouping,
loading
}: DownloadHistoryChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showChart, setShowChart] = useState(false);
const [delayedReady, setDelayedReady] = useState(!loading);

useEffect(() => {
  let timeout: NodeJS.Timeout | null = null;

  if (!loading) {
    timeout = setTimeout(() => {
      setDelayedReady(true);
    }, 3000);
  } else {
    setDelayedReady(false);
  }

  return () => {
    if (timeout) clearTimeout(timeout);
  };
}, [loading]);

  
 

  if (!delayedReady) {
    return <DownloadHistoryChartSkeleton isLoaded={false} />;
  }
  
  
  
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 300, sm: 400 },
        // px: { xs: 1, sm: 2 },
        // py: 2,
      }}
    ><ScrollableLabelRow>
    {packageNames.map((pkg, idx) => (
      <Box
        key={pkg}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          maxWidth: 140,
          minWidth: 0,
          flexShrink: 0,
          mr: 2,
          lineHeight: 1, 
          justifyContent:'center',
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            backgroundColor: getColor(idx),
            borderRadius: "50%",
            flexShrink: 0,
          }}
        />
        <Box sx={{
                      // backgroundColor:'lightgrey'

        }}>
        <Typography
          variant="body2"
          title={pkg}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
            fontSize: isMobile ? "0.7rem" : "0.875rem",
            fontWeight: 600,
            color: getColor(idx),
            lineHeight: 1, // Match Avatar alignment
            display: "inline-block",
            verticalAlign: "middle", // Align with dot
            margin:'auto',
          }}
        >
          {pkg}
        </Typography>
        </Box>
      </Box>
    ))}
  </ScrollableLabelRow>
  


      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
           dataKey="date"
           tick={{ fontSize: isMobile ? 10 : 12 }}
           tickFormatter={(str) => {
             const date = new Date(str);
             const year = date.getFullYear();
             const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
         
             if (grouping === "daily") {
               return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
             } else if (grouping === "weekly") {
               // Check if the current week crosses into a new year
               const previousWeekYear = new Date(data[0].date).getFullYear(); // Assume the first date is for reference
               if (year !== previousWeekYear) {
                 return `Wk of ${monthDay}, ${year}`; // Add year only when crossing into a new year
               }
               return `Wk of ${monthDay}`; // Short format without the year
             } else {
               return str;
             }
           }}
           minTickGap={isMobile ? 10 : 15}
          >
            <Label
              value="Time"
              offset={-5}
              position="insideBottom"
              style={{ fill: "#666", fontSize: isMobile ? 10 : 12 }}
            />
          </XAxis>
          <YAxis
            width={isMobile ? 50 : 70}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickFormatter={(value) => formatYAxis(value)}
          >
            <Label
              value="Downloads"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fill: "#666", fontSize: isMobile ? 10 : 12 }}
            />
          </YAxis>
          <Tooltip formatter={(value) => formatYAxis(Number(value))} />
          {packageNames.map((pkg, idx) => (
            <Line
              key={pkg}
              type="monotone"
              dataKey={pkg}
              stroke={getColor(idx)}
              dot={false}
              strokeWidth={2}
              // isAnimationActive={false}

            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
