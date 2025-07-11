
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';

interface PropertyListingsProps {
  apiKey?: string;
  properties: Property[];
}

const parseAreaRange = (range: string): [number, number] => {
  if (range === 'Semua' || !range) return [0, Infinity];
  if (range.includes('+')) return [parseInt(range), Infinity];
  const [min, max] = range.split('-').map(Number);
  return [min, max];
};

export function PropertyListings({ apiKey, properties: initialPropertiesData }: PropertyListingsProps) {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(initialPropertiesData);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    propertyType: 'Semua',
    priceSort: 'Default',
    buildingArea: 'Semua',
    landArea: 'Semua',
  });

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedPropertyId && viewMode === 'list' && cardRefs.current[selectedPropertyId]) {
      cardRefs.current[selectedPropertyId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedPropertyId, viewMode]);

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

  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    return filteredProperties.find(p => p.id === selectedPropertyId);
  }, [selectedPropertyId, filteredProperties]);
  
  const handleCardClick = useCallback((property: Property) => {
     router.push(`/properties/${property.id}`);
  }, [router]);

  const handleCardHover = useCallback((propertyId: string | null) => {
    setHoveredPropertyId(propertyId);
  }, []);

  const handleMarkerClick = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId);
     if (viewMode === 'list' && cardRefs.current[propertyId]) {
      cardRefs.current[propertyId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [viewMode]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    setSelectedPropertyId(null);
  }, []);

  const handleAddProperty = (newPropertyData: Omit<Property, 'id' | 'coordinates'>) => {
      const newProperty: Property = {
        id: (properties.length + 100).toString(),
        ...newPropertyData,
        // Assign a random coordinate in Batam for now
        coordinates: {
          lat: 1.118 + (Math.random() - 0.5) * 0.1,
          lng: 104.048 + (Math.random() - 0.5) * 0.1,
        },
      };
      setProperties(prev => [...prev, newProperty]);
      setIsAddDrawerOpen(false);
      setSelectedPropertyId(newProperty.id);
  };
  
  return (
    <div className="relative w-full h-full flex flex-col">
      <Header 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        showFilters={true} 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddPropertyClick={() => setIsAddDrawerOpen(true)}
      />
      <main className="flex-grow pt-20 md:pt-24 flex flex-col">
        <div className="flex-grow relative">
          {viewMode === 'list' && (
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
                      <p className="text-muted-foreground text-lg text-center">Tidak ada properti yang cocok dengan kriteria Anda.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
          )}
          
          <div className="h-full w-full">
            <PropertyMap
              properties={filteredProperties}
              apiKey={apiKey}
              onMarkerClick={handleMarkerClick}
              onMapClick={handleMapClick}
              selectedPropertyId={selectedPropertyId}
              hoveredPropertyId={hoveredPropertyId}
              className={viewMode === 'list' ? 'hidden' : ''}
            />
          </div>

          {viewMode === 'map' && selectedProperty && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-10">
              <PropertyCard 
                property={selectedProperty} 
                isFloating 
                onClose={() => setSelectedPropertyId(null)}
              />
            </div>
          )}
        </div>
      </main>
       <Drawer open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
        <DrawerContent>
           <DrawerHeader className="text-left">
              <DrawerTitle>Add New Property</DrawerTitle>
              <DrawerDescription>Fill in the details for the new property. Click "Add Property" when you're done.</DrawerDescription>
            </DrawerHeader>
           <div className="p-4 pt-0">
             <AddPropertyForm onSubmit={handleAddProperty} onCancel={() => setIsAddDrawerOpen(false)} />
           </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
