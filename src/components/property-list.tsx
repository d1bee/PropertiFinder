
'use client';

import type { Property } from '@/lib/data';
import { PropertyCard } from './property-card';
import { ScrollArea } from './ui/scroll-area';
import { MutableRefObject } from 'react';

interface PropertyListProps {
  properties: Property[];
  onCardClick: (property: Property) => void;
  onCardHover: (propertyId: string | null) => void;
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
  cardRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export function PropertyList({ properties, onCardClick, onCardHover, selectedPropertyId, hoveredPropertyId, cardRefs }: PropertyListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {properties.map(property => (
          <div key={property.id} ref={el => (cardRefs.current[property.id] = el)}>
            <PropertyCard
              property={property}
              selected={property.id === selectedPropertyId || property.id === hoveredPropertyId}
              onMouseEnter={() => onCardHover(property.id)}
              onMouseLeave={() => onCardHover(null)}
              onClick={() => onCardClick(property)}
            />
          </div>
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

    