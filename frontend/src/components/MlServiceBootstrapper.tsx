'use client';

import { useEffect } from 'react';

export function MlServiceBootstrapper() {
  useEffect(() => {
    void fetch('/api/ml/auth/bootstrap', { method: 'POST' }).catch((error) => {
      console.error('Failed to bootstrap ML service auth:', error);
    });
  }, []);

  return null;
}
