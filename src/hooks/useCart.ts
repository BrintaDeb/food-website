'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export function useCart() {
  const [mounted, setMounted] = useState(false);
  const store = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    ...store,
    safeTotalCount: mounted ? store.totalCount : 0,
    isMounted: mounted
  };
}
