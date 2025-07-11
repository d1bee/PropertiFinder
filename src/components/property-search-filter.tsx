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

export function PropertySearchFilter() {
  return (
    <div className="flex items-center gap-2">
       <Button variant="secondary" className="rounded-full">
            <Home className="mr-2 h-4 w-4" />
            Distance 2-5 miles
        </Button>
       <Button variant="secondary" className="rounded-full">
            <Bed className="mr-2 h-4 w-4" />
            Apartments
        </Button>
        <Button variant="outline" className="rounded-full text-muted-foreground">
            <Building className="mr-2 h-4 w-4" />
            Property Type
        </Button>
         <Button variant="outline" className="rounded-full text-muted-foreground">
            SQ.FT
        </Button>
        <div className="relative ml-auto">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="location" placeholder="Lincoln Center for the Performing Arts" className="pl-10 h-12 rounded-full w-80" />
        </div>
    </div>
  );
}
