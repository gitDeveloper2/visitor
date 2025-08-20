'use client';

import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Tooltip,
  Button,
} from '@mui/material';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';
import { useState, useEffect, useMemo } from 'react';
import { useVoteMutation } from '@/features/votes/hooks/useVoteMutations';
import { authClient } from '@/app/auth-client';
import { isExternalVoteApi } from '@/features/votes/constants';
import { useVotesContext } from '@/features/providers/VotesContext';

type Props = {
  toolId: string;
  initialVotes: number;
};

export default function VoteButton({
  toolId,
  initialVotes,
}: Props) {
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const voteMutation = useVoteMutation();
  const votes = useVotesContext(); // Get global vote data

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lockout, setLockout] = useState(false);
  const [voted, setVoted] = useState(false);
  const [allowRender, setAllowRender] = useState(false);

  // Check if we have live votes for this tool
  const hasLiveVote = votes && toolId in votes;

  // Allow render after a short delay to prevent flash of initial votes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAllowRender(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Get current vote count from global context or fall back to initial
  const currentVotes = hasLiveVote ? votes![toolId]! : allowRender ? initialVotes : undefined;
  
  // Check if user has voted by comparing current votes with initial votes (like reference project)
  const hasVoted = currentVotes !== undefined && currentVotes > initialVotes;

  // Log session and authentication state
  useEffect(() => {
    console.log('[VoteButton] Session Debug:', {
      toolId,
      isAuthenticated,
      isPending,
      sessionKeys: session ? Object.keys(session) : [],
      userKeys: session?.user ? Object.keys(session.user) : [],
      userId: session?.user?.id,
      votingToken: (session as any)?.votingToken ? 'present' : 'missing',
      sessionVotingToken: (session as any)?.session?.votingToken ? 'present' : 'missing',
      sessionVoteToken: (session as any)?.voteToken ? 'present' : 'missing',
      isExternalVoteApi,
      initialVotes,
      currentVotes,
      hasVoted,
      globalVotesAvailable: !!votes,
    });
  }, [session, isAuthenticated, isPending, toolId, initialVotes, currentVotes, hasVoted, votes]);

  // Log vote mutation state changes
  useEffect(() => {
    console.log('[VoteButton] Vote Mutation State:', {
      toolId,
      isPending: voteMutation.isPending,
      isSuccess: voteMutation.isSuccess,
      isError: voteMutation.isError,
      error: voteMutation.error,
      data: voteMutation.data,
    });
  }, [voteMutation.isPending, voteMutation.isSuccess, voteMutation.isError, voteMutation.error, voteMutation.data, toolId]);

  // Update voted state when vote count changes (like reference project)
  useEffect(() => {
    if (!isAuthenticated || !hasLiveVote) return;
    console.log('[VoteButton] Vote count changed:', {
      toolId,
      hasVoted,
      currentVotes,
      initialVotes,
      hasLiveVote,
    });
    setVoted(hasVoted);
  }, [votes, toolId, initialVotes, isAuthenticated, hasLiveVote, hasVoted, currentVotes]);

  const handleVote = () => {
    console.log('[VoteButton] Vote Click:', {
      toolId,
      isAuthenticated,
      isPending: voteMutation.isPending,
      lockout,
      voted,
      currentVotes,
      userId: session?.user?.id,
      votingToken: (session as any)?.votingToken ? 'present' : 'missing',
      isExternalVoteApi,
    });

    if (!isAuthenticated) {
      console.warn('[VoteButton] Blocked: Not authenticated');
      setSnackbarOpen(true);
      return;
    }

    if (voteMutation.isPending) {
      console.warn('[VoteButton] Blocked: Mutation pending');
      return;
    }

    if (lockout) {
      console.warn('[VoteButton] Blocked: Lockout active');
      return;
    }

    console.log('[VoteButton] Starting vote mutation:', { toolId });
    setLockout(true);

    voteMutation.mutate(toolId, {
      onSettled: (data, error) => {
        console.log('[VoteButton] Mutation settled:', {
          toolId,
          data,
          error,
          success: !error,
        });
        setTimeout(() => setLockout(false), 3000);
      },
    });
  };

  return (
    <>
      <Tooltip
        title={
          !isAuthenticated
            ? 'Please log in to vote'
            : voteMutation.isPending
            ? 'Processing...'
            : lockout
            ? 'Please wait...'
            : ''
        }
      >
        <Box
          onClick={handleVote}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            border: '1px solid',
            borderColor: voted ? 'primary.main' : 'divider',
            color: voted ? 'primary.main' : 'text.secondary',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            fontSize: '0.8rem',
            cursor:
              voteMutation.isPending || lockout || !isAuthenticated
                ? 'default'
                : 'pointer',
            boxShadow: 1,
            pointerEvents:
              voteMutation.isPending || lockout || !isAuthenticated
                ? 'none'
                : 'auto',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          {voted ? (
            <ThumbUpAlt sx={{ fontSize: 18 }} />
          ) : (
            <ThumbUpAltOutlined sx={{ fontSize: 18 }} />
          )}
          {currentVotes !== undefined ? (
            <Typography variant="body2" color="inherit">
              {currentVotes}
            </Typography>
          ) : (
            <CircularProgress size={14} />
          )}
        </Box>
      </Tooltip>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Please log in to vote"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}