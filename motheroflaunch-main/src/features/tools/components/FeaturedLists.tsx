'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';

type List = {
  title: string;
  description: string;
  url: string;
};

type Props = {
  lists: List[];
};

export default function FeaturedLists({ lists }: Props) {
  if (!lists?.length) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          📂 Featured Lists
        </Typography>
        {lists.map(list => (
          <Box
            key={list.url}
            component="a"
            href={list.url}
            sx={{
              display: 'block',
              mb: 2,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover .title': { textDecoration: 'underline' },
            }}
          >
            <Typography className="title" variant="body2" fontWeight={600}>
              {list.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {list.description}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
