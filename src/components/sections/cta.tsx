"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTA() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-card">
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-background rounded-lg shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground mb-4">Ready to Immortalize Your Pet?</h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground">
              Let's create a beautiful, lasting memory of your furry, feathery, or scaly friend.
            </p>
          </div>

          <div className="text-center pt-4">
            <Button 
              asChild
              size="lg" 
              className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 hover:shadow-xl hover:shadow-amber-400/50 transition-all rounded-full animate-pulse-glow"
            >
              <Link href="#">Commission Your Portrait</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
