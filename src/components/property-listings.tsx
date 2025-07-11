
'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { properties as initialProperties, type Property } from '@/lib/data';
import { PropertyMap } from '@/components/property-map';
import { Header } from './header';
import type { FilterState } from './property-search-filter';
import { PropertyList } from './property-list';
import { ScrollArea } from './ui/scroll-area';
import { PropertyCard } from './property-card';
import { AddPropertyForm } from './add-property-form';
import { Drawer, DrawerContent } from './ui/drawer';

interface PropertyListingsProps {
  apiKey?: string;
}

const parseAreaRange = (range: string): [number, number] => {
  if (range === 'Semua' || !range) return [0, Infinity];
  if (range.includes('+')) return [parseInt(range), Infinity];
  const [min, max] = range.split('-').map(Number);
  return [min, max];
};

export function PropertyListings({ apiKey }: PropertyListingsProps) {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [newPropertyLocation, setNewPropertyLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    propertyType: 'Semua',
    priceSort: 'Default',
    buildingArea: 'Semua',
    landArea: 'Semua',
  });

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedPropertyId && cardRefs.current[selectedPropertyId]) {
      cardRefs.current[selectedPropertyId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedPropertyId]);

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
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setNewPropertyLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, []);

  const handleAddProperty = (newPropertyData: Omit<Property, 'id' | 'coordinates'>) => {
    if (newPropertyLocation) {
      const newProperty: Property = {
        id: (properties.length + 100).toString(),
        ...newPropertyData,
        coordinates: newPropertyLocation,
      };
      setProperties(prev => [...prev, newProperty]);
      setNewPropertyLocation(null);
      setSelectedPropertyId(newProperty.id);
    }
  };
  
  return (
    <div className="relative w-full h-full flex flex-col">
      <Header 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        showFilters={true} 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <div className="flex-grow pt-24">
        {viewMode === 'map' ? (
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 h-full w-full z-0">
              <PropertyMap
                properties={filteredProperties}
                apiKey={apiKey}
                onMarkerClick={handleMarkerClick}
                onMapClick={handleMapClick}
              />
            </div>
            {filteredProperties.length > 0 && (
              <div className="absolute top-4 left-4 z-10 w-[380px] h-[calc(100%-2rem)] bg-card rounded-lg shadow-lg overflow-hidden">
                <PropertyList 
                  properties={filteredProperties}
                  onCardClick={handleCardClick}
                  onCardHover={handleCardHover}
                  selectedPropertyId={selectedPropertyId}
                  hoveredPropertyId={hoveredPropertyId}
                  cardRefs={cardRefs}
                />
              </div>
            )}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="container mx-auto px-4 py-4">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProperties.map(property => (
                     <div key={property.id} ref={el => (cardRefs.current[property.id] = el)}>
                        <PropertyCard
                        property={property}
                        selected={property.id === selectedPropertyId || property.id === hoveredPropertyId}
                        onMouseEnter={() => handleCardHover(property.id)}
                        onMouseLeave={() => handleCardHover(null)}
                        onClick={() => handleCardClick(property)}
                        />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[50vh]">
                  <p className="text-muted-foreground text-lg">Tidak ada properti yang cocok dengan kriteria Anda.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      <Drawer open={!!newPropertyLocation} onOpenChange={(isOpen) => !isOpen && setNewPropertyLocation(null)}>
        <DrawerContent>
          {newPropertyLocation && <AddPropertyForm onSubmit={handleAddProperty} onCancel={() => setNewPropertyLocation(null)} />}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
