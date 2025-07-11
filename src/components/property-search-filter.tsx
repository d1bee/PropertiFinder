'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from './ui/slider';
import { useState } from 'react';
import { Label } from './ui/label';
import { Search } from 'lucide-react';

const formatPrice = (value: number) => {
  if (value >= 1e9) {
    return `Rp ${(value / 1e9).toFixed(1)} Miliar`;
  }
  return `Rp ${(value / 1e6)} Juta`;
};

export function PropertySearchFilter() {
  const [priceRange, setPriceRange] = useState([500000000, 10000000000]);

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2 lg:col-span-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" placeholder="e.g. Jakarta, Bali, Bandung" />
          </div>
          <div>
            <Label htmlFor="type">Tipe Properti</Label>
            <Select>
              <SelectTrigger id="type">
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Tipe</SelectItem>
                <SelectItem value="rumah">Rumah</SelectItem>
                <SelectItem value="apartemen">Apartemen</SelectItem>
                <SelectItem value="tanah">Tanah</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
             <Label>Rentang Harga</Label>
             <div className="mt-2 text-center text-sm font-medium text-primary">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
             </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={50000000000}
              min={100000000}
              step={100000000}
              className="mt-2"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Cari
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
