import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Polyline, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SafetyMap.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Shahapur, Maharashtra coordinates
const SHAHAPUR_CENTER: [number, number] = [19.45, 73.33];
const MAP_ZOOM = 15;

// Danger zone configuration
const DANGER_ZONES = [
  {
    id: 'kinhavali-junction',
    position: [19.452, 73.331] as [number, number],
    radius: 300, // meters
    name: 'Kinhavali Junction',
    description: '⚠️ DANGER: Kinhavali Junction. High accident risk.',
    details: 'Heavy traffic intersection with frequent accidents. Use alternative routes during peak hours.',
    color: 'red',
    fillColor: 'red',
    fillOpacity: 0.2,
    weight: 2,
  },
];

// Safe route configuration
const SAFE_ROUTES = [
  {
    id: 'subway-route',
    positions: [
      [19.448, 73.328] as [number, number],
      [19.451, 73.332] as [number, number],
      [19.454, 73.335] as [number, number],
    ],
    name: 'Safe Subway Route',
    description: '✅ SAFE ROUTE: Use Subway.',
    details: 'Well-lit pedestrian subway with CCTV monitoring. Recommended for evening travel.',
    color: 'green',
    weight: 5,
    opacity: 0.8,
  },
];

// Points of interest
const LANDMARKS = [
  {
    id: 'shahapur-center',
    position: [19.45, 73.33] as [number, number],
    name: 'Shahapur Center',
    description: '📍 Shahapur Town Center',
    type: 'center',
  },
];

const SafetyMap: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="safety-map-container">
      <div className="safety-map-header">
        <h3>🗺️ Shahapur Safety Map</h3>
        <p>Navigate safely through Shahapur with real-time danger zones and safe routes</p>
      </div>
      
      <div className="map-wrapper">
        <MapContainer
          center={SHAHAPUR_CENTER}
          zoom={MAP_ZOOM}
          style={{ height: '400px', width: '100%' }}
          className="safety-map"
          whenReady={handleMapLoad}
        >
          {/* Base map tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Landmarks */}
          {LANDMARKS.map((landmark) => (
            <Marker key={landmark.id} position={landmark.position}>
              <Popup>
                <div className="landmark-popup">
                  <strong>{landmark.description}</strong>
                  <br />
                  <small>{landmark.name}</small>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Danger Zones */}
          {DANGER_ZONES.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.position}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.fillColor,
                fillOpacity: zone.fillOpacity,
                weight: zone.weight,
              }}
            >
              <Popup>
                <div className="danger-popup">
                  <strong>{zone.description}</strong>
                  <br />
                  <p style={{ margin: '0.5rem 0', fontSize: '0.8rem' }}>
                    {zone.details}
                  </p>
                  <small>Radius: {zone.radius}m</small>
                </div>
              </Popup>
            </Circle>
          ))}
          
          {/* Safe Routes */}
          {SAFE_ROUTES.map((route) => (
            <Polyline
              key={route.id}
              positions={route.positions}
              pathOptions={{
                color: route.color,
                weight: route.weight,
                opacity: route.opacity,
              }}
            >
              <Popup>
                <div className="safe-route-popup">
                  <strong>{route.description}</strong>
                  <br />
                  <p style={{ margin: '0.5rem 0', fontSize: '0.8rem' }}>
                    {route.details}
                  </p>
                  <small>Recommended safe path</small>
                </div>
              </Popup>
            </Polyline>
          ))}
        </MapContainer>
        
        {!mapLoaded && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <span>Loading map...</span>
          </div>
        )}
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color danger"></div>
          <span>Danger Zones - High Risk Areas</span>
        </div>
        <div className="legend-item">
          <div className="legend-color safe"></div>
          <span>Safe Routes - Recommended Paths</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker"></div>
          <span>Points of Interest</span>
        </div>
      </div>
      
      <div className="map-info">
        <p className="info-text">
          💡 <strong>Tip:</strong> Click on markers and zones for detailed information. 
          Plan your route using the safe paths highlighted in green.
        </p>
      </div>
    </div>
  );
};

export default SafetyMap;