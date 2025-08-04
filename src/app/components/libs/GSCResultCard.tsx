// components/ResultCard.tsx
import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

interface ResultCardProps {
  title: string;
  data: any[];
  addToBlacklist: (url: string) => void;
  isBlacklisted: (url: string) => boolean;
  perPage: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  data,
  addToBlacklist,
  isBlacklisted,
  perPage
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {data.slice(0, perPage).map((page: any) => (
          <div key={page.url} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>
              {page.url} - {page.clicks ? `Clicks: ${page.clicks} | ` : ''}{' '}
              {page.avgPosition ? `Position: ${page.avgPosition}` : ''}
            </Typography>
            <IconButton onClick={() => addToBlacklist(page.url)} color="error" size="small">
              <BlockIcon />
            </IconButton>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
