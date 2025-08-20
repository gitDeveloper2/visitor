'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import Image from 'next/image';

type Launch = {
  name: string;
  logo: string;
  url: string;
};

type Props = {
  launches: Launch[];
};

export default function TodaysLaunches({ launches }: Props) {
  if (!launches?.length) return null;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          📅 Today&apos;s Launches
        </Typography>
        {launches.map(tool => (
          <Box
            key={tool.url}
            display="flex"
            alignItems="center"
            gap={1.5}
            mb={1.5}
            component="a"
            href={tool.url}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                overflow: 'hidden',
                flexShrink: 0,
                bgcolor: '#f5f5f5',
              }}
            >
              <Image
                src={tool.logo}
                alt={tool.name}
                width={32}
                height={32}
                style={{ objectFit: 'contain' }}
              />
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {tool.name}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
