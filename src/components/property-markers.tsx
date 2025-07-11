
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
    Rumah: { path: google.maps.SymbolPath.CIRCLE, color: '#10B981', scale: 8 },
    Apartemen: { path: google.maps.SymbolPath.CIRCLE, color: '#3B82F6', scale: 8 },
    'Tanah Kosong': { path: google.maps.SymbolPath.CIRCLE, color: '#F97316', scale: 8 },
    Gudang: { path: google.maps.SymbolPath.CIRCLE, color: '#6B7280', scale: 8 },
    Ruko: { path: google.maps.SymbolPath.CIRCLE, color: '#A855F7', scale: 8 },
    'Galangan Kapal': { path: google.maps.SymbolPath.CIRCLE, color: '#06B6D4', scale: 8 },
    Pabrik: { path: google.maps.SymbolPath.CIRCLE, color: '#4B5563', scale: 8 },
};

const getIcon = (type: Property['type']): google.maps.Icon => {
    const iconConfig = ICONS[type] || { path: google.maps.SymbolPath.CIRCLE, color: '#EF4444', scale: 8 };
    return {
        path: iconConfig.path,
        fillColor: iconConfig.color,
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 1.5,
        scale: iconConfig.scale,
        anchor: new google.maps.Point(0, 0),
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
