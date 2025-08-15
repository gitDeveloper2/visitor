import React from 'react';
import { Typography, Grid, Paper, Box, Stack, Chip } from '@mui/material';
import {
  Exposure,
  FilterHdr,
  ShutterSpeed,
  Lens,
  Brightness5,
  FlashOn,
  LocalFlorist,
  Camera,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getGlassStyles, getShadow } from '../../../../utils/themeUtils';
import { Exif } from '../../../../types/ExifData';

interface CameraSettingsProps {
  metadata: Exif;
}

const CameraSettings: React.FC<CameraSettingsProps> = ({ metadata }) => {
  const theme = useTheme();
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

  const settingItems = [
    { icon: <Exposure />, label: 'Exposure Time', value: settings.exposureTime, unit: 's' },
    { icon: <FilterHdr />, label: 'F-Number', value: settings.fNumber },
    { icon: <ShutterSpeed />, label: 'Shutter Speed', value: settings.shutterSpeedValue },
    { icon: <Lens />, label: 'Aperture', value: settings.apertureValue },
    { icon: <Brightness5 />, label: 'Brightness', value: settings.brightnessValue },
    { icon: <Brightness5 />, label: 'Exposure Bias', value: settings.exposureBiasValue },
    { icon: <Lens />, label: 'Max Aperture', value: settings.maxApertureValue },
    { icon: <LocalFlorist />, label: 'Metering Mode', value: settings.meteringMode },
    { icon: <FlashOn />, label: 'Flash', value: settings.flash },
    { icon: <Lens />, label: 'Focal Length', value: settings.focalLength, unit: 'mm' },
    { icon: <Lens />, label: 'Focal Length (35mm)', value: settings.focalLengthIn35mmFilm, unit: 'mm' },
  ].filter(item => item.value);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        ...getGlassStyles(theme),
        boxShadow: getShadow(theme, "elegant"),
        height: '100%',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Camera sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Camera Settings
        </Typography>
      </Box>

      {/* Settings Grid */}
      <Grid container spacing={2}>
        {settingItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: `${theme.palette.primary.main}08`,
                border: `1px solid ${theme.palette.primary.main}20`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}12`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.value}{item.unit ? ` ${item.unit}` : ''}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Summary Chip */}
      {settingItems.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Chip
            label={`${settingItems.length} camera settings detected`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      )}
    </Paper>
  );
};

export default CameraSettings;
