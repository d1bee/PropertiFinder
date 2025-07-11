import { PropertyMap } from "@/components/property-map";

export default function MapPage() {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Property Map View</h1>
                <p className="text-muted-foreground">Explore properties on an interactive map</p>
            </div>
            <div className="flex-grow h-[calc(100vh-250px)] rounded-lg overflow-hidden border">
                <PropertyMap />
            </div>
        </div>
    );
}
