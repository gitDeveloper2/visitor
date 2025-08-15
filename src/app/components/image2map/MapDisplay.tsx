"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import {
  initializeMap,
  createLayers,
  createMarker,
  addFullscreenControl,
  addLayerControl,
} from "../../../utils/maps/mapUtils";
import { Box } from "@mui/material";

interface MapDisplayProps {
  lat: number;
  lon: number;
}

const DEFAULT_ZOOM = 2;

const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lon }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    // Initialize the map on the first render
    const mapInstance = initializeMap(lat, lon, "map");
    setMap(mapInstance);

    // Create and add layers to the map
    const layers = createLayers();
    mapInstance.addLayer(layers.osmLayer); // Default to OpenStreetMap
    addLayerControl(mapInstance, layers); // Add layer controls (if needed)
    addFullscreenControl(mapInstance); // Add fullscreen control

    // Add an initial marker at the default location
    const initialMarker = createMarker(lat, lon);
    initialMarker.addTo(mapInstance);
    setMarker(initialMarker);

    return () => {
      mapInstance.remove();
    };
  }, []); // Run only on the initial render

  useEffect(() => {
    if (map) {
      // Check if lat and lon are not the default coordinates (e.g., 0, 0)
      const isDefaultCoordinates = lat === 0 && lon === 0;

      if (!isDefaultCoordinates) {
        // Update map view and zoom when valid coordinates are provided
        map.setView([lat, lon], 12); // Zoom to a higher level for better detail

        // Update marker position
        if (marker) {
          marker.setLatLng([lat, lon]);
          marker.bindPopup(`<b>Photo Location</b><br>Latitude: ${lat.toFixed(6)}<br>Longitude: ${lon.toFixed(6)}`).openPopup();
        }
      }
    }
  }, [lat, lon, map, marker]); // Run whenever lat, lon, map, or marker changes

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        id="map" 
        style={{ 
          height: "500px", 
          width: "100%",
          borderRadius: "0 0 12px 12px", // Match the paper border radius
        }} 
      />
    </Box>
  );
};

export default MapDisplay;
