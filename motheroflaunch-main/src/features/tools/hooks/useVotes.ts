import { buildVoteUrl } from '@features/votes/constants';
// hooks/useVoteCounts.ts
import { useQuery } from '@tanstack/react-query';

export function useVoteCounts(toolIds: string[]) {
  return useQuery({
    queryKey: ['votes', toolIds.sort()],
    queryFn: async () => {
      const params = new URLSearchParams();
      toolIds.forEach(id => params.append('ids[]', id));

      const res = await fetch(buildVoteUrl(`/api/vote/batch-count?${params.toString()}`));
      if (!res.ok) throw new Error('Failed to fetch votes');

      const { counts } = await res.json();
      return counts as Record<string, number>;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}



