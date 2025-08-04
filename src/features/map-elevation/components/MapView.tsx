'use client';

import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Pin } from '../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
});

const defaultCenter: [number, number] = [48.8566, 2.3522]; // Paris
const defaultZoom = 13;

interface MapViewProps {
  pins: Pin[];
  onMapClick: (pin: { lat: number; lng: number }) => void;
  flyTo?: { lat: number; lng: number } | null;
}

function FlyToPin({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 1.5 });
  }, [lat, lng, map]);

  return null;
}

function LocationMarker({ onMapClick }: { onMapClick: (pin: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick({ lat, lng });
    },
  });
  return null;
}

export default function MapView({ pins, onMapClick, flyTo }: MapViewProps) {
  const elevatedPins = pins; // Already elevated

  return (
    <Box
   
    display="flex"
    flexDirection={{ xs: 'column', md: 'row' }} // Stack on mobile, side-by-side on desktop
    gap={2}
    sx={{ width: '100%' }}
  >
  
  <Box
     sx={{
      height: { xs: 300, md: 700 },
      flex: 1,
      borderRadius: 2,
      overflow: 'hidden',
    }}
  >
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '400px', width: '100%' }} // ← This is the key change

        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onMapClick={onMapClick} />
          {flyTo && <FlyToPin lat={flyTo.lat} lng={flyTo.lng} />}
          <MarkerClusterGroup chunkedLoading>
  {elevatedPins.map((pin, index) => (
  <Marker key={index} position={[pin.lat, pin.lng]}>
  <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
    <div>
      <strong>{pin.locationName || 'Unknown location'}</strong>
      <br />
      Lat: {pin.lat.toFixed(5)}, Lng: {pin.lng.toFixed(5)}
      <br />
      {pin.loading ? (
        'Loading elevation...'
      ) : pin.error ? (
        <span style={{ color: 'red' }}>Error: {pin.error}</span>
      ) : (
        `Elevation: ${pin.elevation} m`
      )}
    </div>
  </Tooltip>
</Marker>

  ))}
</MarkerClusterGroup>
        </MapContainer>
      </Box>

      {/* Sidebar */}
      <Paper  variant="outlined"
    sx={{
      width: { xs: '100%', md: 300 },
      maxHeight: { xs: 'none', md: 400 },
      overflowY: 'auto',
      p: 2,
    }}>
        <Typography variant="h6" gutterBottom>
          Pin Details
        </Typography>
        {elevatedPins.map((pin, index) => (
  <Box key={index} mb={2}>
    <Typography variant="body2">
      {pin.locationName && (
        <>
          <strong>Location:</strong> {pin.locationName}
          <br />
        </>
      )}
      <strong>Lat:</strong> {pin.lat.toFixed(5)} <br />
      <strong>Lng:</strong> {pin.lng.toFixed(5)} <br />
      {pin.loading ? (
        <CircularProgress size={16} />
      ) : pin.error ? (
        <span style={{ color: 'red' }}>Error: {pin.error}</span>
      ) : (
        <span>
          <strong>Elevation:</strong> {pin.elevation?.toFixed(2)} m
        </span>
      )}
    </Typography>
  </Box>
))}

      </Paper>
    </Box>
  );
}
