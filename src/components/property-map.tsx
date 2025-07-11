'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export function PropertyMap() {
  const [mapType, setMapType] = useState<'google' | 'osm'>('osm');

  return (
    <div className="w-full h-full">
      {mapType === 'google' ? (
         <div className="w-full h-full flex items-center justify-center bg-muted">
             <div className="relative w-full h-full">
                <div className="absolute top-0 right-0 z-10 m-2 p-2 bg-card rounded-md shadow-md flex items-center space-x-2">
                    <Label htmlFor="map-type-switch">OpenStreetMap</Label>
                    <Switch
                    id="map-type-switch"
                    checked={mapType === 'osm'}
                    onCheckedChange={(checked) => setMapType(checked ? 'osm' : 'google')}
                    />
                </div>
                <p className="text-center text-destructive p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    Google Maps API key is missing.
                    Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables to enable Google Maps.
                </p>
            </div>
        </div>
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
