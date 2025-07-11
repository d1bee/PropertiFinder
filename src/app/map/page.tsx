import { PropertyMap } from "@/components/property-map";
import { properties } from "@/lib/data";

export default function MapPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Property Map View</h1>
                <p className="text-muted-foreground">Explore properties on an interactive map</p>
            </div>
            <div className="flex-grow h-[calc(100vh-250px)] rounded-lg overflow-hidden border">
                {apiKey ? (
                    <PropertyMap properties={properties} apiKey={apiKey} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <p className="text-center text-destructive">
                            Google Maps API key is missing. <br />
                            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
