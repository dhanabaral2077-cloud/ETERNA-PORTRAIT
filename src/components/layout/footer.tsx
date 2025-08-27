
"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {

  return (
    <footer className="w-full bg-background border-t animate-fade-in">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col items-center gap-8">
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6 font-headline text-sm uppercase tracking-widest">
            <Link href="/shipping" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Shipping</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
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

          <div className="w-full max-w-lg border-b border-border/50 my-4"></div>

          {/* Copyright & Payment Icons */}
          <div className="text-center">
            <div className="font-headline text-lg tracking-[0.1em] text-foreground mb-4">
              ETERNA PORTRAIT
            </div>
            <p className="text-sm text-muted-foreground">&copy; 2025 Eterna Portrait. All rights reserved.</p>
            <div className="mt-4">
              <Image
                src="/portfolio/Transparent_Trust_Badges.png"
                alt="Accepted payment methods"
                width={300}
                height={50}
                className="mx-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
