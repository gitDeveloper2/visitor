'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  IconButton, 
  Snackbar, 
  Stack, 
  Tooltip, 
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';
import { authClient } from '@/app/auth-client';
import { VOTING_ENDPOINTS } from '@/config/voting';
import { useVoteContext } from '@/features/votes/VoteProvider';

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
  
  // Type assertion to include votingToken
  const sessionWithToken = session as typeof session & {
    session: { votingToken?: string } & typeof session.session;
  };
  
  const isAuthenticated = !!session?.user;
  
  // Use VoteProvider for state management
  const { getCount, hasVoted: hasVotedFromProvider, updateUserVoteStatus, snapshotLoaded } = useVoteContext();
  
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Get current vote count and status from provider
  const votes = getCount(toolId);
  const hasVoted = hasVotedFromProvider(toolId);

  // Check initial vote status to avoid 409 conflicts
  // Only check if snapshot is loaded (vote counts initialized) but user vote status unknown
  useEffect(() => {
    const checkInitialVoteStatus = async () => {
      if (!isAuthenticated || !sessionWithToken?.session?.votingToken || !snapshotLoaded) return;
      if (hasVoted !== false) return; // Already know the status
      
      try {
        const token = sessionWithToken.session.votingToken;
        const url = new URL(VOTING_ENDPOINTS.VOTE(toolId, token));
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // If we get a 409, it means user has already voted
        if (response.status === 409) {
          const data = await response.json();
          if (data.error === 'Already voted') {
            updateUserVoteStatus(toolId, true);
          }
        }
        // If we get 200, user hasn't voted yet (hasVoted stays false)
        
      } catch (error) {
        // Silently fail - user can still vote and get proper feedback
        console.log('Vote status check failed:', error);
      }
    };
    
    checkInitialVoteStatus();
  }, [isAuthenticated, sessionWithToken?.session?.votingToken, toolId, snapshotLoaded, hasVoted, updateUserVoteStatus]);

  const handleVote = useCallback(async () => {
    if (!isAuthenticated || !sessionWithToken?.session.votingToken) {
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
      // Use the voting token from the session (already encrypted server-side)
      const token = sessionWithToken.session.votingToken;
      
      // Determine if this is an unvote action
      const isUnvote = hasVoted;
      const url = new URL(VOTING_ENDPOINTS.VOTE(toolId, token));
      
      if (isUnvote) {
        url.searchParams.append('unvote', 'true');
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error codes from voting API
        if (response.status === 409) {
          // 409 means state mismatch - sync the state
          if (isUnvote) {
            // Tried to unvote but haven't voted
            updateUserVoteStatus(toolId, false);
            setSnackbarMessage('You haven\'t voted for this app yet');
          } else {
            // Tried to vote but already voted
            updateUserVoteStatus(toolId, true);
            setSnackbarMessage('You have already voted for this app');
          }
          setSnackbarOpen(true);
          return;
        }
        
        if (data.code === 'NO_ACTIVE_LAUNCH') {
          throw new Error('No active launch to vote in');
        } else if (data.code === 'VOTING_CLOSED') {
          throw new Error('Voting is currently closed');
        } else if (data.code === 'APP_NOT_ELIGIBLE') {
          throw new Error('This app is not eligible for voting');
        }
        throw new Error(data.error || 'Failed to process vote');
      }

      // Success - update VoteProvider state
      const newVotedState = !isUnvote;
      updateUserVoteStatus(toolId, newVotedState);
      
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
  }, [isAuthenticated, session?.user?.id, toolId, hasVoted, onVoteUpdate, disabled]);

  const votingOver = useMemo(() => {
    // If disabled prop is true, voting is over
    if (disabled) return true;
    
    // Voting status is determined by the launches system, not by date
    // If there's an active launch with this app, voting should be allowed
    // The voting API will return proper error codes if voting is not allowed
    return false; // Let the API determine voting eligibility
  }, [disabled]);

  const voted = useMemo(
    () => isAuthenticated && hasVoted,
    [isAuthenticated, hasVoted]
  );

  const theme = useTheme();
  const buttonVariant = hasVoted ? 'contained' : 'outlined';
  const buttonColor = hasVoted ? 'primary' : 'inherit';
  const buttonSize = 'small';

  if (loading) {
    return (
      <Button
        variant="outlined"
        size={buttonSize}
        disabled
        sx={{
          minWidth: 'auto',
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          '& .MuiButton-startIcon': {
            margin: 0
          }
        }}
        startIcon={
          <CircularProgress size={16} color="inherit" />
        }
      >
        {votes}
      </Button>
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
        arrow
        placement="top"
      >
        <span>
          <Button
            variant={buttonVariant}
            color={buttonColor}
            size={buttonSize}
            disabled={!isAuthenticated || loading || votingOver}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleVote();
            }}
            sx={{
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                boxShadow: hasVoted ? theme.shadows[2] : 'none',
                backgroundColor: hasVoted 
                  ? alpha(theme.palette.primary.main, 0.9) 
                  : alpha(theme.palette.action.hover, 0.4)
              },
            }}
            startIcon={
              hasVoted ? (
                <ThumbUpAlt fontSize="small" sx={{ width: 18, height: 18 }} />
              ) : (
                <ThumbUpAltOutlined fontSize="small" sx={{ width: 18, height: 18 }} />
              )
            }
          >
            <Typography 
              variant="body2" 
              component="span" 
              sx={{ 
                ml: 0.5, 
                fontWeight: 500,
                color: hasVoted ? 'primary.contrastText' : 'inherit'
              }}
            >
              {votes}
            </Typography>
          </Button>
        </span>
      </Tooltip>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            minWidth: 200,
            textAlign: 'center',
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
            color: theme.palette.text.primary,
          }
        }}
      >
        <Typography variant="body2" sx={{ p: 1.5 }}>
          {snackbarMessage}
        </Typography>
      </Snackbar>
    </>
  );
}
