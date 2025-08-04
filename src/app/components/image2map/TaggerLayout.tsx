"use client";

import React, { useState } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";
import ImageMetadataEditor from "./GeoTagPhotos";
import GeotagSeoContent from "../../(tools)/geotagphotos/getotagSeoContent";
import dynamic from "next/dynamic";
const MapDisplay = dynamic(() => import("./MapDisplayForTagger"), { ssr: false });
export const GeotagLayout: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });

  const handleLocationSelect = (lat: number, lon: number) => {
    setCoordinates({ lat, lon });
    

  };

  return (
    <Container maxWidth="lg">
       <Typography variant="h4" component={'h1'} gutterBottom>
        Free Geotag Photos Online 
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
        }}
      >
        {/* Left Section */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ height: "100%", p: 3 }}>
            <ImageMetadataEditor lat={coordinates.lat} lon={coordinates.lon} />
          </Paper>
        </Box>

        {/* Right Section */}
        <Box sx={{ flex: 1 }}>
          <MapDisplay lat={coordinates.lat} lon={coordinates.lon} onLocationSelect={handleLocationSelect} />
        </Box>
      </Box>
      <GeotagSeoContent/>
    </Container>
  );
};

export default GeotagLayout;
