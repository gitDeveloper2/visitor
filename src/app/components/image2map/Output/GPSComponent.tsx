import React from 'react';
import { Typography, Grid } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { Exif } from '../../../../types/ExifData';

interface GPSProps {
  metadata: Exif;
}

const GPS: React.FC<GPSProps> = ({ metadata }) => {
  const gpsMetadata = metadata.gps;

  // If no valid GPS metadata is available, return null to render nothing
  if (
    !gpsMetadata ||
    (!gpsMetadata.latitude &&
      !gpsMetadata.longitude &&
      !gpsMetadata.altitude &&
      !gpsMetadata.gpsTimeStamp &&
      !gpsMetadata.gpsDateStamp)
  ) {
    return null;
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <Typography variant="h4" gutterBottom>
        GPS Information
      </Typography>

      <Grid container spacing={3}>
        {/* Latitude */}
        {gpsMetadata.latitude && gpsMetadata.latitudeRef && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <LocationOn style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Latitude: {gpsMetadata.latitude.toFixed(2)} {gpsMetadata.latitudeRef}
            </Typography>
          </Grid>
        )}

        {/* Longitude */}
        {gpsMetadata.longitude && gpsMetadata.longitudeRef && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <LocationOn style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Longitude: {gpsMetadata.longitude.toFixed(2)} {gpsMetadata.longitudeRef}
            </Typography>
          </Grid>
        )}

        {/* Altitude */}
        {gpsMetadata.altitude !== undefined && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <LocationOn style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Altitude: {gpsMetadata.altitude} meters{' '}
              {gpsMetadata.altitudeRef === 1 ? 'Below Sea Level' : 'Above Sea Level'}
            </Typography>
          </Grid>
        )}

        {/* GPS Timestamp */}
        {gpsMetadata.gpsTimeStamp && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">GPS Timestamp: {gpsMetadata.gpsTimeStamp}</Typography>
          </Grid>
        )}

        {/* GPS Date Stamp */}
        {gpsMetadata.gpsDateStamp && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">GPS Date Stamp: {gpsMetadata.gpsDateStamp}</Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default GPS;
