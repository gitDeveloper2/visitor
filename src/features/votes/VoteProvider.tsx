'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { buildVoteUrl } from './constants';
import { authClient } from '@/app/auth-client';

type VoteSnapshot = {
  totals: Record<string, number>;
  userVotes: string[];
};

type VoteContextValue = {
  getCount: (toolId: string) => number;
  hasVoted: (toolId: string) => boolean;
  vote: (toolId: string, unvote?: boolean) => Promise<void>;
};

const VoteContext = createContext<VoteContextValue | undefined>(undefined);

export function VoteProvider({ children }: { children: React.ReactNode }) {
  const { data } = authClient.useSession(); // { user, session }
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  // --- Fetch snapshot once session is loaded ---
  useEffect(() => {
    if (!data?.session?.votingToken) return;

    const fetchSnapshot = async () => {
      try {
        const token = encodeURIComponent(data.session.votingToken);
        const url = `${buildVoteUrl('/api/snapshot')}?token=${token}`;

        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error(`Snapshot failed: ${res.status}`);

        const payload: VoteSnapshot = await res.json();
        setTotals(payload?.totals ?? {});
        setUserVotes(new Set(payload?.userVotes ?? []));
      } catch (err) {
        console.error('Snapshot fetch failed', err);
      }
    };

    fetchSnapshot();
  }, [data?.session?.votingToken]);

  // --- Stable getters ---
  const getCount = useCallback(
    (toolId: string) => totals[toolId] ?? 0,
    [totals]
  );

  const hasVoted = useCallback(
    (toolId: string) => userVotes.has(toolId),
    [userVotes]
  );

  // --- Vote / Unvote action ---
  const vote = useCallback(
    async (toolId: string, unvote = false) => {
      if (!data?.session?.votingToken) {
        console.error('No voting token available');
        return;
      }

      const prevTotals = totals;
      const prevUserVotes = new Set(userVotes);

      const alreadyVoted = userVotes.has(toolId);
      const willUnvote = unvote || alreadyVoted;

      // Optimistic update
      setTotals({
        ...totals,
        [toolId]: (totals[toolId] ?? 0) + (willUnvote ? -1 : 1),
      });
      const updatedVotes = new Set(userVotes);
      if (willUnvote) updatedVotes.delete(toolId);
      else updatedVotes.add(toolId);
      setUserVotes(updatedVotes);

      try {
        const token = encodeURIComponent(data.session.votingToken);
        const url = `${buildVoteUrl('/api/vote')}?token=${token}&toolId=${toolId}${
          willUnvote ? '&unvote=true' : ''
        }`;

        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error(`Vote request failed: ${res.status}`);
      } catch (err) {
        console.error('Vote request failed', err);
        // Rollback on failure
        setTotals(prevTotals);
        setUserVotes(prevUserVotes);
      }
    },
    [totals, userVotes, data?.session?.votingToken]
  );

  const value = useMemo(() => ({ getCount, hasVoted, vote }), [
    getCount,
    hasVoted,
    vote,
  ]);

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

export function useVoteContext() {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error('useVoteContext must be used within VoteProvider');
  return ctx;
}
