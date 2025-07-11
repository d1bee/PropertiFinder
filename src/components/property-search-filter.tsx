'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bed, Building, Home, MapPin, Search } from 'lucide-react';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

export type FilterState = {
    searchTerm: string;
    propertyType: string;
}

interface PropertySearchFilterProps {
    filters: FilterState;
    onFilterChange: (filters: Partial<FilterState>) => void;
}

const propertyTypes = ['Semua', 'Rumah', 'Apartemen', 'Tanah Kosong', 'Gudang', 'Ruko', 'Galangan Kapal', 'Pabrik'];


export function PropertySearchFilter({ filters, onFilterChange }: PropertySearchFilterProps) {
  return (
    <div className="flex items-center gap-2 justify-center w-full">
        <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                id="search" 
                placeholder="Cari berdasarkan lokasi, judul..." 
                className="pl-10 h-10 rounded-full w-full bg-background"
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            />
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full text-muted-foreground">
                    <Building className="mr-2 h-4 w-4" />
                    {filters.propertyType === 'Semua' ? 'Tipe Properti' : filters.propertyType}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Pilih Tipe Properti</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filters.propertyType} onValueChange={(value) => onFilterChange({ propertyType: value })}>
                    {propertyTypes.map(type => (
                        <DropdownMenuRadioItem key={type} value={type}>{type}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

       <Button variant="secondary" className="rounded-full">
            <Home className="mr-2 h-4 w-4" />
            Harga
        </Button>
       <Button variant="secondary" className="rounded-full">
            <Bed className="mr-2 h-4 w-4" />
            Kamar Tidur
        </Button>
    </div>
  );
}
