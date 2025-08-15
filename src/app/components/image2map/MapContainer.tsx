"use client";

import React, { useCallback, useState } from "react";
import UploadForm from "./UploadForm";
import ImageMetadata from "./ImageMetadata";
import LocationInfo from "./LocationInfo";
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
} from "@mui/material";
import Pic2mapSeoContent from "../../(tools)/pic2map/pic2mapSeoContent";
import dynamic from "next/dynamic";
import { Exif } from "../../../types/ExifData";
import ImageMetadataEditor from "./ImageMetadataEditor";
import { Cancel, LocationOn, PhotoCamera, Map } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { getGlassStyles, getShadow } from "../../../utils/themeUtils";

const MapDisplay = dynamic(() => import("./MapDisplay"), { ssr: false });

export const DEFAULT_COORDINATES = { lat: 0, lon: 0 };

const MapContainer: React.FC = () => {
  const theme = useTheme();
  const [metadata, setMetadata] = useState<Exif | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const lat = metadata?.gps.latitude ?? DEFAULT_COORDINATES.lat;
  const lon = metadata?.gps.longitude ?? DEFAULT_COORDINATES.lon;

  const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setIsDialogOpen(false), []);

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
          Pic2Map - Extract GPS from Photos
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
        >
          Upload your photos and discover where they were taken. Our tool extracts EXIF metadata 
          and displays the exact location on an interactive map.
        </Typography>
        
        {/* Feature Chips */}
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
          <Chip 
            icon={<PhotoCamera />} 
            label="EXIF Extraction" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<LocationOn />} 
            label="GPS Coordinates" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<Map />} 
            label="Interactive Map" 
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
              <UploadForm setMetadata={setMetadata} />
            </Paper>

            {/* Edit GPS Button */}
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
                Edit Photo GPS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add or modify GPS coordinates in your photos
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={handleOpenDialog}
                sx={{ 
                  background: theme.custom.gradients.primary,
                  '&:hover': {
                    background: theme.custom.gradients.primary,
                    boxShadow: getShadow(theme, "neon"),
                  }
                }}
              >
                Edit Metadata
              </Button>
            </Paper>

            {/* Location Info */}
            {metadata?.meta.hasExif && (lat !== 0 || lon !== 0) && (
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  ...getGlassStyles(theme),
                  boxShadow: getShadow(theme, "elegant"),
                }}
              >
                <LocationInfo lat={lat} lon={lon} />
              </Paper>
            )}
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
              minHeight: 500,
            }}
          >
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Interactive Map
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lat !== 0 && lon !== 0 
                  ? `Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}`
                  : "Upload a photo to see the location on the map"
                }
              </Typography>
            </Box>
            <MapDisplay lat={lat} lon={lon} />
          </Paper>
        </Grid>
      </Grid>

      {/* Metadata Section */}
      <Box sx={{ mt: 6 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            ...getGlassStyles(theme),
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Photo Metadata
          </Typography>
          {metadata?.meta.hasExif ? (
            <ImageMetadata metadata={metadata} />
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <PhotoCamera sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No GPS Metadata Available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload an image to see detailed EXIF metadata and GPS information.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* SEO Content */}
      <Box sx={{ mt: 6 }}>
        <Pic2mapSeoContent />
      </Box>

      {/* Dialog for Metadata Editor */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
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
              Edit Photo GPS Metadata
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
          <ImageMetadataEditor />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MapContainer;
