import * as React from "react"

// Define breakpoints based on modern device standards
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Backward compatibility with existing code
export const MOBILE_BREAKPOINT = BREAKPOINTS.md;
export const TABLET_BREAKPOINT = BREAKPOINTS.lg;

/**
 * Hook to detect if the current viewport is mobile sized
 */
export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Modern way to add event listener
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // Fallback for older browsers
      mql.addListener(onChange);
    }
    
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // Fallback for older browsers
        mql.removeListener(onChange);
      }
    };
  }, []);

  return !!isMobile;
}

/**
 * Hook to detect if the current viewport is tablet sized
 */
export function useTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`);
    
    const onChange = () => {
      setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT);
    };
    
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
    }
    
    setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT);
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, []);

  return !!isTablet;
}

/**
 * Hook to detect if the current viewport is desktop sized
 */
export function useDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);
    
    const onChange = () => {
      setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT);
    };
    
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
    }
    
    setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT);
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, []);

  return !!isDesktop;
}

/**
 * General hook to check if viewport matches a specific breakpoint
 */
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);
  
  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
    
    const onChange = () => {
      setMatches(mql.matches);
    };
    
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
    }
    
    setMatches(mql.matches);
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, [breakpoint]);
  
  return !!matches;
}

/**
 * Alias for backward compatibility
 * @deprecated Use useMobile instead
 */
export const useIsMobile = useMobile;
