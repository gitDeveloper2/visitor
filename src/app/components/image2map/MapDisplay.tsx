"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import {
  initializeMap,
  createLayers,
  createMarker,
  addFullscreenControl,
  addLayerControl,
} from "../../../utils/maps/mapUtils"; // Import the utils functions

interface MapDisplayProps {
  lat: number;
  lon: number;
}

const DEFAULT_ZOOM = 2;

const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lon }) => {
  // console.log("rerendered amap")
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
        map.setView([lat, lon], 4); // Zoom to a higher level (e.g., 12)

        // Update marker position
        if (marker) {
          marker.setLatLng([lat, lon]);
          marker.bindPopup(`<b>Location</b><br>Lat: ${lat}, Lon: ${lon}`).openPopup();
        }
      }
    }
  }, [lat, lon, map, marker]); // Run whenever lat, lon, map, or marker changes

  return (
    <div>
      <div id="map" style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default MapDisplay;
