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

      return data;
    },

    onMutate: async (toolId) => {
      console.log('[useVoteMutations] onMutate:', { toolId });
      return { toolId };
    },

    onSuccess: (data, _toolId, context) => {
      const toolId = context?.toolId;
      console.log('[useVoteMutations] onSuccess:', {
        toolId,
        data,
      });
      
      if (!toolId) return;

      // Update the global votes context (matches reference project)
      queryClient.setQueryData<Record<string, number>>(['votes'], (old) => {
        const current = old?.[toolId] ?? 0;
        const newCount = data.alreadyVoted ? current + 1 : Math.max(0, current - 1);
        
        console.log('[useVoteMutations] Updating vote count:', {
          toolId,
          oldCount: current,
          newCount,
          alreadyVoted: data.alreadyVoted,
        });
        
        return {
          ...old,
          [toolId]: newCount,
        } as Record<string, number>;
      });
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