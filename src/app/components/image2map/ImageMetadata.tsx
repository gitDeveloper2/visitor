import React from 'react';
import { Grid, Typography, Box, Stack, Chip } from '@mui/material';
import { Camera, LocationOn, Settings, Image, Info } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Exif } from '../../../types/ExifData';
import CameraSettings from './Output/CameraSettings';
import GPS from './Output/GPSComponent';
import AdditionalTags from './Output/AdditionalTagsComponent';
import Thumbnail from './Output/ThumbnailComponent';
import Imagedata from './Output/ImageMetadata';

interface ImageMetadataProps {
  metadata: Exif;
}

const ImageMetadata: React.FC<ImageMetadataProps> = ({ metadata }) => {
  const theme = useTheme();
 
  return (
    <Box>
      {/* Metadata Overview */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Info sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Photo Metadata Analysis
          </Typography>
        </Stack>
        
        {/* Metadata Summary Chips */}
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
          <Chip 
            icon={<Image />} 
            label="Image Data" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<Camera />} 
            label="Camera Settings" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<LocationOn />} 
            label="GPS Data" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<Settings />} 
            label="Additional Tags" 
            color="primary" 
            variant="filled" 
          />
        </Stack>
      </Box>

      {/* Metadata Sections */}
      <Grid container spacing={4}>
        {/* Image Metadata Section */}
        <Grid item xs={12} md={6}>
          <Imagedata metadata={metadata} />
        </Grid>

        {/* Camera Settings Section */}
        <Grid item xs={12} md={6}>
          <CameraSettings metadata={metadata} />
        </Grid>

        {/* GPS Section */}
        <Grid item xs={12} md={6}>
          <GPS metadata={metadata} />
        </Grid>

        {/* Additional Tags Section */}
        <Grid item xs={12} md={6}>
          <AdditionalTags metadata={metadata} />
        </Grid>

        {/* Thumbnail Section - Full Width */}
        <Grid item xs={12}>
          <Thumbnail metadata={metadata} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageMetadata;
