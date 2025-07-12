import { Suspense } from 'react';
import { CompareTable } from '@/components/compare-table';
import { BackButton } from '@/components/back-button';

export default function ComparePage() {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <Suspense fallback={<div className="text-center p-12">Loading comparison...</div>}>
                <CompareTable />
            </Suspense>
        </div>
    );
}
