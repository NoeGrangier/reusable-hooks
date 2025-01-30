import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export const useOnScreen = (ref: RefObject<HTMLDivElement | null>, rootMargin = '0px', threshold = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current === null) return;

    const element = ref.current;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, rootMargin, threshold]);

  return isVisible;
};
