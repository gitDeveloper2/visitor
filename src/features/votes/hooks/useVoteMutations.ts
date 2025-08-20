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

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (isExternalVoteApi) {
        const accessToken = (session?.session as any)?.votingToken;
        if (!accessToken) throw new Error('Missing access token');
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ toolId }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({} as any));
        throw new Error((error as any)?.error || 'Voting failed');
      }

      return res.json();
    },

    onMutate: async (toolId) => {
      return { toolId };
    },

    onSuccess: (data, _toolId, context) => {
      const toolId = context?.toolId;
      if (!toolId) return;

      queryClient.setQueryData<Record<string, number>>(['votes'], (old) => {
        const current = old?.[toolId] ?? 0;
        return {
          ...old,
          [toolId]: data.alreadyVoted ? current + 1 : Math.max(0, current - 1),
        } as Record<string, number>;
      });
    },
  });
};