import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t animate-fade-in">
      <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">&copy; 2025 Pet Masterpiece. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4 font-headline text-sm uppercase tracking-widest">
          <Link href="/privacy" className="relative text-muted-foreground transition-colors hover:text-primary group">
            <span>Privacy</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
          <Link href="/refunds" className="relative text-muted-foreground transition-colors hover:text-primary group">
            <span>Refunds</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="relative text-muted-foreground transition-colors hover:text-primary group">
            <span>Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
