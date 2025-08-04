import React, { forwardRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
import { Box,useMediaQuery, useTheme } from "@mui/material";
import utils from "@/features/githubstars/utils";
import { CustomTooltip } from "@/features/githubstars/components/CustomToolTip";
import { RepoLabel } from "@/features/githubstars/components/RepoLabel";
import { StarGazersProps } from "../githubstarts.types";
import { getColor } from "@/features/shared/utils";
import { ScrollableLabelRow } from "@/features/shared/ScrollableLabelRow";
import { StarHistoryChartSkeleton } from "@/features/compare/components/skeletons/StarSkeleton";

const StarHistoryChart = forwardRef<HTMLDivElement, StarGazersProps&{loading:boolean} >(({ data,loading }, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const chartRef = useRef<HTMLDivElement>(null);  
  const processedData = utils.processChartData(data);
  const repoKeys = utils.extractRepoKeys(data);
  const yearlyTicks = utils.getYearlyTicks(processedData);



  return (
    <Box sx={{
      width: "100%",
      height: { xs: 300, sm: 400 },
      // px: { xs: 1, sm: 2 },
      // py: 2,
    }} ref={ref}  >
    
    <ScrollableLabelRow>
  {repoKeys.map((repoName, index) => (
    <RepoLabel key={repoName} repoName={repoName} color={getColor(index)}  />
  ))}
</ScrollableLabelRow>

     

      <ResponsiveContainer width="100%" height="100%">

      <LineChart
          data={processedData}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
                    <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => new Date(ts).getFullYear().toString()}
            ticks={yearlyTicks}
            minTickGap={isMobile ? 10 : 15}
            tick={{ fontSize: isMobile ? 10 : 12 }}

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
          tickFormatter={utils.formatYAxisValue} >
            <Label
               value="Stars"
               angle={-90}
               position="insideLeft"
               style={{ textAnchor: "middle", fill: "#666", fontSize: isMobile ? 10 : 12 }}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          {repoKeys.map((repoName, index) => (
            <Line
              key={repoName}
              type="monotone"
              dataKey={repoName}
              stroke={getColor(index)}
              strokeWidth={2}
              dot={false}
              name={repoName}
              connectNulls
              // isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>



    </Box>
  );
})
StarHistoryChart.displayName = 'StarHistoryChart'; // Explicitly setting displayName

export default StarHistoryChart