'use client';

import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';

type PropertyMapProps = {
  properties: Property[];
  apiKey: string;
  onMarkerClick: (property: Property) => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(price / 16000); // Approximate conversion
};

export function PropertyMap({ properties, apiKey, onMarkerClick }: PropertyMapProps) {
  const [infoWindow, setInfoWindow] = useState<{ property: Property } | null>(null);

  const center = { lat: 40.7128, lng: -74.0060 }; // New York

  const handleMarkerClick = (property: Property) => {
    setInfoWindow({ property });
    onMarkerClick(property);
  };
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={center}
                defaultZoom={12}
                mapId="PROPERTI_FINDER_MAP_NEW"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                className="w-full h-full"
            >
                {properties.map((property) => (
                <AdvancedMarker
                    key={property.id}
                    position={property.coordinates}
                    onClick={() => handleMarkerClick(property)}
                >
                    <div className="px-2 py-1 bg-card text-card-foreground rounded-full shadow-md text-sm font-semibold border hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {formatPrice(property.price)}
                    </div>
                </AdvancedMarker>
                ))}
            </Map>
        </APIProvider>
    </div>
  );
}
