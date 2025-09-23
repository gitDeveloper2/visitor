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
  isInActiveLaunch?: boolean; // New prop to indicate if app is in today's launch
  onVoteUpdate?: (toolId: string, voted: boolean) => void;
};

export default function VoteButton({
  toolId,
  initialVotes = 0,
  launchDate,
  disabled = false,
  isInActiveLaunch = false,
  onVoteUpdate,
}: Props) {
  const { data: session } = authClient.useSession();
  
  // Type assertion to include votingToken
  const sessionWithToken = session as typeof session & {
    session: { votingToken?: string } & typeof session.session;
  };
  
  const isAuthenticated = !!session?.user;
  
  // Use VoteProvider for state management
  const { getCount, hasVoted: hasVotedFromProvider, vote: providerVote } = useVoteContext();
  
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Get current vote count and status from provider
  const votes = getCount(toolId);
  const hasVoted = hasVotedFromProvider(toolId);

  // No need for status checks - VoteProvider handles all initial data loading

  const handleVote = useCallback(async () => {
    if (!isAuthenticated || !sessionWithToken?.session.votingToken) {
      setSnackbarMessage('Please sign in to vote');
      setSnackbarOpen(true);
      return;
    }

    if (disabled || !isInActiveLaunch) {
      setSnackbarMessage(!isInActiveLaunch ? 'This app is not in today\'s launch' : 'Voting is not currently active');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    
    try {
      // Determine if this is an unvote action and delegate to provider
      const isUnvote = hasVoted;
      await providerVote(toolId, isUnvote);

      const newVotedState = !isUnvote;
      
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
  }, [isAuthenticated, sessionWithToken?.session?.votingToken, toolId, hasVoted, onVoteUpdate, disabled, isInActiveLaunch, providerVote]);

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
