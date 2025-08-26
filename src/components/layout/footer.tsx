
"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const openPayPalPopup = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = 'https://www.paypal.com/webapps/mpp/paypal-popup';
    const windowName = 'WIPaypal';
    const windowFeatures = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1060, height=700';
    window.open(url, windowName, windowFeatures);
  };

  return (
    <footer className="w-full bg-background border-t animate-fade-in">
      <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">&copy; 2025 Pet Masterpiece. All rights reserved.</p>
        </div>
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
        <div className="shrink-0">
            <a 
              href="https://www.paypal.com/webapps/mpp/paypal-popup" 
              title="How PayPal Works" 
              onClick={openPayPalPopup}
            >
              <Image 
                src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" 
                alt="PayPal Acceptance Mark"
                width={165}
                height={40}
              />
            </a>
        </div>
      </div>
    </footer>
  );
}
