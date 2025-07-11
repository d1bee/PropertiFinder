
'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Home, Building } from 'lucide-react';

interface PropertyMarkersProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
  onMarkerClick: (propertyId: string) => void;
  onMarkerHover: (propertyId: string | null) => void;
}

export function PropertyMarkers({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onMarkerClick,
  onMarkerHover,
}: PropertyMarkersProps) {
  
  const handleMarkerClick = (propertyId: string) => {
    onMarkerClick(propertyId);
  };

  const getIcon = (type: Property['type']) => {
    switch (type) {
      case 'Rumah':
      case 'Apartemen':
      case 'Ruko':
        return <Home className="h-4 w-4 text-white" />;
      default:
        return <Building className="h-4 w-4 text-white" />;
    }
  };

  return (
    <>
      {properties.map((property) => (
        <AdvancedMarker
          key={property.id}
          position={property.coordinates}
          onClick={() => handleMarkerClick(property.id)}
          onPointerEnter={() => onMarkerHover(property.id)}
          onPointerLeave={() => onMarkerHover(null)}
          title={property.title}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer',
              (property.id === selectedPropertyId || property.id === hoveredPropertyId)
                ? 'bg-primary scale-110'
                : 'bg-primary/70'
            )}
          >
            {getIcon(property.type)}
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
}

    