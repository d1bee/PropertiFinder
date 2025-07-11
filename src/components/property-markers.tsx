
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

    const ICONS = {
      Rumah: { 
        path: 'M12 3L4 9v12h16V9L12 3z',
        color: '#10B981', 
        scale: 1 
      },
      Apartemen: { 
        path: 'M12 2L2 7v10l10 5 10-5V7L12 2zm8 14.5l-8 4-8-4v-8.5l8-4 8 4v8.5zM10 11h4v6h-4v-6z',
        color: '#3B82F6', 
        scale: 0.8 
      },
      'Tanah Kosong': { 
        path: 'M2 22h20V2H2v20zM14 4h4v4h-4V4zM8 4h4v4H8V4zM14 10h4v4h-4v-4zM8 10h4v4H8v-4zM4 18h16v-2H4v2zm0-4h4v-4H4v4zm0-6h4V4H4v4z',
        color: '#F97316', 
        scale: 0.9 
      },
      Gudang: { 
        path: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 18H6v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4zm0-6H6V8h12v4z',
        color: '#6B7280', 
        scale: 0.9
      },
      Ruko: { 
        path: 'M12 3L2 8v11h20V8L12 3zm6 14h-4v-4h-4v4H6v-6.5l6-4.5 6 4.5V17z',
        color: '#A855F7', 
        scale: 1 
      },
      'Galangan Kapal': { 
        path: 'M12 2L4 6v8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V6l-8-4zM6 14V7.5l6 3.5 6-3.5V14H6z',
        color: '#06B6D4', 
        scale: 1 
      },
      Pabrik: { 
        path: 'M2 22h20V10L12 2 2 10v12zm4-2h3v-7h6v7h3V10l-6-4.5L6 10v10z',
        color: '#4B5563', 
        scale: 1 
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
        anchor: new google.maps.Point(12, 12),
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
