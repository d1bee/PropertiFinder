
'use client';

import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface PropertyMarkersProps {
  properties: Property[];
  onMarkerClick: (propertyId: string) => void;
}

const ICONS = {
  Rumah: { path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z', color: '#10B981' }, // Home icon-like, green
  Apartemen: { path: 'M12 2L2 7v10h20V7L12 2zm8 16H4V8.5l8-4 8 4V18z', color: '#3B82F6' }, // Building icon-like, blue
  'Tanah Kosong': { path: 'M3 3h18v18H3z', color: '#F97316' }, // Square for land, orange
  Gudang: { path: 'M20 9V5H4v4H2v11h20V9h-2zm-4-2h2v2h-2V7zM6 7h2v2H6V7z', color: '#6B7280' }, // Warehouse-like, gray
  Ruko: { path: 'M12 3L2 8v11h20V8L12 3zm7 15h-3v-5H8v5H5V9l7-4 7 4v9z', color: '#A855F7' }, // Storefront-like, purple
  'Galangan Kapal': { path: 'M20.5 10H19V6.4a2 2 0 00-2-2h-3.4a2 2 0 00-1.6.8L9 9H5a2 2 0 00-2 2v4h1.5a2.5 2.5 0 010 5H3v-4H1v-4a2 2 0 012-2h4l3-4h3a4 4 0 014 4v4h1.5a2.5 2.5 0 010 5H22v-4a2 2 0 00-1.5-2z', color: '#06B6D4' }, // Ship-like, cyan
  Pabrik: { path: 'M2 22h20V12l-5-4-3 3-4-4-3 3-5-4v14zm4-9h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z', color: '#4B5563' }, // Factory-like, dark gray
};

const getIcon = (type: Property['type']): google.maps.Icon => {
  const iconConfig = ICONS[type] || { path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', color: '#EF4444' }; // Default pin, red
  return {
    path: iconConfig.path,
    fillColor: iconConfig.color,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    rotation: 0,
    scale: 1.1,
    anchor: new google.maps.Point(12, 12),
  };
};

export function PropertyMarkers({
  properties,
  onMarkerClick,
}: PropertyMarkersProps) {
  const map = useMap();
  const markers = useRef<Record<string, google.maps.Marker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }

    const currentMarkers = Object.keys(markers.current);
    const newPropertyIds = properties.map(p => p.id);

    // Remove markers that are no longer in the properties list
    currentMarkers.forEach(markerId => {
      if (!newPropertyIds.includes(markerId)) {
        const marker = markers.current[markerId];
        clusterer.current?.removeMarker(marker, true);
        delete markers.current[markerId];
      }
    });

    const markersToAdd = [];
    // Add new markers or update existing ones
    for (const property of properties) {
      if (!markers.current[property.id]) {
        const marker = new google.maps.Marker({
          position: property.coordinates,
          title: property.title,
          icon: getIcon(property.type),
        });
        marker.addListener('click', () => onMarkerClick(property.id));
        markers.current[property.id] = marker;
        markersToAdd.push(marker);
      } else {
        // Potentially update marker position if coordinates can change
        markers.current[property.id].setPosition(property.coordinates);
        markers.current[property.id].setIcon(getIcon(property.type));
      }
    }

    if (markersToAdd.length > 0) {
      clusterer.current.addMarkers(markersToAdd, true);
    }
    
    clusterer.current.render();
    
  }, [map, properties, onMarkerClick]);


  return null; // The markers are managed directly on the map instance
}
