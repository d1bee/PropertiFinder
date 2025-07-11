
'use client';

import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface PropertyMarkersProps {
  properties: Property[];
  onMarkerClick: (property: Property) => void;
  selectedPropertyIds: string[];
  hoveredPropertyId?: string | null;
}

const getIcon = (selected: boolean) => {
    if (typeof window === 'undefined' || !window.google) {
        return null; 
    }

    const icon: google.maps.Icon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: '#007BFF',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 1.5,
        scale: selected ? 2.2 : 1.5,
        anchor: new window.google.maps.Point(12, 24),
    };

    return icon;
};

export function PropertyMarkers({
  properties,
  onMarkerClick,
  selectedPropertyIds,
  hoveredPropertyId,
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

    currentMarkers.forEach(markerId => {
      if (!newPropertyIds.includes(markerId)) {
        const marker = markers.current[markerId];
        clusterer.current?.removeMarker(marker, true);
        delete markers.current[markerId];
      }
    });

    const markersToAdd = [];
    for (const property of properties) {
      const isSelected = selectedPropertyIds.includes(property.id);
      const isHovered = property.id === hoveredPropertyId;
      
      const icon = getIcon(isSelected || isHovered);

      if (!icon) continue;

      if (!markers.current[property.id]) {
        const marker = new google.maps.Marker({
          position: property.coordinates,
          title: property.title,
          icon: icon,
        });
        marker.addListener('click', () => onMarkerClick(property));
        markers.current[property.id] = marker;
        markersToAdd.push(marker);
      } else {
        markers.current[property.id].setIcon(icon);
        markers.current[property.id].setPosition(property.coordinates);
      }
    }

    if (markersToAdd.length > 0) {
      clusterer.current.addMarkers(markersToAdd, true);
    }
    
    clusterer.current.render();
    
  }, [map, properties, onMarkerClick, selectedPropertyIds, hoveredPropertyId]);


  return null;
}
