import Image from 'next/image';
import { notFound } from 'next/navigation';
import { properties, type Property } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }
  
  const getAIHint = (type: Property['type']) => {
    switch (type) {
      case 'Rumah': return 'modern house interior';
      case 'Apartemen': return 'apartment interior';
      case 'Tanah': return 'land aerial';
      default: return 'house interior';
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Carousel>
                <CarouselContent>
                  {property.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={img}
                        alt={`${property.title} image ${index + 1}`}
                        width={800}
                        height={600}
                        className="object-cover w-full h-96"
                        data-ai-hint={getAIHint(property.type)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
              </Carousel>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">{property.type}</Badge>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-primary mb-4">{formatPrice(property.price)}</p>
              <div className="flex items-center space-x-6 text-muted-foreground">
                {property.type !== 'Tanah' && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="h-5 w-5 text-primary" />
                      <b>{property.beds}</b> KT
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="h-5 w-5 text-primary" />
                      <b>{property.baths}</b> KM
                    </span>
                  </>
                )}
                <span className="flex items-center gap-1.5">
                  <Square className="h-5 w-5 text-primary" />
                  <b>{property.area}</b> m²
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader><CardTitle>Deskripsi</CardTitle></CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Fitur Utama</CardTitle></CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
