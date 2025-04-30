import * as React from "react"

// Enhanced breakpoint system
const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Legacy breakpoints for backward compatibility
const MOBILE_BREAKPOINT = BREAKPOINTS.md;
const TABLET_BREAKPOINT = BREAKPOINTS.lg;
const DESKTOP_BREAKPOINT = BREAKPOINTS.xl;

/**
 * Hook to detect if the current viewport matches a specific breakpoint
 */
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS, direction: 'max' | 'min' = 'max') {
  const [matches, setMatches] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mediaQuery = direction === 'max' 
      ? `(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`
      : `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
    
    const mql = window.matchMedia(mediaQuery);
    
    const onChange = () => {
      setMatches(mql.matches);
    };
    
    // Set initial value
    setMatches(mql.matches);
    
    // Modern way to add event listener
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // Fallback for older browsers
      mql.addListener(onChange);
    }
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // Fallback for older browsers
        mql.removeListener(onChange);
      }
    };
  }, [breakpoint, direction]);

  return matches;
}

/**
 * Hook to detect if the current viewport is mobile sized
 */
export function useMobile() {
  return useBreakpoint('md');
}

/**
 * Hook to detect if the current viewport is tablet sized
 */
export function useTablet() {
  const isMinMd = useBreakpoint('md', 'min');
  const isMaxLg = useBreakpoint('lg');
  
  return isMinMd && isMaxLg;
}

/**
 * Hook to detect if the current viewport is desktop sized
 */
export function useDesktop() {
  return useBreakpoint('lg', 'min');
}

/**
 * Hook that returns the current breakpoint category
 * @returns 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 */
export function useCurrentBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof BREAKPOINTS>('md');
  
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.xs) {
        setBreakpoint('xs');
      } else if (width < BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else if (width < BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (width < BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (width < BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return breakpoint;
}

/**
 * Alias for backward compatibility
 * @deprecated Use useMobile instead
 */
export const useIsMobile = useMobile;
