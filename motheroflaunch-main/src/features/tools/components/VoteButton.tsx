'use client';

import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Tooltip,
} from '@mui/material';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';
import { useState, useEffect, useMemo } from 'react';
import { useVoteMutation } from '@features/votes/hooks/useVoteMutations';
import { authClient } from '../../../../auth-client';

type Props = {
  toolId: string;
  initialVotes: number;
  launchDate: string;
  votingDurationHours?: number;
  votingFlushed?: boolean;
  votes: Record<string, number> | undefined;
};

export default function VoteButton({
  toolId,
  initialVotes,
  launchDate,
  votingDurationHours = 24,
  votingFlushed = true,
  votes,
}: Props) {
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const voteMutation = useVoteMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lockout, setLockout] = useState(false);
  const [voted, setVoted] = useState(false);
  const [allowRender, setAllowRender] = useState(false);

  const hasLiveVote = votes && toolId in votes;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAllowRender(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const voteCount =
    hasLiveVote ? votes![toolId]! : allowRender ? initialVotes : undefined;

  const votingOver = useMemo(() => {
    if (votingFlushed) return true;
    const endTime =
      new Date(launchDate).getTime() + votingDurationHours * 3600_000;
    return Date.now() > endTime;
  }, [launchDate, votingDurationHours, votingFlushed]);

  useEffect(() => {
    if (!isAuthenticated || !hasLiveVote) return;
    setVoted(votes![toolId]! > initialVotes);
  }, [votes, toolId, initialVotes, isAuthenticated, hasLiveVote]);

  const handleVote = () => {
    console.log("voting")
    if (!isAuthenticated) {
      setSnackbarOpen(true);
      return;
    }
  
    if (voteMutation.isPending || lockout || votingOver) return;
    setLockout(true);
    console.log("atuhed")

    voteMutation.mutate(toolId, {
      onSettled: () => {
        setTimeout(() => setLockout(false), 3000);
      },
    });
  };

  return (
    <>
      <Tooltip title={votingOver ? 'Voting has ended' : ''}>
        <Box
          onClick={handleVote}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            border: '1px solid',
            borderColor: voted ? 'primary.main' : 'divider',
            // backgroundColor: voted ? 'primary.light' : 'background.paper',
            color: voted ? 'primary.main' : 'text.secondary',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            fontSize: '0.8rem',
            cursor:
              voteMutation.isPending || lockout || votingOver
                ? 'default'
                : 'pointer',
            boxShadow: 1,
            pointerEvents:
              voteMutation.isPending || lockout || votingOver
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
          {voteCount !== undefined ? (
            <Typography variant="body2" color="inherit">
              {voteCount}
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
