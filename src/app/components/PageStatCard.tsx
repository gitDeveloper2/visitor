import React from "react";
import { Button, Typography, Box, Chip } from "@mui/material";
import { PageStats } from "../../types/PageStats";

// Helper function to get color coding
const getColor = (value: number, thresholds: [number, number, number]) => {
  if (value <= thresholds[0]) return "error"; // Red
  if (value <= thresholds[1]) return "warning"; // Yellow
  return "success"; // Green
};

interface Props {
  stats: PageStats;
  onRecalculate: () => void;
}

export const PageStatCard: React.FC<Props> = ({ stats, onRecalculate }) => {
  
  // Define thresholds for color coding
  const readingEaseThresholds: [number, number, number] = [30, 60, 100];
  const gradeLevelThresholds: [number, number, number] = [6, 9, 12];
  const wordSimplicityThresholds: [number, number, number] = [5, 10, 15];
  const passiveCountThresholds: [number, number, number] = [2, 5, 10];
  const overallScoreThresholds: [number, number, number] = [50, 75, 100]; // Example thresholds

  return (
    <Box sx={{ maxWidth: '100%', overflowX: 'auto' }} >
    <Box

      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="0.5rem"
      style={{ padding: "0.25rem 0.5rem" }}
    >
      {/* Basic Stats */}
      <Typography variant="caption" color="textSecondary">
        Words: <strong>{stats.stats.totalWords}</strong>
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Sentences: <strong>{stats.stats.totalSentences}</strong>
      </Typography>
  {/* Overall Score */}
  <Chip
        label={`Score: ${stats.stats.overallScore.toPrecision(3)}/100`}
        color={getColor(stats.stats.overallScore, overallScoreThresholds)}
        size="small"
        variant="outlined"
      />
      {/* Readability Scores */}
      <Chip
        label={`Reading Ease: ${stats.stats.fleschReadingEase.toPrecision(3)}/100`}
        color={getColor(stats.stats.fleschReadingEase, readingEaseThresholds)}
        size="small"
        variant="outlined"
      />
      <Chip
        label={`Grade Level: ${stats.stats.fleschKincaidGrade.toPrecision(3)}/12`}
        color={getColor(stats.stats.fleschKincaidGrade, gradeLevelThresholds)}
        size="small"
        variant="outlined"
      />
      <Chip
        label={`Simplicity: ${stats.stats.daleChallScore.toPrecision(3)}/15`}
        color={getColor(stats.stats.daleChallScore, wordSimplicityThresholds)}
        size="small"
        variant="outlined"
      />
      <Chip
        label={`Passive: ${stats.stats.passiveCount.toPrecision(3)}`}
        color={getColor(stats.stats.passiveCount, passiveCountThresholds)}
        size="small"
        variant="outlined"
      />

    

      {/* Recalculate Button */}
      <Button
        variant="text"
        size="small"
        onClick={onRecalculate}
        style={{ minWidth: "60px" }}
      >
        Recalculate
      </Button>
    </Box>
    </Box>
  );
};
