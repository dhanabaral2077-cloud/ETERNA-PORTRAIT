// src/hooks/use-intersection-observer.ts
'use client';

import { useEffect, useRef, useState } from 'react';

type IntersectionObserverOptions = {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
};

export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0.1, root = null, rootMargin = '0px', triggerOnce = true } = options;
  const targetRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            if (triggerOnce && targetRef.current) {
              observer.unobserve(targetRef.current);
            }
          } else {
            if (!triggerOnce) {
              setIsIntersecting(false);
            }
          }
        });
      },
      { threshold, root, rootMargin }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [targetRef, threshold, root, rootMargin, triggerOnce]);

  return [targetRef, isIntersecting];
}
