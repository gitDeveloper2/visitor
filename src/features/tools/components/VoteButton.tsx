'use client';

import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { authClient } from '@/app/auth-client';

type Props = {
  toolId: string;
  initialVotes: number;
  launchDate?: string;
  disabled?: boolean;
  onVoteUpdate?: (toolId: string, voted: boolean) => void;
};

export default function VoteButton({
  toolId,
  initialVotes = 0,
  launchDate,
  disabled = false,
  onVoteUpdate,
}: Props) {
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Sync with initialVotes prop
  useEffect(() => {
    setVotes(initialVotes);
  }, [initialVotes]);

  const handleVote = useCallback(async () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please sign in to vote');
      setSnackbarOpen(true);
      return;
    }

    if (disabled) {
      setSnackbarMessage('Voting is not currently active');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process vote');
      }

      // Update local state
      const newVotedState = !hasVoted;
      setHasVoted(newVotedState);
      setVotes(prev => newVotedState ? prev + 1 : Math.max(0, prev - 1));
      
      // Notify parent component
      if (onVoteUpdate) {
        onVoteUpdate(toolId, newVotedState);
      }

      setSnackbarMessage(newVotedState ? 'Vote recorded!' : 'Vote removed');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Vote error:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'Failed to process vote');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, toolId, hasVoted, onVoteUpdate, disabled]);

  const votingOver = useMemo(() => {
    // If disabled prop is true, voting is over
    if (disabled) return true;
    
    // If no launch date, voting is not time-bound
    if (!launchDate) return false;
    
    // Otherwise check if voting period has passed
    const launch = new Date(launchDate);
    const now = new Date();
    const votingEnd = new Date(launch.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    
    return now > votingEnd;
  }, [launchDate, disabled]);

  const voted = useMemo(
    () => isAuthenticated && hasVoted,
    [isAuthenticated, hasVoted]
  );

  if (loading) {
    return (
      <Box display="inline-flex" alignItems="center" gap={0.5}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          {votes}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Tooltip 
        title={
          !isAuthenticated 
            ? 'Sign in to vote' 
            : votingOver 
              ? 'Voting has ended'
              : hasVoted 
                ? 'Remove your vote' 
                : 'Vote for this tool'
        }
      >
        <Box 
          component="span"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleVote();
          }}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            border: '1px solid',
            borderColor: hasVoted ? 'primary.main' : 'divider',
            color: hasVoted ? 'primary.main' : 'text.secondary',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            fontSize: '0.8rem',
            cursor: isAuthenticated && !votingOver && !disabled ? 'pointer' : 'default',
            opacity: votingOver || disabled ? 0.7 : 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: hasVoted ? 'primary.main' : 'primary.light',
              backgroundColor: 'action.hover',
            },
          }}
        >
          {hasVoted ? (
            <ThumbUpAlt sx={{ fontSize: 18 }} />
          ) : (
            <ThumbUpAltOutlined sx={{ fontSize: 18 }} />
          )}
          <Typography variant="body2" color="inherit">
            {votes}
          </Typography>
        </Box>
      </Tooltip>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
