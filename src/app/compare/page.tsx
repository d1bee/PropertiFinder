import { Suspense } from 'react';
import { CompareTable } from '@/components/compare-table';
import { BackButton } from '@/components/back-button';

export default function ComparePage() {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <BackButton />
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Perbandingan Properti</h1>
                    <p className="text-muted-foreground">Bandingkan fitur-fitur properti pilihan Anda secara berdampingan.</p>
                </div>
            </div>
            <Suspense fallback={<div className="text-center p-12">Loading comparison...</div>}>
                <CompareTable />
            </Suspense>
        </div>
    );
}
