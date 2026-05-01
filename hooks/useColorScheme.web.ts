import { useEffect, useState } from 'react';
const { useColorScheme: useRNColorScheme } = require('react-native') as { useColorScheme: () => 'light' | 'dark' | null | undefined };

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
