import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Heart, LandPlot, Building } from 'lucide-react';
import type { Property } from '@/lib/data';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

type PropertyCardProps = {
  property: Property;
  selected?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

const getAIHint = (type: Property['type']) => {
  switch (type) {
    case 'Rumah': return 'modern house';
    case 'Apartemen': return 'apartment building';
    case 'Tanah Kosong': return 'land aerial';
    case 'Gudang': return 'warehouse exterior';
    case 'Ruko': return 'storefront building';
    case 'Galangan Kapal': return 'shipyard aerial';
    case 'Pabrik': return 'factory exterior';
    default: return 'building exterior';
  }
}

export function PropertyCard({ property, selected = false, onMouseEnter, onMouseLeave, onClick }: PropertyCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer", 
        selected ? "shadow-lg border-primary" : "hover:shadow-md hover:border-muted-foreground/50"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="relative">
          <Image
            src={property.images[0]}
            alt={property.title}
            width={400}
            height={250}
            className="object-cover w-full h-40"
            data-ai-hint={getAIHint(property.type)}
          />
        <Button size="icon" variant="secondary" className="absolute top-2 right-2 rounded-full h-7 w-7 bg-card/70 hover:bg-card">
            <Heart className="h-4 w-4" />
        </Button>
         <Badge className="absolute bottom-2 left-2">{property.type}</Badge>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-base leading-tight truncate" title={property.title}>
                    {property.title}
                </h3>
                <p className="text-muted-foreground text-xs">{property.location}</p>
            </div>
        </div>
        
        <p className="text-lg font-bold mt-2">{formatPrice(property.price)}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 border-t pt-2">
            {property.beds > 0 && (
                <span className="flex items-center gap-1.5">
                    <BedDouble className="h-3 w-3" />
                    <span>{property.beds}</span>
                </span>
            )}
            {property.baths > 0 && (
                <span className="flex items-center gap-1.5">
                    <Bath className="h-3 w-3" />
                    <span>{property.baths}</span>
                </span>
            )}
            {property.buildingArea > 0 && (
                 <span className="flex items-center gap-1.5">
                    <Building className="h-3 w-3" />
                    <span>{property.buildingArea} m²</span>
                </span>
            )}
            {property.landArea > 0 && (
                 <span className="flex items-center gap-1.5">
                    <LandPlot className="h-3 w-3" />
                    <span>{property.landArea} m²</span>
                </span>
            )}
        </div>
      </div>
    </div>
  );
}
