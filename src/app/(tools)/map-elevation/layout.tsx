// app/elevation/layout.tsx
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

export const metadata = {
title: 'Elevation Map',
    description: 'Explore elevation at specific points or paths',
  };

export default function ElevationLayout({ children }: { children: ReactNode }) {
  return (
    <Box minHeight="70vh" padding={4} bgcolor="#f9f9f9">
      <Typography variant="h1" component={'h1'} gutterBottom >
        Elevation Map: Elevation finder
      </Typography>
      {children}
    </Box>
  );
}
