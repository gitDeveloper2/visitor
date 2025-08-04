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
} from "@mui/material";
import Pic2mapSeoContent from "../../(tools)/pic2map/pic2mapSeoContent";
import dynamic from "next/dynamic";
import { Exif } from "../../../types/ExifData";
import ImageMetadataEditor from "./ImageMetadataEditor";
import { Cancel } from "@mui/icons-material";

const MapDisplay = dynamic(() => import("./MapDisplay"), { ssr: false });

export const DEFAULT_COORDINATES = { lat: 0, lon: 0 };

const MapContainer: React.FC = () => {
 
  const [metadata, setMetadata] = useState<Exif | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

  const lat = metadata?.gps.latitude ?? DEFAULT_COORDINATES.lat;
  const lon = metadata?.gps.longitude ?? DEFAULT_COORDINATES.lon;

  const handleOpenDialog = useCallback(() => setIsDialogOpen(true),[]);
  const handleCloseDialog = useCallback(() => setIsDialogOpen(false),[]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
        }}
      >
        {/* Left Sidebar */}
        <Box
          sx={{
            flex: { xs: "0 1 auto", md: "0 0 15%" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Button to open dialog */}
          <Button variant="outlined" color="secondary" onClick={handleOpenDialog}>
            Click here to edit photo gps (Metadata)
          </Button>

          <UploadForm setMetadata={setMetadata} />

          {metadata?.meta.hasExif && (lat!==0||lon!==0)&& (
            <Paper elevation={3} sx={{ p: 2 }}>
              
              <LocationInfo lat={lat} lon={lon} />
            </Paper>
          )}
        </Box>

        {/* Map Section */}
        <Box sx={{ flex: { xs: "0 1 auto", md: "1" } }}>
          <Paper elevation={3} sx={{ height: "100%" }}>
            <MapDisplay lat={lat} lon={lon} />
          </Paper>
        </Box>
      </Box>

      {/* Metadata Section */}
      <Box sx={{ mt: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {metadata?.meta.hasExif ? (
            <ImageMetadata metadata={metadata} />
          ) : (
            <Typography variant="body1" align="center">
              No gps metadata available. Please upload an image to see details.
            </Typography>
          )}
        </Paper>
      </Box>

      <Pic2mapSeoContent />

      {/* Dialog for Metadata Editor */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Edit Metadata  <Button
      onClick={handleCloseDialog}
      color="error"
      sx={{ position: 'absolute', right: 8, top: 8 }}
    ><Cancel />
    </Button></DialogTitle>
        <DialogContent>
          <ImageMetadataEditor />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MapContainer;
