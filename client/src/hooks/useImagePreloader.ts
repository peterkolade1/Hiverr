import { useEffect } from 'react';

interface PreloadOptions {
  images: string[];
  priority?: boolean;
}

export function useImagePreloader({ images, priority = false }: PreloadOptions) {
  useEffect(() => {
    const preloadImages = () => {
      images.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        if (priority) {
          link.setAttribute('fetchpriority', 'high');
        }
        document.head.appendChild(link);
      });
    };

    // Use requestIdleCallback if available, otherwise fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 100);
    }
  }, [images, priority]);
}