
'use client';

import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface PropertyMarkersProps {
  properties: Property[];
  onMarkerClick: (propertyId: string) => void;
}

const getIcon = (type: Property['type']): google.maps.Icon => {
    if (typeof window === 'undefined' || !window.google) {
        return {}; 
    }

    // Using SVG paths for custom icons
    const ICONS = {
      Rumah: { 
        path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z', // A simple house shape
        color: '#10B981', 
        scale: 0.8 
      },
      Apartemen: { 
        path: 'M12 2L2 7v10l10 5 10-5V7L12 2zm8 14.5l-8 4-8-4v-8.5l8-4 8 4v8.5zM10 11h4v6h-4v-6z', // Building
        color: '#3B82F6', 
        scale: 0.8 
      },
      'Tanah Kosong': { 
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z', // Placeholder for land (leaf/plant)
        path2: 'M12 2L4 5v14h16V5l-8-3zM6 7h12v10H6V7z',
        path3: 'M14.6,3.4C14.2,3.1,13.7,3,13.2,3H4C3.4,3,3,3.4,3,4v16c0,0.6,0.4,1,1,1h16c0.6,0,1-0.4,1-1V9.8c0-0.5-0.1-1-0.4-1.4L14.6,3.4z M19,19H5V5h7v5h5V19z',
        path: 'M2,22h20V2H2V22z M13,4h6v6h-6V4z M13,12h6v6h-6V12z M4,4h7v16H4V4z',
        color: '#F97316', 
        scale: 0.8 
      },
      Gudang: { 
        path: 'M20 6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 12H6v-4h12v4zm0-6H6V9h12v3z', // Warehouse
        color: '#6B7280', 
        scale: 0.8 
      },
      Ruko: { 
        path: 'M12 3L2 8v11h20V8L12 3zm6 14h-4v-4h-4v4H6v-6.5l6-4.5 6 4.5V17z', // Shophouse
        color: '#A855F7', 
        scale: 0.8 
      },
      'Galangan Kapal': { 
        path: 'M21 6h-2v9H5v-9H3c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z', // Shipyard/Anchor
        color: '#06B6D4', 
        scale: 0.8 
      },
      Pabrik: { 
        path: 'M2 22h20V10L12 2 2 10v12zm4-2h3v-7h6v7h3V10l-6-4.5L6 10v10z', // Factory
        color: '#4B5563', 
        scale: 0.8 
      },
    };

    const iconConfig = ICONS[type] || { path: google.maps.SymbolPath.CIRCLE, color: '#EF4444', scale: 8 };

    return {
        path: iconConfig.path,
        fillColor: iconConfig.color,
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 1.5,
        scale: iconConfig.scale,
        anchor: new google.maps.Point(12, 12), // Center the icon
        rotation: 0
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
