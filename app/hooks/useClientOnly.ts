import { useState, useEffect } from 'react';

/**
 * Custom hook to prevent hydration mismatches
 * Returns true only when component has mounted on the client
 * Use this to conditionally render content that might differ between server and client
 */
export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

/**
 * Hook for safely formatting dates to prevent hydration mismatches
 * Returns consistent date format between server and client
 */
export function useSafeDate(date: Date | string | number) {
  const isClient = useClientOnly();
  
  if (!isClient) {
    // Return a static fallback during SSR
    return '---';
  }
  
  // Only format the date on the client side
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric', 
      day: 'numeric'
    });
  } catch (error) {
    return '---';
  }
}
