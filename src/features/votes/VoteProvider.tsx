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
  updateVoteCounts: (apps: any[], snapshot?: Record<string, number>) => void;
  updateUserVoteStatus: (toolId: string, hasVoted: boolean) => void;
  snapshotLoaded: boolean;
};

const VoteContext = createContext<VoteContextValue | undefined>(undefined);

export function VoteProvider({ children }: { children: React.ReactNode }) {
  const { data } = authClient.useSession();
  
  // Type assertion to include votingToken (same pattern as VoteButton)
  const sessionWithToken = data as typeof data & {
    session: { votingToken?: string } & typeof data.session;
  };
  
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);

  console.log('🗳️ VoteProvider render:', {
    hasSession: !!data,
    hasVotingToken: !!sessionWithToken?.session?.votingToken,
    totalsCount: Object.keys(totals).length,
    userVotesCount: Object.keys(userVotes).length,
    snapshotLoaded,
    totals: totals,
    userVotes: userVotes
  });

  // --- Stable getters ---
  const getCount = useCallback(
    (toolId: string) => totals[toolId] ?? 0,
    [totals]
  );

  const hasVoted = useCallback(
    (toolId: string) => userVotes[toolId] === true,
    [userVotes]
  );
  
  // Method to update vote counts from external source (like AppsMainPage)
  const updateVoteCounts = useCallback((apps: any[], snapshot?: Record<string, number>) => {
    console.log('🔄 VoteProvider.updateVoteCounts called with:', {
      appsCount: apps.length,
      hasSnapshot: !!snapshot,
      snapshotKeys: snapshot ? Object.keys(snapshot).length : 0,
      snapshot: snapshot,
      apps: apps.map(app => ({
        id: app._id,
        name: app.name,
        totalVotes: app.totalVotes,
        currentVotes: app.currentVotes,
        votes: app.votes
      }))
    });

    const voteCounts: Record<string, number> = {};
    
    // If we have snapshot data, use it as the primary source (current Redis votes)
    if (snapshot) {
      console.log('📊 Using snapshot data for vote counts');
      Object.entries(snapshot).forEach(([appId, voteCount]) => {
        voteCounts[appId] = voteCount;
        console.log(`📊 Snapshot: ${appId}: ${voteCount} votes`);
      });
    } else {
      // Fallback to individual app data
      console.log('📊 Using individual app data for vote counts');
      apps.forEach(app => {
        if (app._id) {
          // Prioritize currentVotes (from Redis), then fallback to totalVotes/votes
          const voteCount = app.currentVotes ?? app.totalVotes ?? app.votes ?? app.stats?.votes ?? 0;
          voteCounts[app._id] = voteCount;
          console.log(`📊 App data: ${app.name || app._id}: ${voteCount} votes`);
        }
      });
    }
    
    console.log('📈 Final vote counts:', voteCounts);
    setTotals(voteCounts);
    
    // Mark snapshot as loaded if we received snapshot data
    if (snapshot) {
      setSnapshotLoaded(true);
      console.log('✅ Snapshot loaded into VoteProvider');
    }
  }, []);

  // Method to update user vote status for a specific app (called by VoteButton)
  const updateUserVoteStatus = useCallback((toolId: string, hasVoted: boolean) => {
    console.log(`🗳️ VoteProvider: Updating user vote status for ${toolId}: ${hasVoted}`);
    setUserVotes(prev => ({
      ...prev,
      [toolId]: hasVoted
    }));
  }, []);

  // --- Vote / Unvote action ---
  const vote = useCallback(
    async (toolId: string, unvote = false) => {
      if (!sessionWithToken?.session?.votingToken) {
        console.error('No voting token available');
        return;
      }

      const prevTotals = totals;
      const prevUserVotes = { ...userVotes };

      const alreadyVoted = userVotes[toolId] === true;
      const willUnvote = unvote || alreadyVoted;

      // Optimistic update
      setTotals({
        ...totals,
        [toolId]: (totals[toolId] ?? 0) + (willUnvote ? -1 : 1),
      });
      const updatedVotes = { ...userVotes };
      if (willUnvote) {
        delete updatedVotes[toolId];
      } else {
        updatedVotes[toolId] = true;
      }
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
    updateVoteCounts,
    updateUserVoteStatus,
    snapshotLoaded
  }), [getCount, hasVoted, vote, updateVoteCounts, updateUserVoteStatus, snapshotLoaded]);

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

export function useVoteContext() {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error('useVoteContext must be used within VoteProvider');
  return ctx;
}
