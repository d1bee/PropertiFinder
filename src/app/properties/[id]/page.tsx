import Image from 'next/image';
import { notFound } from 'next/navigation';
import { properties, type Property } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, CheckCircle, MapPin, Phone, MessageSquare, LandPlot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackButton } from '@/components/back-button';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};
  
const getAIHint = (type: Property['type']) => {
  switch (type) {
    case 'Rumah': return 'modern house interior';
    case 'Apartemen': return 'apartment interior';
    case 'Tanah Kosong': return 'land aerial';
    case 'Gudang': return 'warehouse interior';
    case 'Ruko': return 'storefront building';
    case 'Galangan Kapal': return 'shipyard aerial';
    case 'Pabrik': return 'factory building';
    default: return 'house interior';
  }
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
       <div className="mb-4">
        <BackButton />
        <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
        <div className="flex items-center text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 mr-1.5" />
          {property.location}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[500px]">
            <div className="col-span-2 row-span-2">
              <Image
                src={property.images[0]}
                alt={`${property.title} main image`}
                width={800}
                height={600}
                className="object-cover w-full h-full rounded-lg"
                data-ai-hint={getAIHint(property.type)}
                priority
              />
            </div>
            {property.images.slice(1, 3).map((img, index) => (
              <div key={index} className="hidden md:block">
                <Image
                  src={img}
                  alt={`${property.title} image ${index + 2}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full rounded-lg"
                  data-ai-hint={getAIHint(property.type)}
                />
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Properti</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Detail Properti</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                        <BedDouble className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Kamar Tidur</p>
                        <p className="font-semibold">{property.beds > 0 ? `${property.beds} KT` : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                        <Bath className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Kamar Mandi</p>
                        <p className="font-semibold">{property.baths > 0 ? `${property.baths} KM` : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                        <Square className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Luas Bangunan</p>
                        <p className="font-semibold">{property.buildingArea > 0 ? `${property.buildingArea} m²` : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                        <LandPlot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Luas Tanah</p>
                        <p className="font-semibold">{property.landArea > 0 ? `${property.landArea} m²` : 'N/A'}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                        <Badge variant="secondary" className="text-base">{property.type}</Badge>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Tipe Properti</p>
                        <p className="font-semibold">{property.type}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Fitur Utama</CardTitle></CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
        
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Harga Properti</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-extrabold text-primary mb-4">{formatPrice(property.price)}</p>
                <Button className="w-full">Jadwalkan Kunjungan</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="agent portrait" />
                    <AvatarFallback>KP</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-xl">Kontributor</CardTitle>
                    <p className="text-muted-foreground">Bapak Propertio</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                    <Phone className="mr-2"/> Hubungi Kontributor
                </Button>
                 <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2"/> Kirim Pesan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lokasi di Peta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden">
                    <Image src={`https://maps.googleapis.com/maps/api/staticmap?center=${property.coordinates.lat},${property.coordinates.lng}&zoom=15&size=600x400&markers=color:red%7C${property.coordinates.lat},${property.coordinates.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`}
                        alt={`Map of ${property.title}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        data-ai-hint="map location"
                    />
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}

    