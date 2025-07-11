'use client';

import Link from 'next/link';
import { Heart, User, ChevronLeft, Circle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { PropertySearchFilter, type FilterState } from './property-search-filter';
import { Badge } from './ui/badge';
import { properties } from '@/lib/data';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

interface HeaderProps {
    filters?: FilterState;
    onFilterChange?: (filters: Partial<FilterState>) => void;
    showFilters?: boolean;
}

export function Header({ filters, onFilterChange, showFilters = false }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isPropertiesPage = pathname.startsWith('/properties');
  const isDetailPage = /^\/properties\/[^/]+$/.test(pathname);
  
  const propertyId = isDetailPage ? pathname.split('/').pop() : null;
  const property = propertyId ? properties.find(p => p.id === propertyId) : null;

  return (
    <header className={cn(
        "sticky top-0 z-50 shadow-sm",
        isPropertiesPage ? "bg-transparent absolute w-full top-0 bg-gradient-to-b from-black/50 to-transparent" : "bg-card border-b"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {!isPropertiesPage ? (
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                 <h1 className="text-xl font-bold">Properti Finder</h1>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="hidden sm:inline-flex bg-green-100 text-green-700 hover:bg-green-200">Bayar Sewa</Button>
              <Button className="hidden sm:inline-flex bg-primary text-primary-foreground">Post Properti <span className="ml-2 bg-blue-400 text-white text-xs px-2 py-0.5 rounded-full">GRATIS</span></Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn("flex flex-col justify-center p-4 h-auto")}>
             <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-white">Properti Finder</h1>
                </Link>
                <div className="flex-grow">
                    {isDetailPage && property ? (
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push('/properties')}>
                        <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3 overflow-hidden">
                        <span className="font-semibold truncate">{property.location}</span>
                        <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">Aktif</span>
                        <Badge variant="secondary" className="text-base font-bold">{formatPrice(property.price)}</Badge>
                        <p className="text-sm text-muted-foreground hidden lg:block truncate">
                            {property.type} {property.beds > 0 ? `| ${property.beds} KT` : ''} {property.baths > 0 ? `| ${property.baths} KM` : ''} | LB: {property.buildingArea} m²
                        </p>
                        </div>
                    </div>
                    ) : (
                        showFilters && filters && onFilterChange && <PropertySearchFilter filters={filters} onFilterChange={onFilterChange} />
                    )}
                 </div>
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
