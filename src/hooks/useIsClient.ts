/**
 * Hook to detect if component is running on client side
 * Prevents hydration mismatches for client-only features
 */

import { useEffect, useState } from 'react';

export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}