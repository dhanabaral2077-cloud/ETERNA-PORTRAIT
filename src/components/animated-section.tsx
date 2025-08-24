// src/components/animated-section.tsx
'use client';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-700 ease-out motion-safe:transform',
        isIntersecting
          ? 'opacity-100 motion-safe:translate-y-0'
          : 'opacity-0 motion-safe:translate-y-8',
        className
      )}
    >
      {children}
    </div>
  );
}
