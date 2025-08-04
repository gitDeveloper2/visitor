// components/TopArticlesCard.tsx

import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

interface TopArticlesCardProps {
  url: string;
  score: number;
  rank: number;
  addToBlacklist: (url: string) => void;
  isBlacklisted: (url: string) => boolean;
}

export const TopArticlesCard: React.FC<TopArticlesCardProps> = ({
  url,
  score,
  rank,
  addToBlacklist,
  isBlacklisted,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Rank {rank}: {url}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Importance Score: {score}
        </Typography>
        <IconButton
          onClick={() => addToBlacklist(url)}
          color="error"
          size="small"
          disabled={isBlacklisted(url)}
        >
          <BlockIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};
