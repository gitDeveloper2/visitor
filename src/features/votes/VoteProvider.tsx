'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authClient } from '@/app/auth-client';

// Use the launches system to get vote data instead of deprecated snapshot endpoint
const VOTING_API_URL = process.env.NEXT_PUBLIC_VOTES_URL || 'https://voting-ebon-seven.vercel.app';

type VoteSnapshot = {
  totals: Record<string, number>;
  userVotes: string[];
};

type VoteContextValue = {
  getCount: (toolId: string) => number;
  hasVoted: (toolId: string) => boolean;
  vote: (toolId: string, unvote?: boolean) => Promise<void>;
  updateVoteCounts: (apps: any[]) => void;
};

const VoteContext = createContext<VoteContextValue | undefined>(undefined);

export function VoteProvider({ children }: { children: React.ReactNode }) {
  const { data } = authClient.useSession();
  
  // Type assertion to include votingToken (same pattern as VoteButton)
  const sessionWithToken = data as typeof data & {
    session: { votingToken?: string } & typeof data.session;
  };
  
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  // Note: VoteProvider now gets data from AppsMainPage to avoid duplicate API calls
  // The launch data is passed down from the parent component that already fetched it
  
  // --- Stable getters ---
  const getCount = useCallback(
    (toolId: string) => totals[toolId] ?? 0,
    [totals]
  );

  const hasVoted = useCallback(
    (toolId: string) => userVotes.has(toolId),
    [userVotes]
  );
  
  // Method to update vote counts from external source (like AppsMainPage)
  const updateVoteCounts = useCallback((apps: any[]) => {
    const voteCounts: Record<string, number> = {};
    apps.forEach(app => {
      if (app._id && typeof app.totalVotes === 'number') {
        voteCounts[app._id] = app.totalVotes;
      }
    });
    setTotals(voteCounts);
  }, []);

  // --- Vote / Unvote action ---
  const vote = useCallback(
    async (toolId: string, unvote = false) => {
      if (!sessionWithToken?.session?.votingToken) {
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
        const token = encodeURIComponent(sessionWithToken.session.votingToken);
        const url = `${VOTING_API_URL}/api/vote?token=${token}&toolId=${toolId}${
          willUnvote ? '&unvote=true' : ''
        }`;

        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          console.warn(`Vote request failed: ${res.status}`);
          // Rollback on failure
          setTotals(prevTotals);
          setUserVotes(prevUserVotes);
          return;
        }
        
        // Update with actual count from API response
        const data = await res.json();
        if (data.count !== undefined) {
          setTotals(prev => ({ ...prev, [toolId]: data.count }));
        }
      } catch (err) {
        console.warn('Vote request failed', err);
        // Rollback on failure
        setTotals(prevTotals);
        setUserVotes(prevUserVotes);
      }
    },
    [totals, userVotes, sessionWithToken?.session?.votingToken]
  );

  // Expose all methods through context
  const value = useMemo(() => ({
    getCount,
    hasVoted,
    vote,
    updateVoteCounts
  }), [getCount, hasVoted, vote, updateVoteCounts]);

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

export function useVoteContext() {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error('useVoteContext must be used within VoteProvider');
  return ctx;
}
