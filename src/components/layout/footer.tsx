import { Paintbrush } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <Paintbrush className="h-6 w-6 text-primary" />
          <p className="text-xl font-bold text-primary font-headline tracking-wider">
            Pet Masterpiece
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
          <p>&copy; {new Date().getFullYear()} Pet Masterpiece. All rights reserved.</p>
          <div className="hidden md:block">|</div>
          <p>Crafted with love for our furry friends</p>
        </div>
      </div>
    </footer>
  );
}
