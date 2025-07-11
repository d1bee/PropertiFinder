'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { handleGenerateDescription } from '@/app/generate-description/actions';
import type { GeneratePropertyDescriptionOutput } from '@/ai/flows/generate-property-description';
import { CheckCircle, Sparkles, Wand2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  propertySpecifications: z.string().min(50, 'Please provide at least 50 characters for specifications.'),
  image: z.any().refine((files) => files?.length == 1, 'Image is required.'),
});

type FormValues = z.infer<typeof formSchema>;

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export function DescriptionGenerator() {
  const [result, setResult] = useState<GeneratePropertyDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertySpecifications: '',
      image: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const imageFile = values.image[0] as File;
      const imageDataUri = await fileToDataUri(imageFile);

      toast({
        title: 'Generating Description...',
        description: 'The AI is working its magic. Please wait.',
      });

      const response = await handleGenerateDescription({
        propertySpecifications: values.propertySpecifications,
        imageDataUri: imageDataUri,
      });

      setResult(response);
      toast({
        title: 'Success!',
        description: 'Your new property description is ready.',
        variant: 'default',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      form.setValue('image', event.target.files);
    } else {
      setPreviewImage(null);
      form.setValue('image', undefined);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Enter the property specs and upload a primary photo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="propertySpecifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Specifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 3 bedrooms, 2 bathrooms, modern kitchen, large garden, swimming pool, located in a quiet neighborhood..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Primary Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {previewImage && (
                <div className="mt-4">
                  <Image src={previewImage} alt="Preview" width={200} height={200} className="rounded-lg object-cover" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Description
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>The AI-generated description and features will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Sparkles className="h-12 w-12 mb-4 animate-pulse" />
              <p>Thinking...</p>
            </div>
          )}
          {result && !isLoading && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{result.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Highlighted Features</h3>
                <ul className="space-y-2">
                  {result.highlightedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center border-2 border-dashed rounded-lg">
                <p>Your generated content will be displayed here once you submit the form.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
