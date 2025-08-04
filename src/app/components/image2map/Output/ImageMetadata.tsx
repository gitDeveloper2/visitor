import React from 'react';
import { Typography, Grid, Divider } from '@mui/material';
import { Exif } from '../../../../types/ExifData';

interface ImageMetadataProps {
  metadata: Exif;
}

const ImageData: React.FC<ImageMetadataProps> = ({ metadata }) => {
  const imageMetadata = metadata.image;

  // If no valid image metadata is available, return null to render nothing
  if (!imageMetadata || 
      (!imageMetadata.make && 
       !imageMetadata.model && 
       !imageMetadata.xResolution && 
       !imageMetadata.yResolution && 
       !imageMetadata.resolutionUnit && 
       !imageMetadata.software && 
       !imageMetadata.dateTime)) {
    return null;
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Photo Metadata
      </Typography>

      <Grid container spacing={2}>
        {/* Make */}
        {imageMetadata.make && (
          <Grid item xs={6}>
            <Typography variant="body2">Make: {imageMetadata.make}</Typography>
          </Grid>
        )}

        {/* Model */}
        {imageMetadata.model && (
          <Grid item xs={6}>
            <Typography variant="body2">Model: {imageMetadata.model}</Typography>
          </Grid>
        )}

        {/* X Resolution */}
        {imageMetadata.xResolution && (
          <Grid item xs={6}>
            <Typography variant="body2">X Resolution: {imageMetadata.xResolution}</Typography>
          </Grid>
        )}

        {/* Y Resolution */}
        {imageMetadata.yResolution && (
          <Grid item xs={6}>
            <Typography variant="body2">Y Resolution: {imageMetadata.yResolution}</Typography>
          </Grid>
        )}

        {/* Resolution Unit */}
        {imageMetadata.resolutionUnit && (
          <Grid item xs={6}>
            <Typography variant="body2">Resolution Unit: {imageMetadata.resolutionUnit}</Typography>
          </Grid>
        )}

        {/* Software */}
        {imageMetadata.software && (
          <Grid item xs={6}>
            <Typography variant="body2">Software: {imageMetadata.software}</Typography>
          </Grid>
        )}

        {/* Date & Time */}
        {imageMetadata.dateTime && (
          <Grid item xs={6}>
            <Typography variant="body2">Date & Time: {imageMetadata.dateTime}</Typography>
          </Grid>
        )}

        {/* Divider */}
        <Grid item xs={12}>
          <Divider style={{ margin: '16px 0' }} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ImageData;
