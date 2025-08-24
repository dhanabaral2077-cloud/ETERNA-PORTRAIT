import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">&copy; 2025 Pet Masterpiece. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Refunds</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
