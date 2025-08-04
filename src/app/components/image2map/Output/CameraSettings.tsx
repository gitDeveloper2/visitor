import React from 'react';
import { Typography, Grid } from '@mui/material';
import {
  Exposure,
  FilterHdr,
  ShutterSpeed,
  Lens,
  Brightness5,
  FlashOn,
  LocalFlorist,
} from '@mui/icons-material';
import { Exif } from '../../../../types/ExifData';

interface CameraSettingsProps {
  metadata: Exif;
}

const CameraSettings: React.FC<CameraSettingsProps> = ({ metadata }) => {
  const settings = metadata.cameraSettings;

  // If no valid cameraSettings metadata is available, return null
  if (
    !settings ||
    (!settings.exposureTime &&
      !settings.fNumber &&
      !settings.shutterSpeedValue &&
      !settings.apertureValue &&
      !settings.brightnessValue &&
      !settings.exposureBiasValue &&
      !settings.maxApertureValue &&
      !settings.meteringMode &&
      !settings.flash &&
      !settings.focalLength &&
      !settings.focalLengthIn35mmFilm)
  ) {
    return null;
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Camera Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Exposure Time */}
        {settings.exposureTime && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Exposure style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Exposure Time: {settings.exposureTime}s
            </Typography>
          </Grid>
        )}

        {/* F-Number */}
        {settings.fNumber && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <FilterHdr style={{ marginRight: 8, verticalAlign: 'middle' }} />
              F-Number: {settings.fNumber}
            </Typography>
          </Grid>
        )}

        {/* Shutter Speed */}
        {settings.shutterSpeedValue && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <ShutterSpeed style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Shutter Speed: {settings.shutterSpeedValue}
            </Typography>
          </Grid>
        )}

        {/* Aperture Value */}
        {settings.apertureValue && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Lens style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Aperture: {settings.apertureValue}
            </Typography>
          </Grid>
        )}

        {/* Brightness Value */}
        {settings.brightnessValue && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Brightness5 style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Brightness: {settings.brightnessValue}
            </Typography>
          </Grid>
        )}

        {/* Exposure Bias Value */}
        {settings.exposureBiasValue && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Brightness5 style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Exposure Bias: {settings.exposureBiasValue}
            </Typography>
          </Grid>
        )}

        {/* Max Aperture Value */}
        {settings.maxApertureValue && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Lens style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Max Aperture: {settings.maxApertureValue}
            </Typography>
          </Grid>
        )}

        {/* Metering Mode */}
        {settings.meteringMode && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <LocalFlorist style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Metering Mode: {settings.meteringMode}
            </Typography>
          </Grid>
        )}

        {/* Flash */}
        {settings.flash && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <FlashOn style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Flash: {settings.flash}
            </Typography>
          </Grid>
        )}

        {/* Focal Length */}
        {settings.focalLength && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Lens style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Focal Length: {settings.focalLength} mm
            </Typography>
          </Grid>
        )}

        {/* Focal Length in 35mm Film */}
        {settings.focalLengthIn35mmFilm && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              <Lens style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Focal Length (35mm): {settings.focalLengthIn35mmFilm} mm
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default CameraSettings;
