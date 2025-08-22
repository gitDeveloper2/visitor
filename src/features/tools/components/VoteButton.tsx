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
import { authClient } from '@/app/auth-client';
import { useVoteContext } from '@/features/votes/VoteProvider';

type Props = {
  toolId: string;
  initialVotes: number;
  launchDate?: string;
  votingDurationHours?: number;
  votingFlushed?: boolean;
};

export default function VoteButton({
  toolId,
  initialVotes,
  launchDate,
  votingDurationHours = 24,
  votingFlushed = false,
}: Props) {
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const { getCount, hasVoted, vote } = useVoteContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lockout, setLockout] = useState(false);
  const [allowRender, setAllowRender] = useState(false);

  const liveCount = getCount(toolId);

  // Delay render to avoid flash of initialVotes
  useEffect(() => {
    const timeout = setTimeout(() => setAllowRender(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const currentVotes = allowRender ? liveCount ?? initialVotes : undefined;

  const votingOver = useMemo(() => {
    if (votingFlushed) return true;
    if (!launchDate) return false;
    const endTime =
      new Date(launchDate).getTime() + votingDurationHours * 3600_000;
    return Date.now() > endTime;
  }, [launchDate, votingDurationHours, votingFlushed]);

  const voted = useMemo(
    () => isAuthenticated && hasVoted(toolId),
    [isAuthenticated, hasVoted, toolId]
  );

  const handleVote = async () => {
    if (!isAuthenticated) {
      setSnackbarOpen(true);
      return;
    }
    if (lockout || votingOver) return;

    setLockout(true);
    try {
      await vote(toolId);
    } finally {
      setTimeout(() => setLockout(false), 500);
    }
  };

  return (
    <>
      <Tooltip
        title={
          votingOver
            ? 'Voting has ended'
            : !isAuthenticated
            ? 'Please log in to vote'
            : voted
            ? 'Click to remove vote'
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
            cursor: lockout || votingOver ? 'default' : 'pointer',
            boxShadow: 1,
            pointerEvents: lockout ? 'none' : 'auto',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: voted ? 'primary.main' : 'primary.light',
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
