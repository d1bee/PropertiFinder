'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/lib/data';
import { PropertyMap } from '@/components/property-map';
import { Header } from './header';
import type { FilterState } from './property-search-filter';
import { PropertyList } from './property-list';
import { cn } from '@/lib/utils';

interface PropertyListingsProps {
  properties: Property[];
  apiKey?: string;
}

const parseAreaRange = (range: string): [number, number] => {
  if (range === 'Semua' || !range) return [0, Infinity];
  if (range.includes('+')) return [parseInt(range), Infinity];
  const [min, max] = range.split('-').map(Number);
  return [min, max];
};

export function PropertyListings({ properties, apiKey }: PropertyListingsProps) {
  const router = useRouter();
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    propertyType: 'Semua',
    priceSort: 'Default',
    buildingArea: 'Semua',
    landArea: 'Semua',
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredProperties = useMemo(() => {
    let sortedProperties = [...properties];

    if (filters.priceSort === 'Harga Terendah') {
      sortedProperties.sort((a, b) => a.price - b.price);
    } else if (filters.priceSort === 'Harga Tertinggi') {
      sortedProperties.sort((a, b) => b.price - a.price);
    }

    const [minBuildingArea, maxBuildingArea] = parseAreaRange(filters.buildingArea);
    const [minLandArea, maxLandArea] = parseAreaRange(filters.landArea);

    return sortedProperties.filter(property => {
      const searchTermMatch = filters.searchTerm === '' ||
        property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const propertyTypeMatch = filters.propertyType === 'Semua' || property.type === filters.propertyType;

      const buildingAreaMatch = property.buildingArea >= minBuildingArea && property.buildingArea <= maxBuildingArea;
      const landAreaMatch = property.landArea >= minLandArea && property.landArea <= maxLandArea;

      return searchTermMatch && propertyTypeMatch && buildingAreaMatch && landAreaMatch;
    });
  }, [properties, filters]);
  
  const handleCardClick = useCallback((property: Property) => {
     router.push(`/properties/${property.id}`);
  }, [router]);

  const handleCardHover = useCallback((propertyId: string | null) => {
    setHoveredPropertyId(propertyId);
  }, []);

  const handleMarkerClick = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId);
    router.push(`/properties/${propertyId}`);
  }, [router]);

  const handleMarkerHover = useCallback((propertyId: string | null) => {
    setHoveredPropertyId(propertyId);
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <Header filters={filters} onFilterChange={handleFilterChange} showFilters={true} />
       <div className="grid grid-cols-12 h-full pt-24">
        {filteredProperties.length > 0 && (
         <div className="col-span-4 lg:col-span-3 h-full overflow-y-auto pr-2">
            <PropertyList 
              properties={filteredProperties}
              onCardClick={handleCardClick}
              onCardHover={handleCardHover}
              selectedPropertyId={selectedPropertyId}
              hoveredPropertyId={hoveredPropertyId}
            />
         </div>
        )}
         <div className={cn(
            "h-full rounded-lg overflow-hidden",
            filteredProperties.length > 0 ? "col-span-8 lg:col-span-9" : "col-span-12"
          )}>
            <PropertyMap
              properties={filteredProperties}
              apiKey={apiKey}
              selectedPropertyId={selectedPropertyId}
              hoveredPropertyId={hoveredPropertyId}
              onMarkerClick={handleMarkerClick}
              onMarkerHover={handleMarkerHover}
            />
        </div>
      </div>
    </div>
  );
}
