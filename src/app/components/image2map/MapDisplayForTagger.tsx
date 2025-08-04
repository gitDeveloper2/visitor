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
  onLocationSelect: (lat: number, lon: number) => void;
}

const DEFAULT_ZOOM = 2;

const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lon, onLocationSelect }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    const mapInstance = initializeMap(lat, lon, "map");
    setMap(mapInstance);

    const layers = createLayers();
    mapInstance.addLayer(layers.osmLayer);
    addLayerControl(mapInstance, layers);
    addFullscreenControl(mapInstance);

    const initialMarker = createMarker(lat, lon);
    initialMarker.addTo(mapInstance);
    setMarker(initialMarker);

    return () => {
      mapInstance.remove();
    };
  }, []); // Run only on mount

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      onLocationSelect(lat, lng);

      // Update or create the marker
      if (marker) {
        marker.setLatLng([lat, lng]).bindPopup(`<b>Location</b><br>Lat: ${lat}, Lon: ${lng}`).openPopup();
      } else {
        const newMarker = createMarker(lat, lng).addTo(map);
        setMarker(newMarker);
      }
    };

    map.on("click", handleMapClick);
    
    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, marker, onLocationSelect]); // Re-run when map, marker, or onLocationSelect changes

  useEffect(() => {
    if (!map || !marker) return;
    if (lat === 0 && lon === 0) return; // Ignore default coordinates

    map.setView([lat, lon], 4);
    marker.setLatLng([lat, lon]).bindPopup(`<b>Location</b><br>Lat: ${lat}, Lon: ${lon}`).openPopup();
  }, [lat, lon, map, marker]);

  return <div id="map" style={{ height: "400px", width: "100%" }} />;
};

export default MapDisplay;
