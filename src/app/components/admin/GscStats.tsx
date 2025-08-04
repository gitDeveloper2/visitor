// pages/gscInsightsPage.tsx
"use client";

import { Box, Typography, Grid, CircularProgress, FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material';
import { useGscInsights } from '../../../hooks/useGscInsights';
import { useState } from 'react';
import { useBlacklist } from '../../../hooks/useBlacklist';
import { ResultCard } from '@components/libs/GSCResultCard';
import { insightsConfig } from '../../../lib/config/gscConfig';
import { GscData } from '../../../types/gsc';

interface RankedArticle {
  url: string;
  score: number;
}

export default function GscInsightsPage() {
  const { gscInsights, loading } = useGscInsights();
  const { blacklistedUrls, addToBlacklist, isBlacklisted } = useBlacklist();
  const [perPage, setPerPage] = useState(10);

  const handleResultsPerPageChange = (event: SelectChangeEvent<number>) => {
    setPerPage(event.target.value as number);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const topArticles: RankedArticle[] = Object.entries(gscInsights).flatMap(([title, data]) => {
    return data.map((item) => ({
      url: item.url,
      score: item.clicks * item.ctr, // Sample score calculation, adjust as needed
    }));
  }).sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Google Search Console Insights
      </Typography>

      <FormControl sx={{ mb: 3 }} fullWidth>
        <InputLabel id="perPageLabel">Results per card</InputLabel>
        <Select
          labelId="perPageLabel"
          value={perPage}
          onChange={handleResultsPerPageChange}
          label="Results per card"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
 {/* Render the top articles list */}
 <Grid item xs={12}>
          <Typography variant="h5">Top 10 Articles to Focus On</Typography>
          {topArticles.map((article, index) => (
            <Box key={"toparticles"+index+article.url} sx={{ mt: 1 }}>
              <Typography>{index + 1}. {article.url} - Score: {article.score.toFixed(2)}</Typography>
            </Box>
          ))}
        </Grid>
      <Grid container spacing={3}>
        {insightsConfig.map((insight, index) => (
          
          <Grid item xs={12} sm={6} key={"insights"+index+insight.title}>
            <ResultCard
            
              title={insight.title}
              data={gscInsights[insight.title] || []}
              addToBlacklist={addToBlacklist}
              isBlacklisted={isBlacklisted}
              perPage={perPage}
            />
          </Grid>
        ))}
        
       
      </Grid>
    </Box>
  );
}
