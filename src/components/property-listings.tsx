'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import type { Property } from '@/lib/data';
import { PropertyMap } from '@/components/property-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from './ui/badge';
import { Header } from './header';
import type { FilterState } from './property-search-filter';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);

  const selectedId = searchParams.get('id');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
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

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
    router.push(`${pathname}?id=${property.id}`, { scroll: false });
  };

  const handleCardClose = useCallback(() => {
    setSelectedProperty(null);
    router.push(pathname, { scroll: false });
  },[pathname, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        const marker = (event.target as HTMLElement).closest('[role="button"]');
        if (!marker) {
          handleCardClose();
        }
      }
    };

    if (selectedProperty) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProperty, handleCardClose]);

  useEffect(() => {
    const property = properties.find(p => p.id === selectedId) || null;
    setSelectedProperty(property);
  }, [selectedId, properties]);

  useEffect(() => {
    if (selectedProperty && !filteredProperties.find(p => p.id === selectedProperty.id)) {
      handleCardClose();
    }
  }, [filteredProperties, selectedProperty, handleCardClose]);


  return (
    <div className="relative w-full h-full">
      <Header filters={filters} onFilterChange={handleFilterChange} showFilters={true} />
      {apiKey ? (
        <PropertyMap
          properties={filteredProperties}
          apiKey={apiKey}
          onMarkerClick={handleMarkerClick}
          selectedPropertyId={selectedProperty?.id}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
          <p className="text-center text-destructive p-4">
            Google Maps API key is missing.
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
          </p>
        </div>
      )}

      {selectedProperty && (
        <div ref={cardRef} className="absolute top-1/2 -translate-y-1/2 right-4 w-full max-w-sm space-y-3">
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="p-0">
              <div className="relative">
                <Image
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-48"
                  data-ai-hint="modern house"
                />
                <Badge className="absolute top-2 left-2 bg-green-500/80 text-white border-none">Tersedia</Badge>
              </div>
              <div className="flex p-2 gap-2">
                {selectedProperty.images.slice(0, 3).map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`${selectedProperty.title} thumbnail ${index}`}
                    width={100}
                    height={75}
                    className="object-cover w-full h-16 rounded-md"
                    data-ai-hint="house interior"
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <h3 className="text-xl font-bold">{selectedProperty.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedProperty.type} | LB: {selectedProperty.buildingArea} m² | LT: {selectedProperty.landArea} m² {selectedProperty.beds > 0 ? `| ${selectedProperty.beds} KT` : ''} {selectedProperty.baths > 0 ? `| ${selectedProperty.baths} KM` : ''}</p>
              <p className="text-sm line-clamp-3">{selectedProperty.description}</p>
            </CardContent>
          </Card>
          <Card className="shadow-2xl">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="agent portrait" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Bapak Propertio</p>
                  <p className="text-sm text-muted-foreground">Kontributor</p>
                </div>
              </div>
              <Button onClick={() => router.push(`/properties/${selectedProperty.id}`)}>Lihat Detail</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

    