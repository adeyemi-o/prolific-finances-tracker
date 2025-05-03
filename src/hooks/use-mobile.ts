
import { useState, useEffect } from "react";

// Define comprehensive breakpoints for better responsive design
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const DESKTOP_BREAKPOINT = 1280;

/**
 * Optimized hook to manage media query listeners with debouncing
 * @param query Media query string
 * @returns Boolean indicating if the query matches
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Skip if no window or matchMedia (SSR)
    if (typeof window === 'undefined' || !window.matchMedia) return;

    let debounceTimer: number | null = null;
    const mediaQueryList = window.matchMedia(query);
    
    const handleChange = () => {
      // Debounce to prevent multiple rapid changes
      if (debounceTimer) window.clearTimeout(debounceTimer);
      
      debounceTimer = window.setTimeout(() => {
        setMatches(mediaQueryList.matches);
      }, 50); // Small debounce time
    };

    // Set initial value without debounce
    setMatches(mediaQueryList.matches);

    // Modern way to add event listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      // Cleanup
      if (debounceTimer) window.clearTimeout(debounceTimer);
      
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook to detect if the current viewport is mobile sized
 */
export function useMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

/**
 * Hook to detect if the current viewport is tablet sized
 */
export function useTablet() {
  return useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`);
}

/**
 * Hook to detect if the current viewport is desktop sized
 */
export function useDesktop() {
  return useMediaQuery(`(min-width: ${TABLET_BREAKPOINT}px) and (max-width: ${DESKTOP_BREAKPOINT - 1}px)`);
}

/**
 * Hook to detect if the current viewport is large desktop sized
 */
export function useLargeDesktop() {
  return useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
}

/**
 * Alias for backward compatibility
 * @deprecated Use useMobile instead
 */
export const useIsMobile = useMobile;
