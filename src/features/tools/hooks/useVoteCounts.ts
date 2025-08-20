// hooks/useVoteCounts.ts
import { useQuery } from '@tanstack/react-query';
import { buildVoteUrl } from '@/features/votes/constants';

export function useVoteCounts(toolIds: string[]) {
  return useQuery({
    queryKey: ['votes', toolIds.sort().join(',')],
    queryFn: async () => {
      if (!toolIds.length) return {} as Record<string, number>;
      const params = new URLSearchParams();
      toolIds.forEach(id => params.append('ids[]', id));
      const res = await fetch(buildVoteUrl(`/api/vote/batch-count?${params.toString()}`));
      if (!res.ok) throw new Error('Failed to fetch votes');
      const { counts } = await res.json();
      return counts as Record<string, number>;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}