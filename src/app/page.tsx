import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Properti Batam dan Kepri</h1>
        <p className="text-xl text-muted-foreground">Temukan Properti Impian Anda di Batam dan Kepulauan Riau</p>
        <p className="max-w-md mx-auto">
          Ini adalah halaman utama sementara. Pengalaman pencarian properti utama telah dipindahkan.
        </p>
        <Button asChild size="lg">
          <Link href="/properties">Mulai Mencari</Link>
        </Button>
      </div>
    </div>
  );
}
