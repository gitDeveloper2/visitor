import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CircularProgress, 
  Typography, 
  Box, 
  IconButton, 
  Paper,
  Stack,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import { 
  LocationOn, 
  Home, 
  Business, 
  Map, 
  ContentCopy,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getShadow } from '../../../utils/themeUtils';

interface LocationInfoProps {
  lat: number;
  lon: number;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ lat, lon }) => {
  const theme = useTheme();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setError(false);
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
        const address = response.data?.address;
        if (address) {
          setLocation(address);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [lat, lon]);

  const copyCoordinatesToClipboard = async () => {
    const coordinates = `${lat}, ${lon}`;
    try {
      await navigator.clipboard.writeText(coordinates);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy coordinates: ', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={32} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Loading location details...
        </Typography>
      </Box>
    );
  }

  if (!location && error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="info" 
          icon={<Map />}
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Typography variant="body2">
            Check the map for the location. You can also scroll below to view other metadata. 
            To add GPS info to photos, click the 'Edit Photo GPS' button above.
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocationOn sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Location Details
        </Typography>
      </Box>

      {/* Location Information */}
      <Stack spacing={2}>
        {/* Address Components */}
        {location.road && (
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: `${theme.palette.primary.main}08` }}>
            <Home sx={{ color: theme.palette.primary.main, mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Road
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {location.road}
              </Typography>
            </Box>
          </Box>
        )}

        {location.suburb && (
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: `${theme.palette.secondary.main}08` }}>
            <Business sx={{ color: theme.palette.secondary.main, mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Suburb
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {location.suburb}
              </Typography>
            </Box>
          </Box>
        )}

        {location.town && (
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: `${theme.palette.info.main}08` }}>
            <Map sx={{ color: theme.palette.info.main, mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Town
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {location.town}
              </Typography>
            </Box>
          </Box>
        )}

        {location.city && (
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: `${theme.palette.warning.main}08` }}>
            <Map sx={{ color: theme.palette.warning.main, mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                City
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {location.city}
              </Typography>
            </Box>
          </Box>
        )}

        {/* State and Country */}
        {(location.state || location.country) && (
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${theme.palette.success.main}08` }}>
            <Stack spacing={1}>
              {location.state && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
                    State:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {location.state}
                  </Typography>
                </Box>
              )}
              {location.country && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
                    Country:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {location.country}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Coordinates Section */}
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              GPS Coordinates
            </Typography>
            <IconButton 
              onClick={copyCoordinatesToClipboard} 
              color="primary"
              size="small"
              sx={{ 
                bgcolor: copied ? theme.palette.success.main : 'transparent',
                color: copied ? 'white' : theme.palette.primary.main,
                '&:hover': {
                  bgcolor: copied ? theme.palette.success.dark : `${theme.palette.primary.main}10`,
                }
              }}
            >
              {copied ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
            </IconButton>
          </Box>
          
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip 
              label={`Lat: ${lat.toFixed(6)}`} 
              size="small" 
              variant="outlined"
              color="primary"
            />
            <Chip 
              label={`Lon: ${lon.toFixed(6)}`} 
              size="small" 
              variant="outlined"
              color="primary"
            />
          </Stack>
          
          {copied && (
            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
              ✓ Coordinates copied to clipboard
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default LocationInfo;