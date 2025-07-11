import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Properti Finder</h1>
        <p className="text-xl text-muted-foreground">Find Your Next Dream Home in Indonesia</p>
        <p className="max-w-md mx-auto">
          This is the temporary home page. The main property search experience has been moved.
        </p>
        <Button asChild size="lg">
          <Link href="/properties">Start Searching</Link>
        </Button>
      </div>
    </div>
  );
}
