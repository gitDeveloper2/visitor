import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Image } from '@mui/icons-material';
import { Exif } from '../../../../types/ExifData';

interface ThumbnailProps {
  metadata: Exif;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ metadata }) => {
  const thumbnail = metadata.thumbnail;

  // If no valid thumbnail data is available, return null to render nothing
  if (!thumbnail || 
      (!thumbnail.compression && 
       !thumbnail.xResolution && 
       !thumbnail.yResolution && 
       !thumbnail.resolutionUnit)) {
    return null;
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Thumbnail Information
      </Typography>

      <Grid container spacing={3}>
        {/* Compression */}
        {thumbnail.compression && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Image style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Compression: {thumbnail.compression}
            </Typography>
          </Grid>
        )}

        {/* X Resolution */}
        {thumbnail.xResolution && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              X Resolution: {thumbnail.xResolution} dpi
            </Typography>
          </Grid>
        )}

        {/* Y Resolution */}
        {thumbnail.yResolution && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Y Resolution: {thumbnail.yResolution} dpi
            </Typography>
          </Grid>
        )}

        {/* Resolution Unit */}
        {thumbnail.resolutionUnit && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Resolution Unit: {thumbnail.resolutionUnit}
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Thumbnail;
