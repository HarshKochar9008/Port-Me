
import { useEffect, useState, useRef, RefObject } from 'react';

// Hook to check if element is in viewport
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.15,
      ...options
    });

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);

  return [ref, isInView];
}

// Hook for staggered animations
export function useStaggeredAnimation(count: number, baseDelay: number = 100): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay * i);
}

// Hook for smooth scrolling to element
export function useSmoothScroll() {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return { scrollToElement };
}
