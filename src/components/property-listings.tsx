
'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Property } from '@/lib/data';
import { PropertyMap } from '@/components/property-map';
import { Header } from './header';
import type { FilterState } from './property-search-filter';
import { ScrollArea } from './ui/scroll-area';
import { PropertyCard } from './property-card';
import { AddPropertyForm } from './add-property-form';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { Button } from './ui/button';
import Draggable from 'react-draggable';

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
  const [selectedPropertyForCard, setSelectedPropertyForCard] = useState<Property | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [newPropertyCoords, setNewPropertyCoords] = useState<{lat: number; lng: number} | null>(null);

  const draggableRef = useRef<HTMLDivElement>(null);

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
  
  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedPropertyIds([]);
    }
  }, [isSelectionMode]);
  
  useEffect(() => {
    setIsSelectionMode(false);
    setSelectedPropertyIds([]);
  }, [viewMode]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedPropertyForCard(null); 
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

  const handleMarkerClick = useCallback((property: Property) => {
    if (isSelectionMode) {
      togglePropertySelection(property.id);
    } else {
      setSelectedPropertyIds([]); 
      setSelectedPropertyForCard(property);
    }
  }, [isSelectionMode, togglePropertySelection]);

  const handleMapClick = useCallback(() => {
    if (!isSelectionMode) {
        setSelectedPropertyForCard(null);
    }
  }, [isSelectionMode]);
  
  const handleMapRightClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setNewPropertyCoords(coords);
      setIsAddDrawerOpen(true);
    }
  }, []);

  const handleAddDrawerOpen = (open: boolean) => {
      setIsAddDrawerOpen(open);
      if (!open) {
          setNewPropertyCoords(null);
      }
  }
  
  const handleCompareClick = () => {
    if (selectedPropertyIds.length > 0) {
      router.push(`/compare?ids=${selectedPropertyIds.join(',')}`);
    }
  };

  const handleAddProperty = (newPropertyData: Omit<Property, 'id'>) => {
      const newProperty: Property = {
        id: (properties.length + 100).toString(),
        ...newPropertyData
      };
      setProperties(prev => [...prev, newProperty]);
      setIsAddDrawerOpen(false);
      setNewPropertyCoords(null);
  };

  const handleToggleSelectionMode = () => {
    const newSelectionMode = !isSelectionMode;
    setIsSelectionMode(newSelectionMode);
    if (newSelectionMode) {
      setSelectedPropertyForCard(null); 
    }
    if (!newSelectionMode) {
      setSelectedPropertyIds([]);
    }
  };
  
  return (
    <div className="relative w-full h-full flex flex-col">
      <Header 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        showFilters={true} 
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          setSelectedPropertyForCard(null);
        }}
        onAddPropertyClick={() => handleAddDrawerOpen(true)}
      />
      <main className="flex-grow pt-[120px] flex flex-col">
        <div className="flex-grow relative">
          <div className={viewMode === 'list' ? 'block' : 'hidden'}>
             <ScrollArea className="h-[calc(100vh-theme(spacing.40)-40px)] sm:h-[calc(100vh-theme(spacing.40))]">
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
          </div>
          
          <div className={viewMode === 'map' ? 'block h-full w-full' : 'hidden'}>
            <PropertyMap
              properties={filteredProperties}
              apiKey={apiKey}
              onMarkerClick={handleMarkerClick}
              onMapClick={handleMapClick}
              onMapRightClick={handleMapRightClick}
              selectedPropertyIds={selectedPropertyIds}
              hoveredPropertyId={hoveredPropertyId}
              isSelectionMode={isSelectionMode}
              onToggleSelectionMode={handleToggleSelectionMode}
            />
             {selectedPropertyForCard && !isSelectionMode && (
               <Draggable nodeRef={draggableRef} handle=".drag-handle" bounds="parent">
                <div ref={draggableRef} className="absolute bottom-4 left-4 z-10 w-full max-w-sm cursor-grab">
                    <PropertyCard 
                    property={selectedPropertyForCard} 
                    isFloating 
                    onClose={() => setSelectedPropertyForCard(null)} 
                    onClick={() => handleCardClick(selectedPropertyForCard)}
                    isDraggable
                    />
                </div>
               </Draggable>
            )}
          </div>
        </div>
      </main>

       {selectedPropertyIds.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md">
            <div className="bg-background rounded-lg shadow-2xl p-4 m-4 flex items-center justify-between">
                <p className="font-semibold">{selectedPropertyIds.length} properti dipilih</p>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setSelectedPropertyIds([])}>Bersihkan</Button>
                    <Button onClick={handleCompareClick}>Bandingkan</Button>
                </div>
            </div>
          </div>
       )}

       <Drawer open={isAddDrawerOpen} onOpenChange={handleAddDrawerOpen}>
        <DrawerContent>
           <DrawerHeader className="text-left">
              <DrawerTitle>Add New Property</DrawerTitle>
              <DrawerDescription>Fill in the details for the new property. Right-click on the map to set coordinates. Click "Add Property" when you're done.</DrawerDescription>
            </DrawerHeader>
           <div className="p-4 pt-0">
             <AddPropertyForm 
                onSubmit={handleAddProperty} 
                onCancel={() => handleAddDrawerOpen(false)}
                initialCoordinates={newPropertyCoords}
             />
           </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
