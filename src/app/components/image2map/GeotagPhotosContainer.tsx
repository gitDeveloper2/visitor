"use client";

import React, { useCallback, useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import { 
  Cancel, 
  LocationOn, 
  PhotoCamera, 
  Map, 
  Edit, 
  Download,
  Upload,
  GpsFixed
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { getGlassStyles, getShadow } from "../../../utils/themeUtils";
import dynamic from "next/dynamic";
import GeotagSeoContent from "../../(tools)/geotagphotos/getotagSeoContent";

const MapDisplayForTagger = dynamic(() => import("./MapDisplayForTagger"), { ssr: false });
const GeoTagPhotos = dynamic(() => import("./GeoTagPhotos"), { ssr: false });

export const GeotagPhotosContainer: React.FC = () => {
  const theme = useTheme();
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleLocationSelect = useCallback((lat: number, lon: number) => {
    setCoordinates({ lat, lon });
  }, []);

  const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setIsDialogOpen(false), []);

  const handleImageSelected = useCallback((file: File) => {
    setSelectedImage(file);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            mb: 2,
            background: theme.custom.gradients.primary,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Geotag Photos - Add GPS to Images
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
        >
          Upload your photos and add precise GPS coordinates. Our tool allows you to geotag images 
          by selecting locations on an interactive map or manually entering coordinates.
        </Typography>
        
        {/* Feature Chips */}
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
          <Chip 
            icon={<Upload />} 
            label="Photo Upload" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<GpsFixed />} 
            label="GPS Tagging" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<Map />} 
            label="Interactive Map" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<Download />} 
            label="Download" 
            color="primary" 
            variant="filled" 
          />
        </Stack>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          <Stack spacing={3}>
            {/* Upload Section */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Upload Photo
              </Typography>
              <GeoTagPhotos 
                lat={coordinates.lat} 
                lon={coordinates.lon}
                onImageSelected={handleImageSelected}
              />
            </Paper>

            {/* Location Selection Info */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Location Selection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click on the map to select a location, or use the coordinates below
              </Typography>
              {coordinates.lat !== 0 && coordinates.lon !== 0 ? (
                <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Selected Coordinates:
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    Lat: {coordinates.lat.toFixed(6)}
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    Lon: {coordinates.lon.toFixed(6)}
                  </Typography>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Click on the map to select a location
                </Alert>
              )}
              <Button 
                variant="contained" 
                fullWidth
                onClick={handleOpenDialog}
                disabled={coordinates.lat === 0 && coordinates.lon === 0}
                sx={{ 
                  background: theme.custom.gradients.primary,
                  '&:hover': {
                    background: theme.custom.gradients.primary,
                    boxShadow: getShadow(theme, "neon"),
                  }
                }}
              >
                <Edit sx={{ mr: 1 }} />
                Edit Coordinates Manually
              </Button>
            </Paper>

            {/* Instructions */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                How to Use
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    1. Upload Photo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                    Select a JPEG image from your device
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    2. Select Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                    Click on the map or enter coordinates manually
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    3. Process & Download
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                    Add GPS data and download your geotagged image
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: "hidden",
              ...getGlassStyles(theme),
              boxShadow: getShadow(theme, "elegant"),
              minHeight: 600,
            }}
          >
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Interactive Map
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coordinates.lat !== 0 && coordinates.lon !== 0 
                  ? `Selected Location: ${coordinates.lat.toFixed(6)}, ${coordinates.lon.toFixed(6)}`
                  : "Click on the map to select a location for your photo"
                }
              </Typography>
            </Box>
            <MapDisplayForTagger 
              lat={coordinates.lat} 
              lon={coordinates.lon} 
              onLocationSelect={handleLocationSelect} 
            />
          </Paper>
        </Grid>
      </Grid>

      {/* SEO Content */}
      <Box sx={{ mt: 6 }}>
        <GeotagSeoContent />
      </Box>

      {/* Dialog for Manual Coordinate Entry */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            ...getGlassStyles(theme),
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Enter Coordinates Manually
            </Typography>
            <Button
              onClick={handleCloseDialog}
              color="error"
              sx={{ minWidth: "auto" }}
            >
              <Cancel />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ManualCoordinateEntry 
            currentLat={coordinates.lat}
            currentLon={coordinates.lon}
            onCoordinatesChange={handleLocationSelect}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

// Manual Coordinate Entry Component
const ManualCoordinateEntry: React.FC<{
  currentLat: number;
  currentLon: number;
  onCoordinatesChange: (lat: number, lon: number) => void;
  onClose: () => void;
}> = ({ currentLat, currentLon, onCoordinatesChange, onClose }) => {
  const [lat, setLat] = useState(currentLat || 0);
  const [lon, setLon] = useState(currentLon || 0);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90");
      return;
    }
    if (lon < -180 || lon > 180) {
      setError("Longitude must be between -180 and 180");
      return;
    }
    
    onCoordinatesChange(lat, lon);
    onClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Latitude (-90 to 90)
          </Typography>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px"
            }}
            placeholder="Enter latitude (e.g., 40.7128)"
          />
        </Box>
        
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Longitude (-180 to 180)
          </Typography>
          <input
            type="number"
            step="any"
            value={lon}
            onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px"
            }}
            placeholder="Enter longitude (e.g., -74.0060)"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ 
              background: theme.custom.gradients.primary,
              '&:hover': {
                background: theme.custom.gradients.primary,
              }
            }}
          >
            Set Coordinates
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default GeotagPhotosContainer; 