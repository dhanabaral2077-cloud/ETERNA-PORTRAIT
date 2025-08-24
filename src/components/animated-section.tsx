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
  const [ref, isIntersecting] = useIntersectionObserver({ triggerOnce: true });

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-700 ease-out',
        isIntersecting ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
