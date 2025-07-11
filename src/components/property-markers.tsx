
'use client';

import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface PropertyMarkersProps {
  properties: Property[];
  onMarkerClick: (propertyId: string) => void;
}

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
        });
        marker.addListener('click', () => onMarkerClick(property.id));
        markers.current[property.id] = marker;
        markersToAdd.push(marker);
      } else {
        // Potentially update marker position if coordinates can change
        markers.current[property.id].setPosition(property.coordinates);
      }
    }

    if (markersToAdd.length > 0) {
      clusterer.current.addMarkers(markersToAdd, true);
    }
    
    clusterer.current.render();
    
    return () => {
      // Cleanup on component unmount is tricky with clusterer
      // as it might be used by a new instance of the component.
      // A more robust solution might involve a global manager for the map instance.
    };
  }, [map, properties, onMarkerClick]);


  return null; // The markers are managed directly on the map instance
}
