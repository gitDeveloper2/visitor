import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'; // Import fullscreen plugin styles
import 'leaflet-fullscreen'; // Import fullscreen plugin JS

export const initializeMap = (lat: number, lon: number, containerId: string): L.Map => {
  // Initialize the map
  const initializedMap = L.map(containerId, {
    center: [lat, lon],
    zoom: 2, // Good zoom level for continents
    zoomControl: true, // Enable zoom controls
  });

  return initializedMap;
};

export const createLayers = () => {
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
  });

  const terrainLayer = L.tileLayer('https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
    attribution: '&copy; <a href="http://stamen.com">Stamen Design</a>',
  });

  const esriWorldTerrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
  });

  return { osmLayer, satelliteLayer, terrainLayer, esriWorldTerrainLayer };
};

export const createMarker = (lat: number, lon: number) => {
  const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return L.marker([lat, lon], { icon: markerIcon })
    .bindPopup(`<b>Location</b><br>Lat: ${lat}, Lon: ${lon}`);
};

export const addFullscreenControl = (map: L.Map) => {
  map.addControl(new L.Control.Fullscreen());
};

export const addLayerControl = (map: L.Map, layers: any) => {
  const baseMaps = {
    "OpenStreetMap": layers.osmLayer,
    "Satellite": layers.satelliteLayer,
    "Terrain": layers.terrainLayer,
    "ESRI World Terrain": layers.esriWorldTerrainLayer,
  };

  L.control.layers(baseMaps).addTo(map);
};
