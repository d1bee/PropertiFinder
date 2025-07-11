import { DescriptionGenerator } from "@/components/description-generator";

export default function GenerateDescriptionPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">AI Property Description Generator</h1>
                <p className="text-muted-foreground">
                    Generate compelling property descriptions and feature highlights using AI.
                </p>
            </div>
            <DescriptionGenerator />
        </div>
    );
}
