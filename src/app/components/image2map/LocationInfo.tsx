import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Box, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import MapIcon from '@mui/icons-material/Map';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface LocationInfoProps {
  lat: number;
  lon: number;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ lat, lon }) => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setError(false); // Reset error state before fetching
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
        const address = response.data?.address;
        if (address) {
          // console.log(address)
          setLocation(address);
        } else {
          setError(true); // Mark as error if no address is returned
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

  const copyCoordinatesToClipboard = () => {
    const coordinates = `${lat}, ${lon}`;
    navigator.clipboard.writeText(coordinates).then(() => {
      alert('Coordinates copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy coordinates: ', err);
    });
  };

   // If still loading, show a loader
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={24} />
        <Typography>Loading location...</Typography>
      </Box>
    );
  }

  // If there's no location and an error occurred, render nothing
  if (!location) {
    return null;
  }

  return (
    <Box sx={{ padding: 2, borderRadius: 1, backgroundColor: '#f9f9f9', boxShadow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        <LocationOnIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Location
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={24} />
          <Typography>Loading location...</Typography>
        </Box>
      ) : (
        <>
          {error ? (
            <Typography color="error" sx={{ mt: 2 }}>
Check the map for the location. You can also scroll below to view other meta data. To add GPS infor to photos, click the 'Edit Photo GPS' button above </Typography>
          ) : (
            location && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {location.road && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2">{`Road: ${location.road}`}</Typography>
                  </Box>
                )}
                {location.suburb && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2">{`Suburb: ${location.suburb}`}</Typography>
                  </Box>
                )}
                {location.town && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MapIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2">{`Town: ${location.town}`}</Typography>
                  </Box>
                )}
                {location.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MapIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body2">{`City: ${location.city}`}</Typography>
                  </Box>
                )}
                {location.state && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">{`State: ${location.state}`}</Typography>
                  </Box>
                )}
                {location.country && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">{`Country: ${location.country}`}</Typography>
                  </Box>
                )}

                {/* Coordinates Display */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ marginRight: 2 }}>
                    Latitude: {lat}, Longitude: {lon}
                  </Typography>
                  <IconButton onClick={copyCoordinatesToClipboard} color="primary">
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
            )
          )}
        </>
      )}
    </Box>
  );
};
export default LocationInfo;