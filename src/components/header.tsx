
'use client';

import Link from 'next/link';
import { Heart, User, ChevronLeft, Circle, Map, List, PlusCircle, Filter } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { PropertySearchFilter, type FilterState } from './property-search-filter';
import { Badge } from './ui/badge';
import { properties } from '@/lib/data';
import Image from 'next/image';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

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
    viewMode?: 'map' | 'list';
    onViewModeChange?: (mode: 'map' | 'list') => void;
    onAddPropertyClick?: () => void;
}

export function Header({ filters, onFilterChange, showFilters = false, viewMode, onViewModeChange, onAddPropertyClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isPropertiesPage = pathname.startsWith('/properties');
  const isDetailPage = /^\/properties\/[^/]+$/.test(pathname);
  
  const propertyId = isDetailPage ? pathname.split('/').pop() : null;
  const property = propertyId ? properties.find(p => p.id === propertyId) : null;

  return (
    <header className={cn(
        "z-50 shadow-sm",
        isPropertiesPage && viewMode === 'map' ? "bg-transparent absolute w-full top-0 bg-gradient-to-b from-black/50 to-transparent" : "bg-card border-b"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {!isPropertiesPage ? (
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                 <h1 className="text-xl font-bold text-primary">Batam Pro</h1>
              </Link>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Heart className="h-5 w-5" />
              </Button>
              <Button onClick={onAddPropertyClick} className="hidden sm:inline-flex bg-primary text-primary-foreground">Post Properti <span className="ml-2 bg-blue-400 text-white text-xs px-2 py-0.5 rounded-full">GRATIS</span></Button>
              <div className="hidden sm:flex items-center gap-1">
                 <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={cn("flex flex-col justify-center p-2 sm:p-4 h-auto")}>
             <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link href="/" className="hidden sm:flex items-center gap-2">
                      <h1 className={cn("text-xl font-bold", viewMode === 'map' ? 'text-white' : 'text-primary')}>Batam Pro</h1>
                  </Link>
                  {onViewModeChange && (
                    <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full">
                      <Button 
                        size="sm"
                        variant={viewMode === 'list' ? 'secondary': 'ghost'}
                        onClick={() => onViewModeChange('list')}
                        className={cn("rounded-full h-8", viewMode === 'list' ? 'text-primary-foreground bg-primary' : 'text-white hover:bg-white/20 hover:text-white')}
                      >
                         <List className="h-4 w-4 sm:mr-2"/>
                         <span className="hidden sm:inline">Daftar</span>
                      </Button>
                      <Button 
                        size="sm"
                        variant={viewMode === 'map' ? 'secondary': 'ghost'}
                        onClick={() => onViewModeChange('map')}
                        className={cn("rounded-full h-8", viewMode === 'map' ? 'text-primary-foreground bg-primary' : 'text-white hover:bg-white/20 hover:text-white')}
                      >
                        <Map className="h-4 w-4 sm:mr-2"/>
                        <span className="hidden sm:inline">Peta</span>
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex-grow hidden md:block">
                    {isDetailPage && property ? (
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push('/properties')}>
                        <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3 overflow-hidden text-white">
                        <span className="font-semibold truncate">{property.location}</span>
                        <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                        <span className="text-sm text-green-400 font-medium">Aktif</span>
                        <Badge variant="secondary" className="text-base font-bold">{formatPrice(property.price)}</Badge>
                        <p className="text-sm text-gray-300 hidden lg:block truncate">
                            {property.type} {property.beds > 0 ? `| ${property.beds} KT` : ''} {property.baths > 0 ? `| ${property.baths} KM` : ''} | LB: {property.buildingArea} m²
                        </p>
                        </div>
                    </div>
                    ) : (
                        showFilters && filters && onFilterChange && <PropertySearchFilter filters={filters} onFilterChange={onFilterChange} viewMode={viewMode}/>
                    )}
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="md:hidden">
                        {showFilters && filters && onFilterChange && (
                             <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className={cn("rounded-full", viewMode === 'map' ? 'bg-white/90' : 'bg-background')}>
                                        <Filter className="mr-2 h-4 w-4"/>
                                        Filter
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="rounded-t-lg">
                                    <SheetHeader>
                                        <SheetTitle>Filter Properti</SheetTitle>
                                        <SheetDescription>
                                            Persempit pencarian Anda untuk menemukan properti yang sempurna.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="p-4">
                                         <PropertySearchFilter filters={filters} onFilterChange={onFilterChange} isMobile />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                    {onAddPropertyClick && (
                      <Button onClick={onAddPropertyClick} variant="outline" className={cn("rounded-full text-primary hover:bg-white hidden sm:flex", viewMode === 'map' ? 'bg-white/90' : 'bg-background')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Properti
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className={cn("hover:bg-white/20 hover:text-white hidden sm:flex", viewMode === 'map' ? 'text-white' : 'text-primary')}>
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className={cn("hover:bg-white/20 hover:text-white hidden sm:flex", viewMode === 'map' ? 'text-white' : 'text-primary')}>
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
