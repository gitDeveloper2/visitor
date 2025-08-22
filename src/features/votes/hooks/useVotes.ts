import { useQuery } from '@tanstack/react-query';
import { buildVoteUrl } from '../constants';

export const useVotes = () => {
  return useQuery({
    queryKey: ['votes'],
    queryFn: async () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[useVotes] Fetching all votes...');
      }
      const res = await fetch(buildVoteUrl('/api/votes/all'));
      if (!res.ok) throw new Error('Failed to fetch votes');
      const data = (await res.json()) as Record<string, number>;
      if (process.env.NODE_ENV !== 'production') {
        const sample = Object.entries(data).slice(0, 5);
        console.log('[useVotes] Votes fetched', {
          totalTools: Object.keys(data).length,
          sample,
        });
      }
      return data;
    },
    // Fetch once on first mount; cache forever; never auto-refetch.
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Allow initial fetch when no cache exists; once cached (fresh), it won't refetch
    refetchOnMount: true,
    retry: 1,
  });
};