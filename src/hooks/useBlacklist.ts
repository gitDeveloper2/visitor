// hooks/useBlacklist.ts
import { useState } from 'react';

export function useBlacklist() {
  const [blacklistedUrls, setBlacklistedUrls] = useState<Set<string>>(new Set());

  const addToBlacklist = (url: string) => {
    setBlacklistedUrls((prev) => new Set(prev).add(url));
  };

  const removeFromBlacklist = (url: string) => {
    setBlacklistedUrls((prev) => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  const isBlacklisted = (url: string) => blacklistedUrls.has(url);

  return { blacklistedUrls, addToBlacklist, removeFromBlacklist, isBlacklisted };
}
