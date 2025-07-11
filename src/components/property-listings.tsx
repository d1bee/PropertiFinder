
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
import { Button } from './ui/button';

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
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
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
    if (selectedPropertyIds.length > 0 && viewMode === 'list') {
      const lastSelectedId = selectedPropertyIds[selectedPropertyIds.length - 1];
      if (cardRefs.current[lastSelectedId]) {
        cardRefs.current[lastSelectedId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedPropertyIds, viewMode]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const togglePropertySelection = useCallback((propertyId: string) => {
    setSelectedPropertyIds(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

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
    togglePropertySelection(propertyId);
  }, [togglePropertySelection]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    // This can be used to clear selections, or for other interactions
  }, []);

  const handleAddProperty = (newPropertyData: Omit<Property, 'id' | 'coordinates'>) => {
      const newProperty: Property = {
        id: (properties.length + 100).toString(),
        ...newPropertyData,
        coordinates: {
          lat: 1.118 + (Math.random() - 0.5) * 0.1,
          lng: 104.048 + (Math.random() - 0.5) * 0.1,
        },
      };
      setProperties(prev => [...prev, newProperty]);
      setIsAddDrawerOpen(false);
      // Optionally select the new property
      // setSelectedPropertyIds([newProperty.id]);
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
                              selected={selectedPropertyIds.includes(property.id)}
                              onSelectionChange={() => togglePropertySelection(property.id)}
                              showCheckbox
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
              selectedPropertyIds={selectedPropertyIds}
              hoveredPropertyId={hoveredPropertyId}
              className={viewMode === 'list' ? 'hidden' : ''}
            />
          </div>

        </div>
      </main>

       {selectedPropertyIds.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md">
            <div className="bg-background rounded-lg shadow-2xl p-4 m-4 flex items-center justify-between">
                <p className="font-semibold">{selectedPropertyIds.length} properti dipilih</p>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setSelectedPropertyIds([])}>Bersihkan</Button>
                    <Button>Bandingkan</Button>
                </div>
            </div>
          </div>
       )}

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
