import { useEffect, useState } from "react";
import { useLocation } from "wouter";

/**
 * Custom hook to track navigation history and provide back navigation
 * Stores the previous location and allows users to go back
 */
export function useHistory() {
  const [location, setLocation] = useLocation();
  const [previousLocation, setPreviousLocation] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Store previous location when current location changes
    if (previousLocation !== location) {
      setPreviousLocation(location);
      setCanGoBack(true);
    }
  }, [location, previousLocation]);

  const goBack = () => {
    if (previousLocation && previousLocation !== location) {
      setLocation(previousLocation);
    } else {
      // If there's no previous location, go to home
      setLocation("/");
    }
  };

  return {
    currentLocation: location,
    previousLocation,
    canGoBack,
    goBack,
  };
}

/**
 * Alternative implementation using browser history API
 * This is more reliable for tracking actual browser history
 */
export function useBrowserHistory() {
  const [, setLocation] = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if browser can go back in history
    // Note: Due to browser security, window.history.length is not always reliable
    // but we can use it as a rough indicator
    setCanGoBack(window.history.length > 1);
  }, []);

  const goBack = () => {
    // Use native browser back navigation
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home if can't go back
      setLocation("/");
    }
  };

  return {
    canGoBack,
    goBack,
  };
}
