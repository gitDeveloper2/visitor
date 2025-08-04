import React from 'react';
import { Typography, Grid } from '@mui/material';
import { Info, ColorLens } from '@mui/icons-material';
import { Exif } from '../../../../types/ExifData';

interface AdditionalTagsProps {
  metadata: Exif;
}

const AdditionalTags: React.FC<AdditionalTagsProps> = ({ metadata }) => {
  const tags = metadata.additionalTags;

  // If no valid additionalTags metadata is available, return null to render nothing
  if (
    !tags ||
    (!tags.artist &&
      !tags.copyright &&
      !tags.userComment &&
      !tags.subSecTime &&
      !tags.subSecTimeOriginal &&
      !tags.subSecTimeDigitized &&
      !tags.colorSpace &&
      !tags.pixelXDimension &&
      !tags.pixelYDimension)
  ) {
    return null;
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Additional Tags
      </Typography>

      <Grid container spacing={3}>
        {/* Artist */}
        {tags.artist && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Info style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Artist: {tags.artist}
            </Typography>
          </Grid>
        )}

        {/* Copyright */}
        {tags.copyright && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">Copyright: {tags.copyright}</Typography>
          </Grid>
        )}

        {/* User Comment */}
        {tags.userComment && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">User Comment: {tags.userComment}</Typography>
          </Grid>
        )}

        {/* Subsecond Times */}
        {(tags.subSecTime || tags.subSecTimeOriginal || tags.subSecTimeDigitized) && (
          <Grid item xs={12} md={6}>
            {tags.subSecTime && (
              <Typography variant="body2">Subsecond Time: {tags.subSecTime}</Typography>
            )}
            {tags.subSecTimeOriginal && (
              <Typography variant="body2">
                Subsecond Time (Original): {tags.subSecTimeOriginal}
              </Typography>
            )}
            {tags.subSecTimeDigitized && (
              <Typography variant="body2">
                Subsecond Time (Digitized): {tags.subSecTimeDigitized}
              </Typography>
            )}
          </Grid>
        )}

        {/* Color Space */}
        {tags.colorSpace && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <ColorLens style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Color Space: {tags.colorSpace}
            </Typography>
          </Grid>
        )}

        {/* Pixel Dimensions */}
        {(tags.pixelXDimension || tags.pixelYDimension) && (
          <Grid item xs={12} md={6}>
            {tags.pixelXDimension && (
              <Typography variant="body2">Width: {tags.pixelXDimension} px</Typography>
            )}
            {tags.pixelYDimension && (
              <Typography variant="body2">Height: {tags.pixelYDimension} px</Typography>
            )}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default AdditionalTags;
