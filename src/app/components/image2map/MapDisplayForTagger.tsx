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

    // Add click instructions
    const instructions = L.control({ position: 'topright' });
    instructions.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <div style="background: white; padding: 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 12px; color: #333;">
          <strong>Click on map to select location</strong>
        </div>
      `;
      return div;
    };
    instructions.addTo(mapInstance);

    const initialMarker = createMarker(lat, lon);
    if (lat !== 0 && lon !== 0) {
      initialMarker.addTo(mapInstance);
      setMarker(initialMarker);
    }

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
        marker.setLatLng([lat, lng]);
        marker.bindPopup(createPopupContent(lat, lng)).openPopup();
      } else {
        const newMarker = createMarker(lat, lng);
        newMarker.bindPopup(createPopupContent(lat, lng)).openPopup();
        newMarker.addTo(map);
        setMarker(newMarker);
      }

      // Add a temporary visual feedback
      const tempCircle = L.circle([lat, lng], {
        color: '#1976d2',
        fillColor: '#1976d2',
        fillOpacity: 0.3,
        radius: 100
      }).addTo(map);
      
      setTimeout(() => {
        map.removeLayer(tempCircle);
      }, 1000);
    };

    map.on("click", handleMapClick);
    
    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, marker, onLocationSelect]);

  useEffect(() => {
    if (!map || !marker) return;
    if (lat === 0 && lon === 0) return; // Ignore default coordinates

    map.setView([lat, lon], 8); // Zoom in closer for better precision
    marker.setLatLng([lat, lon]).bindPopup(createPopupContent(lat, lon)).openPopup();
  }, [lat, lon, map, marker]);

  const createPopupContent = (lat: number, lon: number) => {
    return `
      <div style="text-align: center; min-width: 150px;">
        <div style="font-weight: bold; margin-bottom: 8px; color: #1976d2;">
          📍 Selected Location
        </div>
        <div style="font-family: monospace; font-size: 12px; margin-bottom: 8px;">
          <div>Lat: ${lat.toFixed(6)}</div>
          <div>Lon: ${lon.toFixed(6)}</div>
        </div>
        <div style="font-size: 11px; color: #666;">
          Click elsewhere to change location
        </div>
      </div>
    `;
  };

  return (
    <div 
      id="map" 
      style={{ 
        height: "500px", 
        width: "100%",
        borderRadius: "0 0 12px 12px"
      }} 
    />
  );
};

export default MapDisplay;
