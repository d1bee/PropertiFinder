
'use client';

import { useSearchParams } from 'next/navigation';
import { properties, type Property } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
};

const exportToCsv = (properties: Property[]) => {
    if (properties.length === 0) return;

    const headers = ['ID', 'Title', 'Type', 'Location', 'Price (IDR)', 'Bedrooms', 'Bathrooms', 'Building Area (m²)', 'Land Area (m²)', 'Features'];
    const rows = properties.map(p => [
        p.id,
        `"${p.title.replace(/"/g, '""')}"`,
        p.type,
        `"${p.location.replace(/"/g, '""')}"`,
        p.price,
        p.beds,
        p.baths,
        p.buildingArea,
        p.landArea,
        `"${p.features.join(', ').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "property_comparison.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
};

export default function ComparePage() {
    const searchParams = useSearchParams();
    const ids = searchParams.get('ids')?.split(',') || [];
    const selectedProperties = properties.filter(p => ids.includes(p.id));

    const handleExport = () => {
        exportToCsv(selectedProperties);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <BackButton />
                    <h1 className="text-3xl font-bold tracking-tight">Perbandingan Properti</h1>
                    <p className="text-muted-foreground">Bandingkan fitur-fitur properti pilihan Anda secara berdampingan.</p>
                </div>
                <Button onClick={handleExport} disabled={selectedProperties.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Ekspor ke Excel
                </Button>
            </div>

            {selectedProperties.length > 0 ? (
                 <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">Fitur</TableHead>
                                        {selectedProperties.map(p => (
                                            <TableHead key={p.id} className="font-semibold">{p.title}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Harga</TableCell>
                                        {selectedProperties.map(p => <TableCell key={p.id}>{formatPrice(p.price)}</TableCell>)}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Lokasi</TableCell>
                                        {selectedProperties.map(p => <TableCell key={p.id}>{p.location}</TableCell>)}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Tipe</TableCell>
                                        {selectedProperties.map(p => <TableCell key={p.id}>{p.type}</TableCell>)}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Kamar Tidur</TableCell>
                                        {selectedProperties.map(p => <TableCell key={p.id}>{p.beds > 0 ? p.beds : 'N/A'}</TableCell>)}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Kamar Mandi</TableCell>
                                        {selectedProperties.map(p => <TableCell key={p.id}>{p.baths > 0 ? p.baths : 'N/A'}</TableCell>)}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Luas Bangunan</TableCell>
                                        {selectedProperties.map(p => <TableCell key={p.id}>{p.buildingArea > 0 ? `${p.buildingArea} m²` : 'N/A'}</TableCell>)}
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className="font-medium">Luas Tanah</TableCell>
                                        {selectedProperties.map(p => <TableCell key={p.id}>{p.landArea > 0 ? `${p.landArea} m²` : 'N/A'}</TableCell>)}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Fitur Utama</TableCell>
                                        {selectedProperties.map(p => (
                                            <TableCell key={p.id}>
                                                <ul className="list-disc list-inside">
                                                    {p.features.map((f, i) => <li key={i}>{f}</li>)}
                                                </ul>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="text-center py-12">
                     <CardHeader>
                        <CardTitle>Tidak Ada Properti Dipilih</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Silakan kembali ke halaman sebelumnya dan pilih beberapa properti untuk dibandingkan.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
