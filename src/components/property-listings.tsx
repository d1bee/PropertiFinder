'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import type { Property } from '@/lib/data';
import { PropertyMap } from '@/components/property-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from './ui/badge';
import { BedDouble, Bath, Square } from 'lucide-react';

interface PropertyListingsProps {
    properties: Property[];
    apiKey?: string;
}

export function PropertyListings({ properties, apiKey }: PropertyListingsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get('id');

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        properties.find(p => p.id === selectedId) || null
    );

    const handleMarkerClick = (property: Property) => {
        setSelectedProperty(property);
        router.push(`${pathname}?id=${property.id}`, { scroll: false });
    };
    
    const handleCardClose = () => {
        setSelectedProperty(null);
        router.push(pathname, { scroll: false });
    };

    return (
        <div className="relative w-full h-full">
            {apiKey ? (
                <PropertyMap 
                    properties={properties} 
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
                <div className="absolute top-4 right-4 w-full max-w-sm space-y-3">
                    <Card className="overflow-hidden">
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
                                <Badge className="absolute top-2 left-2 bg-green-500/80 text-white border-none">Available</Badge>
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
                            <h3 className="text-xl font-bold">Dream House, New York</h3>
                             <p className="text-sm text-muted-foreground">{selectedProperty.type} | {selectedProperty.beds} Beds | {selectedProperty.baths} Baths | {selectedProperty.area} sq.ft.</p>
                            <p className="text-sm">{selectedProperty.description}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-3 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="agent portrait" />
                                    <AvatarFallback>LR</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Lisa Richards</p>
                                    <p className="text-sm text-muted-foreground">Agent</p>
                                </div>
                            </div>
                            <Button onClick={() => router.push(`/properties/${selectedProperty.id}`)}>View Details</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
