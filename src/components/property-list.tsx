'use client';

import type { Property } from '@/lib/data';
import { PropertyCard } from './property-card';
import { ScrollArea } from './ui/scroll-area';

interface PropertyListProps {
  properties: Property[];
  onCardClick: (property: Property) => void;
  onCardHover: (propertyId: string | null) => void;
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
}

export function PropertyList({ properties, onCardClick, onCardHover, selectedPropertyId, hoveredPropertyId }: PropertyListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            selected={property.id === selectedPropertyId || property.id === hoveredPropertyId}
            onMouseEnter={() => onCardHover(property.id)}
            onMouseLeave={() => onCardHover(null)}
            onClick={() => onCardClick(property)}
          />
        ))}
        {properties.length === 0 && (
            <div className="text-center p-10 text-muted-foreground">
                <p>Tidak ada properti yang cocok dengan kriteria Anda.</p>
            </div>
        )}
      </div>
    </ScrollArea>
  );
}
