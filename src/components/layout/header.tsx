import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Header() {
  const navLinks = [
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#process', label: 'Process' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary font-headline tracking-wider">
          Pet Masterpiece
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-lg font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col items-center space-y-6 pt-12">
                <Link href="/" className="text-2xl font-bold text-primary font-headline tracking-wider mb-6">
                  Pet Masterpiece
                </Link>
                {navLinks.map((link) => (
                   <SheetTrigger asChild key={link.href}>
                    <Link href={link.href} className="text-xl transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </SheetTrigger>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
