"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export function CTA() {
  const [offsetY, setOffsetY] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2 });
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "Ready to Immortalize Your Pet?";

  const handleScroll = () => {
    if (ref.current) {
        const top = ref.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        // Start parallax when section is in view
        if (top < windowHeight && top > -ref.current.offsetHeight) {
            setOffsetY(window.scrollY);
        }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isIntersecting) {
      setDisplayedText(''); // Reset on re-intersection
      let i = 0;
      const type = () => {
        if (i < fullText.length) {
          setDisplayedText((prev) => prev + fullText.charAt(i));
          i++;
          timeoutId = setTimeout(type, 50);
        }
      };
      type();
    } else {
        setDisplayedText('');
    }
    return () => clearTimeout(timeoutId);
  }, [isIntersecting, fullText]);
  

  const imageScrollEffect = () => {
    if (!ref.current) return 0;
    const { top, height } = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollPercent = Math.max(0, Math.min(1, (windowHeight - top) / (windowHeight + height)));
    // Adjust this multiplier for more/less parallax
    return (scrollPercent - 0.5) * 40; 
  }

  return (
    <section id="contact" ref={ref} className="relative py-20 lg:py-32 bg-card overflow-hidden">
       <div className="absolute inset-0 z-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Framed pet portrait on a wall"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          style={{ transform: `translateY(${imageScrollEffect()}px)` }}
          data-ai-hint="framed portrait"
        />
      </div>
      <div className="container relative z-10 max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground mb-4 h-24">
              {displayedText}
              <span className="animate-ping">|</span>
            </h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground">
              Let's create a beautiful, lasting memory of your furry, feathery, or scaly friend.
            </p>
          </div>

          <div className="text-center pt-4">
            <Button 
              asChild
              size="lg" 
              className="rounded-full bg-primary text-primary-foreground px-10 py-4 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all animate-pulse-glow"
            >
              <Link href="#">Commission Your Portrait</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
