'use server';
import { generatePropertyDescription, type GeneratePropertyDescriptionInput, type GeneratePropertyDescriptionOutput } from "@/ai/flows/generate-property-description";

export async function handleGenerateDescription(
    input: GeneratePropertyDescriptionInput
): Promise<GeneratePropertyDescriptionOutput> {
    try {
        const result = await generatePropertyDescription(input);
        return result;
    } catch (error) {
        console.error("Error generating description:", error);
        throw new Error("Failed to generate description. Please try again.");
    }
}
