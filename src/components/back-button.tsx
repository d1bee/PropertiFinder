
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Suspense } from 'react';

function BackButtonComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleClick = () => {
    if (from === 'map' || from === 'list') {
      router.push('/properties');
    } else {
      router.back();
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} className="mb-4">
      <ChevronLeft className="h-4 w-4 mr-2" />
      Kembali
    </Button>
  );
}

export function BackButton() {
  return (
    <Suspense fallback={<div className="h-10 mb-4" />}>
      <BackButtonComponent />
    </Suspense>
  )
}
