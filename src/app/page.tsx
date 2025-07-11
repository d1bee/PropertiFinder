import { PropertyCard } from '@/components/property-card';
import { PropertySearchFilter } from '@/components/property-search-filter';
import { properties } from '@/lib/data';

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Properti Finder</h1>
        <p className="text-xl text-muted-foreground">Find Your Next Dream Home in Indonesia</p>
      </header>

      <PropertySearchFilter />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
