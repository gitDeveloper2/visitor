import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/app/auth-client';

export function useVoteStatus(toolIds: string[]) {
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  return useQuery({
    queryKey: ['voteStatus', toolIds.sort().join(',')],
    queryFn: async () => {
      // Safety check: return empty set if no tool IDs or not authenticated
      if (!Array.isArray(toolIds) || toolIds.length === 0 || !isAuthenticated) {
        return new Set<string>();
      }
      
      // Safety check: ensure we're on the client side
      if (typeof window === 'undefined') {
        return new Set<string>();
      }

      try {
        const res = await fetch('/api/vote/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ toolIds }),
        });

        if (!res.ok) {
          console.error('[useVoteStatus] Failed to fetch vote status:', res.status);
          return new Set<string>();
        }

        const data = await res.json();
        return new Set(data.votedToolIds || []);
      } catch (error) {
        console.error('[useVoteStatus] Error fetching vote status:', error);
        return new Set<string>();
      }
    },
    enabled: isAuthenticated && toolIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
} 