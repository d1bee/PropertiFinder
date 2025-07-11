'use client';
import { PropertyCard } from '@/components/property-card';
import { PropertyMap } from '@/components/property-map';
import { properties } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import type { Property } from '@/lib/data';

export default function PropertiesPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const handleMarkerClick = (property: Property) => {
        setSelectedProperty(property);
        const card = document.getElementById(`property-card-${property.id}`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">54 New York Properties For Rent</h2>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div id="property-list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {properties.slice(0, 6).map((property) => (
                           <div key={property.id} id={`property-card-${property.id}`}>
                             <PropertyCard property={property} />
                           </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <Button variant="outline">View More</Button>
                    </div>
                </div>

                <div className="h-[calc(100vh-250px)] lg:h-full sticky top-28">
                     {apiKey ? (
                        <PropertyMap properties={properties} apiKey={apiKey} onMarkerClick={handleMarkerClick} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                            <p className="text-center text-destructive">
                                Google Maps API key is missing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
