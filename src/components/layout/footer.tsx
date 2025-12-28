"use client";

import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast({ title: "Subscribed!", description: "You have joined our newsletter." });
      setEmail("");
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-background border-t animate-fade-in">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col items-center gap-8">

          {/* Newsletter Section */}
          <div className="w-full max-w-md text-center space-y-4 mb-4">
            <h3 className="font-headline text-2xl font-bold">Join the Eterna Family</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe for exclusive offers, new art style drops, and pet care tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Subscribe"}
              </Button>
            </form>
          </div>

          {/* Navigation Links */}
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 font-headline text-sm uppercase tracking-widest">
            <Link href="/contact" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/shipping" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Shipping</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/guide/photos" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Photo Guide</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/guide/styles" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Art Styles</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/materials" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Our Materials</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/refunds" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Refunds</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/reviews" className="relative text-muted-foreground transition-colors hover:text-primary group">
              <span>Reviews</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <Link href="https://x.com/EternaPortrait" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link href="https://www.instagram.com/eter.naportrait/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.02.049 1.717.209 2.328.444a4.69 4.69 0 011.702 1.113 4.69 4.69 0 011.113 1.702c.235.611.395 1.308.444 2.328.047 1.024.06 1.378.06 3.808s-.013 2.784-.06 3.808c-.049 1.02-.209 1.717-.444 2.328a4.69 4.69 0 01-1.113 1.702 4.69 4.69 0 01-1.702 1.113c-.611.235-1.308.395-2.328.444-1.024.047-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.02-.049-1.717-.209-2.328-.444a4.69 4.69 0 01-1.702-1.113 4.69 4.69 0 01-1.113-1.702c-.235-.611-.395-1.308-.444-2.328-.047-1.024-.06-1.378-.06-3.808s.013-2.784.06-3.808c.049-1.02.209-1.717.444-2.328a4.69 4.69 0 011.113-1.702 4.69 4.69 0 011.702-1.113c.611-.235 1.308-.395 2.328-.444 1.024-.047 1.378-.06 3.808-.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.339-9.87a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="https://www.facebook.com/people/Eterna-Portrait/61580466892802/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="https://www.tiktok.com/@eternaportrait" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.81 2.89 2.89 0 011.1.22v-3.4a6.28 6.28 0 00-1.1-.12 6.29 6.29 0 00 0 12.57 6.29 6.29 0 004.78-2.07 6.29 6.29 0 001.51-4.46V8.43a8.27 8.27 0 004.82 1.55V6.69z" />
              </svg>
            </Link>
            <Link href="https://www.pinterest.com/eternaportrait/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489-.093-.783-.179-1.983.037-2.837.196-.771 1.256-4.828 1.256-4.828s-.32-.642-.32-1.591c0-1.491.865-2.604 1.941-2.604.914 0 1.356.687 1.356 1.509 0 .92-.584 2.295-.885 3.567-.251 1.062.531 1.929 1.575 1.929 1.891 0 3.345-1.991 3.345-4.861 0-2.541-1.825-4.317-4.431-4.317-3.016 0-4.786 2.264-4.786 4.601 0 .912.351 1.891.789 2.424.087.105.149.197.107.305-.031.079-.101.242-.146.312-.064.098-.204.119-.297.073-1.389-.685-2.242-2.837-2.242-4.567 0-3.345 2.432-6.419 7.013-6.419 3.678 0 6.537 2.622 6.537 6.128 0 3.651-2.304 6.591-5.502 6.591-1.077 0-2.087-.561-2.432-1.222 0 0-.531 2.023-.66 2.519-.24.91-.885 2.052-1.317 2.746C9.432 21.945 10.678 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="w-full max-w-lg border-b border-border/50 my-4"></div>

          {/* Logo, Description, Copyright & Payment Icons */}
          <div className="text-center">
            <div className="mb-4">
              <Image
                src="/portfolio/Eterna_Portrait_Logo_Gold_Transparent.png"
                alt="Eterna Portrait Logo"
                width={240}
                height={80}
                className="mx-auto"
                priority
              />
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Transform your pet’s photo into timeless, handcrafted art. Our museum-grade portraits, crafted with unparalleled care, are designed to be cherished for generations.
            </p>
            <p className="text-sm text-muted-foreground">&copy; 2025 Eterna Portrait. All rights reserved.</p>
            <div className="mt-4">
              <Image
                src="/portfolio/Trust_Badges_Transparent_Gold.png"
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