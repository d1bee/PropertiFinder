
'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { PropertyMarkers } from './property-markers';
import type { Property } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Check, Hand } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  apiKey?: string;
  onMarkerClick: (property: Property) => void;
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  selectedPropertyIds: string[];
  hoveredPropertyId?: string | null;
  className?: string;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
}

export function PropertyMap({
  properties,
  apiKey,
  onMarkerClick,
  onMapClick,
  selectedPropertyIds,
  hoveredPropertyId,
  className,
  isSelectionMode,
  onToggleSelectionMode,
}: PropertyMapProps) {
  const defaultCenter = { lat: 1.118, lng: 104.048 };

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-center text-destructive p-4">
          Google Maps API key is missing.
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables to enable Google Maps.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full relative", className)}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={11}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="e8c2865d3c829e0"
          onClick={onMapClick}
        >
          <PropertyMarkers
            properties={properties}
            onMarkerClick={onMarkerClick}
            selectedPropertyIds={selectedPropertyIds}
            hoveredPropertyId={hoveredPropertyId}
          />
        </Map>
      </APIProvider>
      <div className="absolute top-4 right-4 z-10">
        <Button onClick={onToggleSelectionMode} variant={isSelectionMode ? "secondary" : "outline"} className="rounded-full shadow-lg bg-background/90">
           {isSelectionMode ? <Check className="mr-2 h-4 w-4" /> : <Hand className="mr-2 h-4 w-4" />}
           {isSelectionMode ? 'Selesai Memilih' : 'Pilih Properti'}
        </Button>
      </div>
    </div>
  );
}
