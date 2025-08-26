
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

          {/* Copyright and Payment Icons */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">&copy; 2025 Pet Masterpiece. All rights reserved.</p>
            <div className="flex justify-center">
                 <Image 
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg" 
                    alt="Accepted Payment Methods: American Express, Mastercard, Visa, Discover, PayPal"
                    width={200}
                    height={50}
                    className="opacity-70"
                  />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
