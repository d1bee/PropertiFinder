import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Star, Heart } from 'lucide-react';
import type { Property } from '@/lib/data';
import { Button } from './ui/button';

type PropertyCardProps = {
  property: Property;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price / 16000); // Approximate conversion
};

const getAIHint = (type: Property['type']) => {
  switch (type) {
    case 'Rumah': return 'modern house interior';
    case 'Apartemen': return 'apartment interior';
    case 'Tanah': return 'land aerial';
    default: return 'house interior';
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden border">
      <div className="relative">
        <Link href={`/properties/${property.id}`}>
          <Image
            src={property.images[0]}
            alt={property.title}
            width={400}
            height={250}
            className="object-cover w-full h-52"
            data-ai-hint={getAIHint(property.type)}
          />
        </Link>
        <Button size="icon" variant="secondary" className="absolute top-3 right-3 rounded-full h-8 w-8">
            <Heart className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-lg leading-tight">
                    <Link href={`/properties/${property.id}`}>{property.type} in {property.location.split(',')[0]}</Link>
                </h3>
                <p className="text-muted-foreground text-sm">3 Bedrooms</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.5</span>
            </div>
        </div>
        
        <div className="flex justify-between items-end mt-4">
            <div>
                <p className="text-xl font-bold">{formatPrice(property.price)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4" />
                    <span>{property.beds}</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4" />
                    <span>{property.baths}</span>
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}
