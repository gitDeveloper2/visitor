import { useState } from 'react';

export function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { publish: boolean; delete: boolean; revalidate: boolean; edit: boolean };
  }>({});

  const updateLoadingState = (slug: string, key: keyof typeof loadingStates[keyof typeof loadingStates], state: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [slug]: { ...prev[slug], [key]: state },
    }));
  };

  return { loadingStates, updateLoadingState };
}
