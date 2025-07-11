import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Batam Pro</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">Temukan Properti Impian Anda untuk Dijual dan Disewa di Batam dan Kepulauan Riau</p>
        <Button asChild size="lg">
          <Link href="/properties">Mulai Mencari</Link>
        </Button>
      </div>
    </div>
  );
}
