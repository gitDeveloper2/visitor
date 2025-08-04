import React from 'react';
import { Grid, Typography } from '@mui/material';
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
 
  return (
    <div style={{ marginTop: '16px' }}>
      {/* <Typography variant="h4" gutterBottom>
        Photo Metadata
      </Typography> */}

      {/* <Grid container spacing={3}> */}
        {/* Image Metadata Section */}
        <Imagedata metadata={metadata} />

        {/* Camera Settings Section */}
        <CameraSettings metadata={metadata} />

        {/* GPS Section */}
        <GPS metadata={metadata} />

        {/* Additional Tags Section */}
        <AdditionalTags metadata={metadata} />

        {/* Thumbnail Section */}
        <Thumbnail metadata={metadata} />

       
      {/* </Grid> */}
    </div>
  );
};

export default ImageMetadata;
