
import { useEffect, useState } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkMobile);
    checkMobile();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function useTablet() {
  const [isTablet, setIsTablet] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTablet = () => {
      setIsTablet(window.innerWidth < 1024);
    };

    window.addEventListener("resize", checkTablet);
    checkTablet();

    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  return isTablet;
}
