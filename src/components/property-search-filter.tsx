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
import { Building, Home, LandPlot, Search } from 'lucide-react';
import { Input } from './ui/input';

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
}

const propertyTypes = ['Semua', 'Rumah', 'Apartemen', 'Tanah Kosong', 'Gudang', 'Ruko', 'Galangan Kapal', 'Pabrik'];
const priceSortOptions = ['Default', 'Harga Terendah', 'Harga Tertinggi'];
const areaRanges = ['Semua', '0-100', '101-200', '201-500', '501-1000', '1000+'];

export function PropertySearchFilter({ filters, onFilterChange }: PropertySearchFilterProps) {
  const getDropdownLabel = (value: string, defaultValue: string) => value === 'Semua' || value === 'Default' ? defaultValue : value;

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
            {getDropdownLabel(filters.propertyType, 'Tipe Properti')}
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
          <Button variant="outline" className="rounded-full text-muted-foreground">
            <Home className="mr-2 h-4 w-4" />
            {getDropdownLabel(filters.priceSort, 'Harga')}
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
          <Button variant="outline" className="rounded-full text-muted-foreground">
            <Home className="mr-2 h-4 w-4" />
            {getDropdownLabel(filters.buildingArea, 'Luas Bangunan')}
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
          <Button variant="outline" className="rounded-full text-muted-foreground">
            <LandPlot className="mr-2 h-4 w-4" />
            {getDropdownLabel(filters.landArea, 'Luas Tanah')}
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

    