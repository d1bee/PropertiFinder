
'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { cn } from '@/lib/utils';

type PropertyMapProps = {
  properties: Property[];
  apiKey: string;
  onMarkerClick: (property: Property) => void;
  selectedPropertyId?: string | null;
};

export function PropertyMap({ properties, apiKey, onMarkerClick, selectedPropertyId }: PropertyMapProps) {
  const center = { lat: 1.118, lng: 104.048 }; // Batam Center, Batam

  return (
    <div className="w-full h-full">
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
                        {
                            "featureType": "poi",
                            "stylers": [
                                { "visibility": "off" }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "stylers": [
                                { "visibility": "off" }
                            ]
                        },
                         {
                            "featureType": "road",
                            "elementType": "labels.icon",
                            "stylers": [
                                { "visibility": "off" }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [
                                { "color": "#ffffff" }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                { "color": "#f5f5f5" }
                            ]
                        },
                         {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                { "color": "#d4e4f2" }
                            ]
                        }
                    ]
                }}
            >
                {properties.map((property) => (
                    <AdvancedMarker
                        key={property.id}
                        position={property.coordinates}
                        onClick={() => onMarkerClick(property)}
                        aria-label={`Map marker for ${property.title}`}
                    >
                        <div className={cn(
                            "w-4 h-4 rounded-full border-2 border-white shadow-md",
                            selectedPropertyId === property.id ? "bg-pink-500 scale-125" : "bg-blue-500",
                            "transition-all"
                        )}/>
                    </AdvancedMarker>
                ))}
            </Map>
        </APIProvider>
    </div>
  );
}

