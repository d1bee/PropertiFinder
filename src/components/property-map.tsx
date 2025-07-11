'use client';

import { APIProvider, Map, MapControl, ControlPosition, useMap } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';

type PropertyMapProps = {
  properties: Property[];
  apiKey: string;
  onMarkerClick: (property: Property) => void;
  onMarkerHover: (propertyId: string | null) => void;
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
};

const MapClustering = ({ properties, onMarkerClick, onMarkerHover, selectedPropertyId, hoveredPropertyId }: Omit<PropertyMapProps, 'apiKey'>) => {
  const map = useMap();
  const markersRef = useRef<Record<string, google.maps.Marker>>({});
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({ map });
    }

    const currentMarkers: Marker[] = [];
    const newMarkers: Record<string, google.maps.Marker> = {};

    properties.forEach(property => {
      if (markersRef.current[property.id]) {
        newMarkers[property.id] = markersRef.current[property.id];
        delete markersRef.current[property.id];
      } else {
        const marker = new google.maps.Marker({
          position: property.coordinates,
        });

        marker.addListener('click', () => onMarkerClick(property));
        marker.addListener('mouseover', () => onMarkerHover(property.id));
        marker.addListener('mouseout', () => onMarkerHover(null));
        
        newMarkers[property.id] = marker;
      }
      currentMarkers.push(newMarkers[property.id]);
    });

    Object.values(markersRef.current).forEach(marker => {
      marker.setMap(null); 
    });

    markersRef.current = newMarkers;

    clustererRef.current.clearMarkers();
    clustererRef.current.addMarkers(currentMarkers);

    Object.entries(newMarkers).forEach(([id, marker]) => {
      const isSelected = selectedPropertyId === id;
      const isHovered = hoveredPropertyId === id;
      const icon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected || isHovered ? 8 : 6,
        fillColor: isSelected ? '#F43F5E' : '#3B82F6',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: 'white',
      };
      marker.setIcon(icon);
      marker.setZIndex(isSelected || isHovered ? 10 : 1);
    });

  }, [map, properties, onMarkerClick, onMarkerHover, selectedPropertyId, hoveredPropertyId]);

  useEffect(() => {
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
    };
  }, []);

  return null;
};

export function PropertyMap({ properties, apiKey, onMarkerClick, onMarkerHover, selectedPropertyId, hoveredPropertyId }: PropertyMapProps) {
  const center = { lat: 1.118, lng: 104.048 }; // Batam Center, Batam
  const [mapType, setMapType] = useState<'google' | 'osm'>('google');

  return (
    <div className="w-full h-full">
      {mapType === 'google' ? (
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={center}
            defaultZoom={12}
            mapId="PROPERTI_FINDER_MAP_NEW_3"
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            className="w-full h-full"
            options={{
              styles: [
                { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
                { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
                { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
                { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
                { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
                { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#d4e4f2" }] }
              ]
            }}
          >
            <MapClustering
              properties={properties}
              onMarkerClick={onMarkerClick}
              onMarkerHover={onMarkerHover}
              selectedPropertyId={selectedPropertyId}
              hoveredPropertyId={hoveredPropertyId}
            />
             <MapControl position={ControlPosition.TOP_RIGHT}>
              <div className="m-2 p-2 bg-card rounded-md shadow-md flex items-center space-x-2">
                <Label htmlFor="map-type-switch">OpenStreetMap</Label>
                <Switch
                  id="map-type-switch"
                  checked={mapType === 'osm'}
                  onCheckedChange={(checked) => setMapType(checked ? 'osm' : 'google')}
                />
              </div>
            </MapControl>
          </Map>
        </APIProvider>
      ) : (
        <div className="relative w-full h-full">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=103.5,0.5,104.5,1.5&layer=mapnik"
            className="w-full h-full border-0"
            title="OpenStreetMap"
          ></iframe>
           <div className="absolute top-0 right-0 z-10 m-2 p-2 bg-card rounded-md shadow-md flex items-center space-x-2">
            <Label htmlFor="map-type-switch">OpenStreetMap</Label>
            <Switch
              id="map-type-switch"
              checked={mapType === 'osm'}
              onCheckedChange={(checked) => setMapType(checked ? 'osm' : 'google')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
