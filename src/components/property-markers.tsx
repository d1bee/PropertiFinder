
'use client';

import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface PropertyMarkersProps {
  properties: Property[];
  onMarkerClick: (propertyId: string) => void;
}

const getIcon = (): google.maps.Icon => {
    if (typeof window === 'undefined' || !window.google) {
        return {}; 
    }

    // Using a standard map pin shape for a clean look
    const MAP_PIN_PATH = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

    return {
        path: MAP_PIN_PATH,
        fillColor: '#3B82F6', // A nice blue color
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 1.5,
        scale: 1.5,
        anchor: new google.maps.Point(12, 24),
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
          icon: getIcon(),
        });
        marker.addListener('click', () => onMarkerClick(property.id));
        markers.current[property.id] = marker;
        markersToAdd.push(marker);
      } else {
        // Potentially update marker position if coordinates can change
        markers.current[property.id].setPosition(property.coordinates);
        markers.current[property.id].setIcon(getIcon());
      }
    }

    if (markersToAdd.length > 0) {
      clusterer.current.addMarkers(markersToAdd, true);
    }
    
    clusterer.current.render();
    
  }, [map, properties, onMarkerClick]);


  return null; // The markers are managed directly on the map instance
}
