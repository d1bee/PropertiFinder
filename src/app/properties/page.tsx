import { properties } from "@/lib/data";
import { PropertyListings } from "@/components/property-listings";

export default function PropertiesPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return (
        <div className="h-screen w-full relative">
             <PropertyListings properties={properties} apiKey={apiKey} />
        </div>
    );
}
