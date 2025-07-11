
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

export type FilterState = {
  searchTerm: string;
  propertyType: string;
  priceSort: string;
  buildingArea: string;
  landArea: string;
};

interface PropertySearchFilterProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  isMobile?: boolean;
  viewMode?: 'map' | 'list';
}

const propertyTypes = ['Semua', 'Rumah', 'Apartemen', 'Tanah Kosong', 'Gudang', 'Ruko', 'Galangan Kapal', 'Pabrik'];
const priceSortOptions = ['Default', 'Harga Terendah', 'Harga Tertinggi'];
const areaRanges = ['Semua', '0-100', '101-200', '201-500', '501-1000', '1000+'];

export function PropertySearchFilter({ filters, onFilterChange, isMobile = false, viewMode = 'map' }: PropertySearchFilterProps) {
  const getDropdownLabel = (value: string, defaultValue: string) => {
    if (value === 'Semua' || value === 'Default' || !value) {
      return defaultValue;
    }
    if (value.includes('+')) {
      return `> ${value.replace('+', '')} m²`;
    }
     if (value.includes('-')) {
      return `${value} m²`;
    }
    return value;
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <div className="relative">
           <Label htmlFor="search-mobile">Pencarian</Label>
           <Search className="absolute left-3 top-10 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-mobile"
              placeholder="Cari lokasi, judul..."
              className="pl-10 mt-2"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            />
        </div>
        
        <div>
            <Label>Tipe Properti</Label>
            <Select value={filters.propertyType} onValueChange={(value) => onFilterChange({ propertyType: value })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
                <SelectContent>
                    {propertyTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label>Urutkan Harga</Label>
            <Select value={filters.priceSort} onValueChange={(value) => onFilterChange({ priceSort: value })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Urutkan" /></SelectTrigger>
                <SelectContent>
                    {priceSortOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label>Luas Bangunan</Label>
                <Select value={filters.buildingArea} onValueChange={(value) => onFilterChange({ buildingArea: value })}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder="Pilih Luas" /></SelectTrigger>
                    <SelectContent>
                        {areaRanges.map((range) => <SelectItem key={range} value={range}>{range === '1000+' ? '> 1000' : range}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label>Luas Tanah</Label>
                <Select value={filters.landArea} onValueChange={(value) => onFilterChange({ landArea: value })}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder="Pilih Luas" /></SelectTrigger>
                    <SelectContent>
                         {areaRanges.map((range) => <SelectItem key={range} value={range}>{range === '1000+' ? '> 1000' : range}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex items-center gap-2 justify-center w-full">
      <div className="relative flex-grow max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="search"
          placeholder="Cari berdasarkan lokasi, judul..."
          className={cn("pl-10 h-10 rounded-full w-full", viewMode === 'map' ? 'bg-white/90' : 'bg-secondary')}
          value={filters.searchTerm}
          onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("rounded-full text-primary", viewMode === 'map' ? 'bg-white/90' : 'bg-secondary')}>
            {getDropdownLabel(filters.propertyType, 'Tipe Properti')}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Pilih Tipe Properti</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={filters.propertyType} onValueChange={(value) => onFilterChange({ propertyType: value })}>
            {propertyTypes.map((type) => (
              <DropdownMenuRadioItem key={type} value={type}>{type}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("rounded-full text-primary", viewMode === 'map' ? 'bg-white/90' : 'bg-secondary')}>
             {getDropdownLabel(filters.priceSort, 'Harga')}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Urutkan Berdasarkan Harga</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={filters.priceSort} onValueChange={(value) => onFilterChange({ priceSort: value })}>
            {priceSortOptions.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>{option}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("rounded-full text-primary", viewMode === 'map' ? 'bg-white/90' : 'bg-secondary')}>
             {getDropdownLabel(filters.buildingArea, 'Luas Bangunan')}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter Luas Bangunan (m²)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={filters.buildingArea} onValueChange={(value) => onFilterChange({ buildingArea: value })}>
            {areaRanges.map((range) => (
              <DropdownMenuRadioItem key={range} value={range}>{range === '1000+' ? '> 1000' : range}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("rounded-full text-primary", viewMode === 'map' ? 'bg-white/90' : 'bg-secondary')}>
             {getDropdownLabel(filters.landArea, 'Luas Tanah')}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter Luas Tanah (m²)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={filters.landArea} onValueChange={(value) => onFilterChange({ landArea: value })}>
            {areaRanges.map((range) => (
              <DropdownMenuRadioItem key={range} value={range}>{range === '1000+' ? '> 1000' : range}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
