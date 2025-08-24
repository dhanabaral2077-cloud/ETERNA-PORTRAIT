"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export function CTA() {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="contact" className="relative py-20 lg:py-32 bg-card overflow-hidden">
       <div className="absolute inset-0 z-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Framed pet portrait on a wall"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          style={{ transform: `translateY(${offsetY * 0.1}px)` }}
          data-ai-hint="framed portrait"
        />
      </div>
      <div className="container relative z-10 max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-xl p-8 md:p-12">
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
