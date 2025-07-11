'use client';

import { useState } from 'react';
import type { Property } from '@/lib/data';
import { PropertyCard } from '@/components/property-card';
import { PropertyMap } from '@/components/property-map';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyListingsProps {
    properties: Property[];
    apiKey?: string;
}

export function PropertyListings({ properties, apiKey }: PropertyListingsProps) {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const handleMarkerClick = (property: Property) => {
        setSelectedProperty(property);
        const card = document.getElementById(`property-card-${property.id}`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)]">
            <div className="lg:col-span-5 flex flex-col">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-semibold">{properties.length} Batam Properties For Rent</h2>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ScrollArea className="flex-grow pr-4 -mr-4">
                    <div id="property-list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {properties.map((property) => (
                            <div key={property.id} id={`property-card-${property.id}`}>
                                <PropertyCard property={property} selected={selectedProperty?.id === property.id} />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="text-center mt-6">
                    <Button variant="outline">View More</Button>
                </div>
            </div>

            <div className="hidden lg:block lg:col-span-7 h-full">
                {apiKey ? (
                    <PropertyMap properties={properties} apiKey={apiKey} onMarkerClick={handleMarkerClick} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                        <p className="text-center text-destructive p-4">
                            Google Maps API key is missing.
                            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
