import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Header() {
  const navLinks = [
    { href: '#gallery', label: 'Gallery' },
    { href: '#process', label: 'Process' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-headline font-bold text-foreground">
          Pet Masterpiece
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
           <Button asChild className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
            <Link href="#contact">Commission Your Portrait</Link>
          </Button>
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
                   <Link href="/" className="text-2xl font-bold font-headline mb-6">Pet Masterpiece</Link>
                  {navLinks.map((link) => (
                     <SheetTrigger asChild key={link.href}>
                      <Link href={link.href} className="text-lg transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </SheetTrigger>
                  ))}
                  <Button asChild size="lg" className="mt-4 rounded-full">
                      <Link href="#contact">Commission Your Portrait</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
