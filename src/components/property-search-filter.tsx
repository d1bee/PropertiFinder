'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import { Input } from './ui/input';

export function PropertySearchFilter() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 items-center bg-card rounded-lg p-2">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input id="location" placeholder="New York" className="pl-10 h-12" />
        </div>
        <div>
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Property Type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="rumah">Rumah</SelectItem>
              <SelectItem value="apartemen">Apartemen</SelectItem>
              <SelectItem value="tanah">Tanah</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="$2K - $10K" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="range1">$2K - $10K</SelectItem>
               <SelectItem value="range2">$10K - $20K</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="3 Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4+">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button variant="outline" className="w-full h-12">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
