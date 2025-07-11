'use client';

import Link from 'next/link';
import { Home, Map, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map View', icon: Map },
  { href: '/generate-description', label: 'AI Description', icon: Sparkles },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-2xl font-bold text-foreground">
              Properti<span className="text-primary">Finder</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button key={link.href} variant="ghost" asChild
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Link href={link.href} className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
