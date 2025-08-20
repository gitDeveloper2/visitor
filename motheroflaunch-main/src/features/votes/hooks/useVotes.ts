// hooks/useVotes.ts
import { useQuery } from '@tanstack/react-query';
import { buildVoteUrl } from '../constants';

export const useVotes = () => {
  return useQuery({
    queryKey: ['votes'],
    queryFn: async () => {
      const res = await fetch(buildVoteUrl('/api/votes/all'));
      if (!res.ok) throw new Error('Failed to fetch votes');
      return res.json() as Promise<Record<string, number>>;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
