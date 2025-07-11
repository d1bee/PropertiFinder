'use client';

import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { PropertyCard } from './property-card';

type PropertyMapProps = {
  properties: Property[];
  apiKey: string;
};

export function PropertyMap({ properties, apiKey }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const center = { lat: -6.2, lng: 106.816666 }; // Jakarta

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={10}
        mapId="PROPERTI_FINDER_MAP"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {properties.map((property) => (
          <AdvancedMarker
            key={property.id}
            position={property.coordinates}
            onClick={() => setSelectedProperty(property)}
          >
            <Pin background={'hsl(var(--primary))'} borderColor={'hsl(var(--card))'} glyphColor={'hsl(var(--card))'} />
          </AdvancedMarker>
        ))}

        {selectedProperty && (
          <InfoWindow
            position={selectedProperty.coordinates}
            onCloseClick={() => setSelectedProperty(null)}
            pixelOffset={[0,-35]}
          >
            <div className="w-80">
                <PropertyCard property={selectedProperty} />
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
