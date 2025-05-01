import * as React from "react"

// Define comprehensive breakpoints for better responsive design
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const DESKTOP_BREAKPOINT = 1280;

// Helper hook to manage media query listeners
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    
    const handleChange = () => {
      setMatches(mediaQueryList.matches);
    };

    handleChange(); 

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return !!matches; 
}

/**
 * Hook to detect if the current viewport is mobile sized (max-width: 767px)
 */
export function useMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

/**
 * Hook to detect if the current viewport is tablet sized (min-width: 768px) and (max-width: 1023px)
 */
export function useTablet() {
  return useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`);
}

/**
 * Hook to detect if the current viewport is desktop sized (min-width: 1024px) and (max-width: 1279px)
 */
export function useDesktop() {
   return useMediaQuery(`(min-width: ${TABLET_BREAKPOINT}px) and (max-width: ${DESKTOP_BREAKPOINT - 1}px)`);
}

/**
 * Hook to detect if the current viewport is large desktop sized (min-width: 1280px)
 */
export function useLargeDesktop() {
  return useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
}

/**
 * Alias for backward compatibility
 * @deprecated Use useMobile instead
 */
export const useIsMobile = useMobile;
