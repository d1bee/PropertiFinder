
import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Heart, LandPlot, Building, X } from 'lucide-react';
import type { Property } from '@/lib/data';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

type PropertyCardProps = {
  property: Property;
  selected?: boolean;
  onSelectionChange?: (checked: boolean) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  className?: string;
  isFloating?: boolean;
  onClose?: () => void;
  showCheckbox?: boolean;
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

export function PropertyCard({ 
  property, 
  selected = false, 
  onSelectionChange,
  onMouseEnter, 
  onMouseLeave, 
  onClick, 
  className,
  isFloating = false,
  onClose,
  showCheckbox = false
}: PropertyCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      const target = e.target as HTMLElement;
      if (!target.closest('a') && !target.closest('button') && !target.closest('[role="checkbox"]')) {
        e.preventDefault();
        onClick();
      }
    }
  };

  const content = (
    <>
       <div className="relative">
          <Image
            src={property.images[0]}
            alt={property.title}
            width={400}
            height={250}
            className={cn("object-cover w-full", isFloating ? "h-32" : "h-40")}
            data-ai-hint={getAIHint(property.type)}
          />
        {showCheckbox && (
           <div className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
            <Checkbox 
              checked={selected}
              onCheckedChange={onSelectionChange}
              aria-label={`Select ${property.title}`}
            />
           </div>
        )}
        {!isFloating && (
          <Button size="icon" variant="secondary" className="absolute top-2 right-2 rounded-full h-7 w-7 bg-card/70 hover:bg-card">
              <Heart className="h-4 w-4" />
          </Button>
        )}
        {isFloating && onClose && (
           <Button size="icon" variant="secondary" className="absolute top-2 right-2 rounded-full h-7 w-7 bg-card/70 hover:bg-card" onClick={onClose}>
              <X className="h-4 w-4" />
          </Button>
        )}
         <Badge className="absolute bottom-2 left-2">{property.type}</Badge>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-base leading-tight truncate" title={property.title}>
                    <Link href={`/properties/${property.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{property.title}</Link>
                </h3>
                <p className="text-muted-foreground text-xs">{property.location}</p>
            </div>
        </div>
        
        <p className="text-lg font-bold mt-2">{formatPrice(property.price)}</p>
        
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 border-t pt-2 flex-grow content-end">
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
    </>
  );

  return (
    <div 
      className={cn(
        "bg-card rounded-lg overflow-hidden border transition-all duration-300 flex flex-col", 
        !isFloating && "cursor-pointer h-full",
        selected ? "shadow-2xl border-primary ring-2 ring-primary" : "hover:shadow-md hover:border-muted-foreground/50",
        isFloating && "shadow-2xl w-full",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={isFloating ? undefined : handleClick}
    >
      {content}
    </div>
  );
}
