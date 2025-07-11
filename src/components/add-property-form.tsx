
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Property } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

const propertyTypes = ['Rumah', 'Apartemen', 'Tanah Kosong', 'Gudang', 'Ruko', 'Galangan Kapal', 'Pabrik'] as const;

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  location: z.string().min(5, { message: 'Location must be at least 5 characters.' }),
  type: z.enum(propertyTypes),
  price: z.coerce.number().min(1, { message: 'Price must be greater than 0.' }),
  beds: z.coerce.number().min(0).optional().default(0),
  baths: z.coerce.number().min(0).optional().default(0),
  buildingArea: z.coerce.number().min(0).optional().default(0),
  landArea: z.coerce.number().min(0).optional().default(0),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  features: z.string().min(3, { message: 'Please list at least one feature.' }),
  // For simplicity, we'll just ask for one image URL
  images: z.string().url({ message: 'Please enter a valid image URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPropertyFormProps {
  onSubmit: (data: Omit<Property, 'id' | 'coordinates'>) => void;
  onCancel: () => void;
}

export function AddPropertyForm({ onSubmit, onCancel }: AddPropertyFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      type: 'Rumah',
      price: 0,
      beds: 0,
      baths: 0,
      buildingArea: 0,
      landArea: 0,
      description: '',
      features: '',
      images: 'https://placehold.co/600x400.png',
    },
  });

  const handleSubmit = (values: FormValues) => {
    const propertyData = {
      ...values,
      features: values.features.split(',').map(f => f.trim()),
      images: [values.images],
    };
    onSubmit(propertyData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Add New Property</CardTitle>
            <CardDescription>Fill in the details for the new property. Click "Add Property" when you're done.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Modern Villa with Pool" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Batam Center, Batam" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem><FormLabel>Price (IDR)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1500000000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="beds" render={({ field }) => (
                        <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="baths" render={({ field }) => (
                        <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="buildingArea" render={({ field }) => (
                        <FormItem><FormLabel>Building Area (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="landArea" render={({ field }) => (
                        <FormItem><FormLabel>Land Area (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the property..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="features" render={({ field }) => (
                    <FormItem><FormLabel>Features (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., Swimming Pool, Garden, Garage" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="images" render={({ field }) => (
                    <FormItem><FormLabel>Main Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Add Property</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

    