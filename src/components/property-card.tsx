import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Square, LandPlot, Building2, Home } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Property } from '@/lib/data';
import { Badge } from './ui/badge';

type PropertyCardProps = {
  property: Property;
};

const formatPrice = (price: number) => {
  if (price >= 1e9) {
    return `${(price / 1e9).toFixed(1).replace(/\.0$/, '')} Miliar`;
  }
  if (price >= 1e6) {
    return `${(price / 1e6).toFixed(1).replace(/\.0$/, '')} Juta`;
  }
  return price.toLocaleString('id-ID');
};

const propertyTypeIcons = {
  Rumah: <Home className="h-4 w-4" />,
  Apartemen: <Building2 className="h-4 w-4" />,
  Tanah: <LandPlot className="h-4 w-4" />,
};

const getAIHint = (type: Property['type']) => {
  switch (type) {
    case 'Rumah': return 'modern house';
    case 'Apartemen': return 'apartment city';
    case 'Tanah': return 'land aerial';
    default: return 'house exterior';
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <Link href={`/properties/${property.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9]">
                    <Image
                      src={img}
                      alt={`${property.title} image ${index + 1}`}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48"
                      data-ai-hint={getAIHint(property.type)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {property.images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              </>
            )}
          </Carousel>
           <Badge variant="secondary" className="absolute top-2 left-2 flex items-center gap-1">
            {propertyTypeIcons[property.type]}
            {property.type}
          </Badge>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight mb-1 truncate">{property.title}</CardTitle>
          <CardDescription className="text-sm truncate">{property.location}</CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col items-start space-y-2">
           <p className="text-2xl font-bold text-primary">Rp {formatPrice(property.price)}</p>
          {property.type !== 'Tanah' && (
             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" />
                <span>{property.beds}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4" />
                <span>{property.baths}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Square className="h-4 w-4" />
                <span>{property.area} m²</span>
              </span>
            </div>
          )}
           {property.type === 'Tanah' && (
             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <LandPlot className="h-4 w-4" />
                    <span>{property.area} m²</span>
                </span>
            </div>
           )}
        </CardFooter>
      </Link>
    </Card>
  );
}
