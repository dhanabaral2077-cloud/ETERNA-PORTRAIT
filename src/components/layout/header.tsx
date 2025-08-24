
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#gallery', label: 'Gallery' },
    { href: '#process', label: 'Process' },
    { href: '#story', label: 'Our Story' },
    { href: '#testimonials', 'label': 'Testimonials' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-out",
        isScrolled 
            ? "h-[60px] border-border bg-background/80 backdrop-blur-lg" 
            : "h-14 md:h-[72px] border-transparent bg-background/95 supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container flex h-full items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start">
          <Link href="/" className="text-2xl font-headline font-bold text-foreground">
            Pet Masterpiece
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center space-x-8 font-headline text-base uppercase tracking-[2px]">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative group text-foreground transition-colors duration-200 ease-out hover:text-primary">
                <span>{link.label}</span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center justify-end gap-4">
           <Button asChild className="hidden md:inline-flex rounded-full transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5">
            <Link href="#contact">Order Now</Link>
          </Button>
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <div className="relative h-6 w-6">
                    <Menu className={cn("absolute h-6 w-6 transition-transform duration-500 ease-in-out", isMenuOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100')} />
                    <X className={cn("absolute h-6 w-6 transition-transform duration-500 ease-in-out", isMenuOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0')} />
                  </div>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full h-full bg-background p-0 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
                <div className="flex flex-col items-center justify-center h-full">
                  <nav className="flex flex-col items-center space-y-8">
                    <Link href="/" className="text-3xl font-bold font-headline mb-8" onClick={() => setIsMenuOpen(false)}>Pet Masterpiece</Link>
                    {navLinks.map((link, index) => (
                       <SheetClose asChild key={link.href}>
                        <Link 
                            href={link.href} 
                            className="text-2xl font-headline uppercase tracking-wider transition-all duration-300 ease-in-out hover:text-primary animate-fade-in-up"
                            style={{ animationDelay: `${150 + index * 100}ms` }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                   <div className="absolute bottom-8 w-full px-8">
                    <SheetClose asChild>
                        <Button 
                            asChild 
                            size="lg" 
                            className="w-full rounded-full text-lg py-6"
                        >
                            <Link href="#contact" onClick={() => setIsMenuOpen(false)}>Order Now</Link>
                        </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
