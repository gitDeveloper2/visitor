'use client';

import { createContext, useContext, useMemo } from 'react';
import { useVotes } from '@features/votes/hooks/useVotes';

const VotesContext = createContext<Record<string, number> | undefined>(undefined);

export const VotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useVotes();

  const memoizedVotes = useMemo(() => data, [data]);

  return (
    <VotesContext.Provider value={memoizedVotes}>
      {children}
    </VotesContext.Provider>
  );
};

export const useVotesContext = () => useContext(VotesContext);
