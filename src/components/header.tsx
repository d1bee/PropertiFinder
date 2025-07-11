'use client';

import Link from 'next/link';
import { Heart, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PropertySearchFilter } from './property-search-filter';

const navLinks = [
  { href: '/buy', label: 'For Buyers' },
  { href: '/rent', label: 'For Tenants' },
  { href: '/owners', label: 'For Owners' },
];

export function Header() {
  const pathname = usePathname();
  const showFilters = pathname === '/properties';

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-bold text-foreground">
                MAPDATA.
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      {link.label}
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="bg-green-100 text-green-700 hover:bg-green-200">Pay Rent</Button>
            <Button className="bg-primary text-primary-foreground">Post Property <span className="ml-2 bg-blue-400 text-white text-xs px-2 py-0.5 rounded-full">FREE</span></Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {showFilters && <PropertySearchFilter />}
      </div>
    </header>
  );
}
