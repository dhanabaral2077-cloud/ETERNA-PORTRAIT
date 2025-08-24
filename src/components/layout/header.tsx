import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Header() {
  const navLinks = [
    { href: '#gallery', label: 'Gallery' },
    { href: '#process', label: 'Process' },
    { href: '#story', label: 'Our Story' },
    { href: '#testimonials', 'label': 'Testimonials' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-[72px] items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start">
          <Link href="/" className="text-2xl font-headline font-bold text-foreground">
            Pet Masterpiece
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center space-x-8 font-headline text-base uppercase tracking-[2px]">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative group text-foreground transition-colors hover:text-primary">
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center justify-end gap-4">
           <Button asChild className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
            <Link href="#contact">Order Now</Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full h-full bg-background p-0">
                <div className="flex flex-col items-center justify-center h-full">
                  <nav className="flex flex-col items-center space-y-8">
                    <Link href="/" className="text-3xl font-bold font-headline mb-8">Pet Masterpiece</Link>
                    {navLinks.map((link) => (
                       <SheetTrigger asChild key={link.href}>
                        <Link href={link.href} className="text-xl font-headline uppercase tracking-wider transition-colors hover:text-primary">
                          {link.label}
                        </Link>
                      </SheetTrigger>
                    ))}
                    <Button asChild size="lg" className="mt-8 rounded-full text-lg px-8 py-6">
                        <Link href="#contact">Order Now</Link>
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
