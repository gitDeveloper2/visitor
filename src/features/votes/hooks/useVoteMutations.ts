import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildVoteUrl, isExternalVoteApi } from '../constants';
import { authClient } from '@/app/auth-client';
import { IVoteResponse } from '@/types/IVoteResponse';

type VoteContext = { toolId: string };

export const useVoteMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  return useMutation<IVoteResponse, Error, string, VoteContext>({
    mutationFn: async (toolId: string) => {
      const url = buildVoteUrl('/api/vote');
      
      console.log('[useVoteMutations] Starting vote mutation:', {
        toolId,
        url,
        isExternalVoteApi,
        sessionKeys: session ? Object.keys(session) : [],
        userKeys: session?.user ? Object.keys(session.user) : [],
        userId: session?.user?.id,
      });

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (isExternalVoteApi) {
        // Match the reference project's token access pattern
        const accessToken = (session?.session as any)?.votingToken;
        
        console.log('[useVoteMutations] External API - Token Debug:', {
          toolId,
          accessToken: accessToken ? 'present' : 'missing',
          sessionSessionVotingToken: (session as any)?.session?.votingToken ? 'present' : 'missing',
          userId: session?.user?.id,
          isExternalVoteApi,
        });

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
          console.log('[useVoteMutations] Using token:', accessToken.substring(0, 20) + '...');
        } else {
          console.error('[useVoteMutations] No voting token found in session');
          throw new Error('Missing access token');
        }
      } else {
        console.log('[useVoteMutations] Using local API - no auth header needed');
      }

      console.log('[useVoteMutations] Making API request:', {
        toolId,
        url,
        method: 'POST',
        headers,
        body: { toolId },
      });

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ toolId }),
      });

      console.log('[useVoteMutations] API response:', {
        toolId,
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        url: res.url,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[useVoteMutations] API error response:', {
          toolId,
          status: res.status,
          statusText: res.statusText,
          errorText,
        });
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error((errorData as any)?.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('[useVoteMutations] API success response:', {
        toolId,
        data,
      });

      // Transform the response to match the expected format
      return {
        success: true,
        voted: data.alreadyVoted ? true : undefined,
        unvoted: !data.alreadyVoted ? true : undefined,
        votes: data.votes,
        alreadyVoted: data.alreadyVoted,
      };
    },

    onMutate: async (toolId) => {
      console.log('[useVoteMutations] onMutate - optimistic update:', { toolId });
      
      // Get current vote count
      const currentVotes = queryClient.getQueryData<Record<string, number>>(['votes']);
      const currentCount = currentVotes?.[toolId] ?? 0;
      
      // Get current vote status to determine if voting or unvoting
      const voteStatusQueries = queryClient.getQueryCache().findAll({ queryKey: ['voteStatus'] });
      let hasVoted = false;
      for (const query of voteStatusQueries) {
        const statusData = query.state.data as Set<string>;
        if (statusData?.has(toolId)) {
          hasVoted = true;
          break;
        }
      }
      
      // Calculate new count optimistically
      const newCount = hasVoted ? Math.max(0, currentCount - 1) : currentCount + 1;
      
      console.log('[useVoteMutations] Optimistic update:', {
        toolId,
        currentCount,
        hasVoted,
        newCount,
        operation: hasVoted ? 'unvote' : 'vote'
      });
      
      // Optimistically update the votes cache
      queryClient.setQueryData<Record<string, number>>(['votes'], (old) => ({
        ...old,
        [toolId]: newCount,
      }));
      
      // Optimistically update vote status
      voteStatusQueries.forEach(query => {
        const key = query.queryKey;
        queryClient.setQueryData(key, (old: Set<string>) => {
          const newSet = new Set(old);
          if (hasVoted) {
            newSet.delete(toolId);
          } else {
            newSet.add(toolId);
          }
          return newSet;
        });
      });
      
      return { toolId, previousCount: currentCount, wasVoted: hasVoted };
    },

    onSuccess: (data, toolId, context) => {
      console.log('[useVoteMutations] Vote API success - keeping optimistic update:', {
        toolId,
        data,
        context
      });
      // Do nothing - keep the optimistic update as the permanent state
      // Never overwrite with server response
    },

    onError: (error, toolId, context) => {
      console.error('[useVoteMutations] onError:', {
        toolId,
        error,
        errorMessage: (error as any)?.message,
        context,
      });
    },
  });
};