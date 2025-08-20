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

type Props = {
  toolId: string;
  initialVotes: number;
  // We don't need launchDate, votingDurationHours, votingFlushed for this implementation
  // as the backend handles voting periods if any. Frontend just shows current state.
  // votes: Record<string, number> | undefined; // This will come from useVoteCounts or be handled by direct mutation update
};

export default function VoteButton({
  toolId,
  initialVotes,
}: Props) {
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const voteMutation = useVoteMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lockout, setLockout] = useState(false);
  const [voted, setVoted] = useState(false);
  const [currentVotes, setCurrentVotes] = useState(initialVotes);

  // When the mutation succeeds, update local state
  useEffect(() => {
    if (voteMutation.isSuccess && voteMutation.data) {
      setCurrentVotes(voteMutation.data.votes ?? currentVotes);
      setVoted(voteMutation.data.alreadyVoted ?? voted);
    }
  }, [voteMutation.isSuccess, voteMutation.data]);

  const handleVote = () => {
    if (!isAuthenticated) {
      setSnackbarOpen(true);
      return;
    }

    if (voteMutation.isPending || lockout) return;
    setLockout(true);

    voteMutation.mutate(toolId, {
      onSettled: () => {
        setTimeout(() => setLockout(false), 3000);
      },
    });
  };

  return (
    <>
      <Tooltip title={isAuthenticated ? (voted ? 'Unlike' : 'Like') : 'Please log in to vote'}>
        <Button
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
            cursor: voteMutation.isPending || lockout ? 'default' : 'pointer',
            boxShadow: 1,
            pointerEvents: voteMutation.isPending || lockout ? 'none' : 'auto',
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
          {voteMutation.isPending ? (
            <CircularProgress size={14} />
          ) : (
            <Typography variant="body2" color="inherit">
              {currentVotes}
            </Typography>
          )}
        </Button>
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