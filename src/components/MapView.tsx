



import React, { useEffect, useState, useRef } from 'react';
import { Crosshair, Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import type { Property } from '../contexts/PropertyContext';

// Fix default marker icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  followUserLocation?: boolean;
  userLocationZoom?: number;
  showPropertyLabels?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  center = { lat: 9.8965, lng: 8.8583 },
  zoom = 12,
  height = '400px',
  followUserLocation = false,
  userLocationZoom = 15,
  showPropertyLabels = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const geoWatchIdRef = useRef<number | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Create map instance
    mapInstance.current = L.map(mapRef.current, {
      zoomControl: false
    }).setView([center.lat, center.lng], zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Add zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(mapInstance.current);

    // Get user location
    if (navigator.geolocation) {
      geoWatchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10_000,
          timeout: 20_000
        }
      );
    }

    return () => {
      if (geoWatchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
        geoWatchIdRef.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Follow user location if requested (without overriding a selected property)
  useEffect(() => {
    if (!mapInstance.current) return;
    if (!followUserLocation) return;
    if (!userLocation) return;
    if (selectedProperty) return;

    mapInstance.current.flyTo([userLocation.lat, userLocation.lng], Math.max(userLocationZoom, zoom));
  }, [followUserLocation, selectedProperty, userLocation, userLocationZoom, zoom]);

  // Update markers when properties or location changes
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add property markers
    properties.forEach(property => {
      const marker = L.marker(
        [property.location.coordinates.lat, property.location.coordinates.lng],
        { icon: defaultIcon }
      ).addTo(mapInstance.current!);

      if (showPropertyLabels) {
        marker.bindTooltip(property.title, {
          permanent: true,
          direction: 'top',
          offset: [0, -36],
          className: 'property-label-tooltip',
          opacity: 1
        });
      }

      const popupContent = `
        <div style="width: 250px;">
          <div style="display: flex; gap: 12px; margin-bottom: 8px;">
            <img src="${property.images[0] || 'https://via.placeholder.com/64'}" 
                 alt="${property.title}" 
                 style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px;" />
            <div style="flex: 1; min-width: 0;">
              <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${property.title}
              </h4>
              <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">${property.location.city}</p>
              <p style="margin: 4px 0; font-size: 11px; font-weight: 600; color: ${
                property.availabilityStatus === 'available'
                  ? '#047857'
                  : property.availabilityStatus === 'sold'
                  ? '#b91c1c'
                  : '#92400e'
              };">
                ${property.availabilityStatus === 'available'
                  ? 'Available'
                  : property.availabilityStatus === 'sold'
                  ? 'Sold'
                  : 'Taken'}
              </p>
              <p style="margin: 4px 0; font-size: 14px; font-weight: 700; color: #059669;">
                $${property.price.usd.toLocaleString()}
              </p>
              ${userLocation ? `
              <p style="margin: 4px 0; font-size: 12px; color: #9ca3af;">
                ${calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  property.location.coordinates.lat,
                  property.location.coordinates.lng
                ).toFixed(1)} km away
              </p>` : ''}
            </div>
          </div>
          <button onclick="window.dispatchEvent(new CustomEvent('getDirections', { detail: '${property.id}' }))" 
                  style="width: 100%; background: #0F2747; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
            🧭 Get Directions
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        onPropertySelect?.(property);
      });

      markersRef.current.push(marker);
    });

    // Add user location marker if available
    if (userLocation) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.8,
        radius: 8,
        weight: 2
      }).addTo(mapInstance.current);

      userMarker.bindPopup('You are here');
      userMarkerRef.current = userMarker;
    }

    // Center on selected property
    if (selectedProperty) {
      mapInstance.current.flyTo([
        selectedProperty.location.coordinates.lat,
        selectedProperty.location.coordinates.lng
      ], zoom);
    }
  }, [properties, userLocation, selectedProperty, zoom, showPropertyLabels, onPropertySelect]);

  // Handle get directions from popup
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const property = properties.find(p => p.id === e.detail);
      if (!property || !mapInstance.current) return;

      if (userLocation) {
        const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${property.location.coordinates.lat},${property.location.coordinates.lng}`;
        window.open(url, '_blank');
      } else {
        const url = `https://www.google.com/maps/search/${property.location.address}`;
        window.open(url, '_blank');
      }
    };

    window.addEventListener('getDirections', handler as EventListener);
    return () => window.removeEventListener('getDirections', handler as EventListener);
  }, [properties, userLocation]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 300);
  };

  const locateMe = () => {
    if (!mapInstance.current) return;

    if (userLocation) {
      mapInstance.current.flyTo([userLocation.lat, userLocation.lng], Math.max(userLocationZoom, zoom));
      return;
    }

    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(next);
        mapInstance.current?.flyTo([next.lat, next.lng], Math.max(userLocationZoom, zoom));
      },
      (error) => {
        console.log('Location access denied:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 20_000
      }
    );
  };

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} 
         style={{ height: isFullscreen ? '100vh' : height }}>
      <style>{`
        .leaflet-tooltip.property-label-tooltip {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(17, 24, 39, 0.12);
          color: #111827;
          border-radius: 9999px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.1;
          box-shadow: 0 8px 20px rgba(0,0,0,0.10);
          white-space: nowrap;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .leaflet-tooltip.property-label-tooltip:before {
          border-top-color: rgba(255, 255, 255, 0.98);
        }
      `}</style>
      
      {/* Map container */}
      <div 
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0,
          position: 'relative'
        }}
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={locateMe}
          className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
          title="Center on my location"
        >
          <Crosshair className="h-4 w-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
        <h4 className="text-sm font-semibold text-ink mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-navy rounded-full mr-2"></div>
            <span>For Sale</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
            <span>For Rent</span>
          </div>
          {userLocation && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Close fullscreen button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors z-10"
        >
          <span className="text-sm">Close</span>
        </button>
      )}
    </div>
  );
};

export default MapView;