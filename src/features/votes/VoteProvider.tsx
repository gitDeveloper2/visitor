'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { authClient } from '@/app/auth-client';

const VOTING_API_URL =
  process.env.NEXT_PUBLIC_VOTES_URL || 'https://voting-ebon-seven.vercel.app';

// -----------------
// Types
// -----------------
type ToolVotes = {
  count: number;
  hasVoted: boolean;
};

type VoteState = Record<string, ToolVotes>;

type VoteContextValue = {
  getCount: (toolId: string) => number;
  hasVoted: (toolId: string) => boolean;
  vote: (toolId: string, unvote?: boolean) => Promise<void>;
  setVotes: (apps: any[], snapshot?: Record<string, number>, userVotes?: string[]) => void;
  snapshotLoaded: boolean;
};

// -----------------
// Helpers
// -----------------
function normalizeUserVotes(ids: string[] = []): Record<string, boolean> {
  return Object.fromEntries(ids.map((id) => [id, true]));
}

// -----------------
// Context
// -----------------
const VoteContext = createContext<VoteContextValue | undefined>(undefined);

export function VoteProvider({ children }: { children: React.ReactNode }) {
  const { data } = authClient.useSession();
  const token = (data as any)?.session?.votingToken;

  const [votes, setVotesState] = useState<VoteState>({});
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);

  // --- Getters ---
  const getCount = useCallback(
    (toolId: string) => votes[toolId]?.count ?? 0,
    [votes]
  );

  const hasVoted = useCallback(
    (toolId: string) => votes[toolId]?.hasVoted ?? false,
    [votes]
  );

  // --- Unified setter ---
  const setVotes = useCallback(
    (apps: any[], snapshot?: Record<string, number>, userVoteIds: string[] = []) => {
      const normalizedUserVotes = normalizeUserVotes(userVoteIds);

      const next: VoteState = {};

      (snapshot
        ? Object.entries(snapshot).map(([id, count]) => ({
            _id: id,
            count,
          }))
        : apps.map((app) => ({
            _id: app._id?.toString(),
            count:
              app.currentVotes ??
              app.totalVotes ??
              app.votes ??
              app.stats?.votes ??
              0,
          }))
      ).forEach(({ _id, count }) => {
        if (!_id) return;
        next[_id] = {
          count: Number(count) || 0,
          hasVoted: normalizedUserVotes[_id] ?? false,
        };
      });

      setVotesState(next);

      if (snapshot) setSnapshotLoaded(true);
    },
    []
  );

  // --- Vote/unvote ---
  const vote = useCallback(
    async (toolId: string, unvote = false) => {
      if (!token) return;

      try {
        const url = `${VOTING_API_URL}/api/vote?token=${encodeURIComponent(
          token
        )}&toolId=${toolId}${unvote ? '&unvote=true' : ''}`;

        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        const count = data.count ?? votes[toolId]?.count ?? 0;

        setVotesState((prev) => ({
          ...prev,
          [toolId]: {
            count,
            hasVoted: !unvote,
          },
        }));
      } catch (err) {
        console.warn('❌ Vote request error:', err);
      }
    },
    [token, votes]
  );

  // --- Context value ---
  const value = useMemo(
    () => ({
      getCount,
      hasVoted,
      vote,
      setVotes,
      snapshotLoaded,
    }),
    [getCount, hasVoted, vote, setVotes, snapshotLoaded]
  );

  return (
    <VoteContext.Provider value={value}>{children}</VoteContext.Provider>
  );
}

export function useVoteContext() {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error('useVoteContext must be used within VoteProvider');
  return ctx;
}
