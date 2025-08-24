
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Story() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = sectionRef.current;
      if (element) {
        const { top, height } = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate the progress of scrolling through the component
        const progress = Math.max(0, Math.min(1, 1 - (top + height * 0.8) / windowHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textOpacity = (start: number, end: number) => {
    return Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
  };

  return (
    <section ref={sectionRef} id="story" className="relative py-20 lg:py-32 bg-background h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: scrollProgress > 0.5 ? 1 : 0, backgroundColor: 'hsl(var(--card))' }}>
        </div>

        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[533px] animate-fade-in-up">
          <Image
            src="https://placehold.co/600x800.png"
            alt="A beautiful pet"
            width={600}
            height={800}
            className={cn(
              'absolute inset-0 object-cover rounded-lg transition-opacity duration-slow',
               scrollProgress > 0.55 ? 'opacity-0' : 'opacity-100'
            )}
            data-ai-hint="pet photo"
          />

          <Image
            src="/portfolio/golden_retriever.jpg"
            alt="A beautiful painted portrait of a pet"
            width={600}
            height={800}
            className="absolute inset-0 object-cover rounded-lg"
            style={{
              maskImage: 'url(/brush-mask.svg)',
              maskSize: `${(scrollProgress * 200)}%`,
              maskPosition: 'center',
              WebkitMaskImage: 'url(/brush-mask.svg)',
              WebkitMaskSize: `${(scrollProgress * 400)}%`,
              WebkitMaskPosition: 'center',
            }}
            data-ai-hint="pet portrait"
          />
           <div
            className={cn(
              "absolute -inset-4 md:-inset-8 border-8 rounded-2xl transition-all duration-slow",
              scrollProgress > 0.7 ? 'opacity-100 border-primary' : 'opacity-0 border-transparent'
            )}
            style={{ transform: `scale(${0.9 + scrollProgress * 0.1})`}}
          />
        </div>

        <div className="absolute bottom-10 left-10 max-w-sm text-left">
           <p className="font-headline text-3xl md:text-4xl text-foreground transition-opacity duration-500" style={{ opacity: textOpacity(0.1, 0.3) - textOpacity(0.4, 0.5) }}>
             It starts with a photo, a cherished memory.
           </p>
           <p className="font-headline text-3xl md:text-4xl text-foreground transition-opacity duration-500 absolute top-0 left-0" style={{ opacity: textOpacity(0.4, 0.6) - textOpacity(0.7, 0.8)}}>
             Our artists transform it into a masterpiece.
           </p>
           <p className="font-headline text-3xl md:text-4xl text-foreground transition-opacity duration-500 absolute top-0 left-0" style={{ opacity: textOpacity(0.7, 0.9) }}>
             A timeless heirloom, framed for eternity.
           </p>
        </div>
      </div>
    </section>
  );
}
