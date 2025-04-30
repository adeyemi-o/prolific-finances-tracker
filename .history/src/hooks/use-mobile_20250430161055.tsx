import * as React from "react"

// Define comprehensive breakpoints for better responsive design
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const DESKTOP_BREAKPOINT = 1280;
const LARGE_DESKTOP_BREAKPOINT = 1536;

/**
 * Hook to detect if the current viewport is mobile sized
 */
export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Modern way to add event listener
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      // Fallback for older browsers
      mql.addListener(onChange)
    }
    
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        // Fallback for older browsers
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}

/**
 * Hook to detect if the current viewport is tablet sized
 */
export function useTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    }
    
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }
    
    setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isTablet
}

/**
 * Hook to detect if the current viewport is desktop sized
 */
export function useDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px) and (max-width: ${DESKTOP_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT && window.innerWidth < DESKTOP_BREAKPOINT)
    }
    
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }
    
    setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT && window.innerWidth < DESKTOP_BREAKPOINT)
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isDesktop
}

/**
 * Hook to detect if the current viewport is large desktop sized
 */
export function useLargeDesktop() {
  const [isLargeDesktop, setIsLargeDesktop] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    
    const onChange = () => {
      setIsLargeDesktop(window.innerWidth >= DESKTOP_BREAKPOINT)
    }
    
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }
    
    setIsLargeDesktop(window.innerWidth >= DESKTOP_BREAKPOINT)
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isLargeDesktop
}

/**
 * Comprehensive hook that returns the current breakpoint
 * Useful for more complex responsive logic
 */
export function useBreakpoint() {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isDesktop = useDesktop(); 
  const isLargeDesktop = useLargeDesktop();
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isDesktop) return 'desktop';
  if (isLargeDesktop) return 'largeDesktop';
  
  // Default fallback
  return 'desktop';
}

/**
 * Alias for backward compatibility
 * @deprecated Use useMobile instead
 */
export const useIsMobile = useMobile;
