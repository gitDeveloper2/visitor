'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Stack,
  Paper,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Payment, 
  Schedule as Clock, 
  Warning as AlertTriangle, 
  CheckCircle,
  CreditCard,
  CalendarToday as Calendar,
  Add as Plus,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getShadow, getGlassStyles } from '@/utils/themeUtils';
import Link from 'next/link';

interface AppDraft {
  _id: string;
  name: string;
  description: string;
  tagline?: string;
  tags: string[];
  category?: string;
  techStack: string[];
  pricing: string;
  features: string[];
  website?: string;
  github?: string;
  authorBio?: string;
  premiumPlan?: string;
  premiumReady: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
  remainingDays: number;
  isExpired: boolean;
}

interface AppDraftManagerProps {
  onEditDraft?: (draft: AppDraft) => void;
  onDeleteDraft?: (draftId: string) => void;
  refreshTrigger?: number;
}

const VARIANT_IDS = {
  PREMIUM_APP_LISTING: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_APP_LISTING_VARIANT_ID || '',
};



export default function AppDraftManager({ 
  onEditDraft, 
  onDeleteDraft,
  refreshTrigger = 0 
}: AppDraftManagerProps) {
  const theme = useTheme();
  const [drafts, setDrafts] = useState<AppDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryPaymentLoading, setRetryPaymentLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [selectedDraftForPayment, setSelectedDraftForPayment] = useState<AppDraft | null>(null);

  // Fetch drafts
  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user-apps/drafts');
      if (!response.ok) {
        throw new Error('Failed to fetch app drafts');
      }
      
      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch app drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [refreshTrigger]);

  // Retry payment for a draft
  const handleRetryPayment = async (draft: AppDraft) => {
    if (!VARIANT_IDS.PREMIUM_APP_LISTING) {
      setError('Premium app listing variant ID not configured');
      return;
    }

    setRetryPaymentLoading(draft._id);
    try {
      const response = await fetch(`/api/user-apps/draft/${draft._id}/retry-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: VARIANT_IDS.PREMIUM_APP_LISTING }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout');
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to retry payment');
    } finally {
      setRetryPaymentLoading(null);
    }
  };



  // Delete a draft
  const handleDeleteDraft = async (draftId: string) => {
    setDeleteLoading(draftId);
    try {
      const response = await fetch(`/api/user-apps/draft/${draftId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete draft');
      }

      // Remove from local state
      setDrafts(prev => prev.filter(d => d._id !== draftId));
      
      // Call parent callback if provided
      if (onDeleteDraft) {
        onDeleteDraft(draftId);
      }
      
      setShowDeleteDialog(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete draft');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Get status color and icon
  const getStatusInfo = (draft: AppDraft) => {
    if (draft.isExpired) {
      return { color: 'error', icon: <AlertTriangle fontSize="small" />, text: 'Expired' };
    }
    if (draft.remainingDays <= 1) {
      return { color: 'warning', icon: <Clock fontSize="small" />, text: 'Expires Soon' };
    }
    if (draft.premiumReady) {
      return { color: 'success', icon: <CheckCircle fontSize="small" />, text: 'Premium Ready' };
    }
    return { color: 'info', icon: <Clock fontSize="small" />, text: 'Active' };
  };

  // Get border color based on expiry
  const getBorderColor = (draft: AppDraft) => {
    if (draft.isExpired) return theme.palette.error.main;
    if (draft.remainingDays <= 1) return theme.palette.warning.main;
    if (draft.premiumReady) return theme.palette.success.main;
    return 'transparent';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (drafts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <EditIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
          No app drafts yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start creating to build your first app draft.
        </Typography>
        <Button
          component={Link}
          href="/dashboard/submit/app"
          variant="contained"
          color="primary"
          startIcon={<Plus fontSize="small" />}
          sx={{ fontWeight: 600 }}
        >
          Create Your First App
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        App Drafts ({drafts.length})
      </Typography>

      <Grid container spacing={3}>
        {drafts.map((draft) => {
          const statusInfo = getStatusInfo(draft);
          const borderColor = getBorderColor(draft);

          return (
            <Grid item xs={12} md={6} key={draft._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: getShadow(theme, "elegant"),
                  border: borderColor !== 'transparent' ? `2px solid ${borderColor}` : 'none',
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: getShadow(theme, "neon"),
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1, mr: 2, lineHeight: 1.3 }}>
                      {draft.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {draft.premiumReady && (
                        <Chip
                          label="Premium Ready"
                          color="success"
                          size="small"
                          variant="filled"
                          icon={<span style={{ fontSize: '12px' }}>💎</span>}
                        />
                      )}
                      {draft.isExpired && (
                        <Chip
                          label="Expired"
                          color="error"
                          size="small"
                          variant="filled"
                          icon={<AlertTriangle fontSize="small" />}
                        />
                      )}
                      {!draft.isExpired && draft.remainingDays === 0 && (
                        <Chip
                          label="Expires Soon"
                          color="warning"
                          size="small"
                          variant="filled"
                          icon={<Clock fontSize="small" />}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flex: 1 }}
                  >
                    {draft.description?.slice(0, 150)}...
                  </Typography>

                  {/* Tags */}
                  {draft.tags && draft.tags.length > 0 && (
                    <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                      {draft.tags.map((tag: string, i: number) => (
                        <Chip key={i} size="small" label={tag} variant="outlined" />
                      ))}
                    </Stack>
                  )}

                  {/* Countdown Timer */}
                  {!draft.isExpired && (
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: draft.remainingDays === 0 ? 'warning.main' : 'divider' }}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <Clock fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                          Expires in:
                        </Typography>
                        
                        {draft.remainingDays > 0 && (
                          <Chip 
                            label={`${draft.remainingDays}d`} 
                            size="small" 
                            color={draft.remainingDays === 0 ? "warning" : "default"}
                            variant="outlined"
                          />
                        )}
                        
                        <Chip 
                          label={`${Math.floor((new Date(draft.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)) % 24}h`} 
                          size="small" 
                          color={draft.remainingDays === 0 ? "warning" : "default"}
                          variant="outlined"
                        />
                        
                        <Chip 
                          label={`${Math.floor((new Date(draft.expiryDate).getTime() - new Date().getTime()) / (1000 * 60)) % 60}m`} 
                          size="small" 
                          color={draft.remainingDays === 0 ? "warning" : "default"}
                          variant="outlined"
                        />
                      </Stack>
                    </Box>
                  )}

                  {/* Metadata */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Calendar fontSize="small" />
                      {new Date(draft.createdAt).toLocaleDateString()}
                    </Box>
                    {draft.category && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>•</span>
                        {draft.category}
                      </Box>
                    )}
                    {draft.pricing && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>•</span>
                        {draft.pricing}
                      </Box>
                    )}
                  </Box>
                </CardContent>

                <Divider />

                <CardActions sx={{ p: 2, pt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="caption" color="text.secondary">
                      {draft.authorBio || 'App Draft'}
                    </Typography>
                    
                    <Stack direction="row" spacing={1}>
                                            {!draft.isExpired && (
                        <Tooltip title="Continue Editing">
                          <IconButton
                            onClick={() => onEditDraft?.(draft)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {!draft.premiumReady && !draft.isExpired && (
                        <Tooltip title="Retry Payment">
                          <IconButton
                            onClick={() => setSelectedDraftForPayment(draft)}
                            size="small"
                            color="warning"
                            disabled={retryPaymentLoading === draft._id}
                          >
                            {retryPaymentLoading === draft._id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <CreditCard />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Delete Draft">
                        <IconButton
                          onClick={() => setShowDeleteDialog(draft._id)}
                          size="small"
                          color="error"
                          disabled={deleteLoading === draft._id}
                        >
                          {deleteLoading === draft._id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onClose={() => setShowDeleteDialog(null)}>
        <DialogTitle>Delete Draft</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this draft? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(null)}>Cancel</Button>
          <Button 
            onClick={() => showDeleteDialog && handleDeleteDraft(showDeleteDialog)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Retry Modal */}
      {selectedDraftForPayment && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
          onClick={() => setSelectedDraftForPayment(null)}
        >
          <Paper
            sx={{
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              p: 3
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Retry Payment for App Draft</Typography>
              <IconButton onClick={() => setSelectedDraftForPayment(null)}>
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Complete your premium subscription to publish "{selectedDraftForPayment.name}"
            </Typography>

            {/* Countdown Timer */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: selectedDraftForPayment.remainingDays === 0 ? 'warning.main' : 'divider' }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Clock fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Draft expires in:
                </Typography>
                
                {selectedDraftForPayment.remainingDays > 0 && (
                  <Chip 
                    label={`${selectedDraftForPayment.remainingDays}d`} 
                    size="small" 
                    color={selectedDraftForPayment.remainingDays === 0 ? "warning" : "default"}
                    variant="outlined"
                  />
                )}
                
                <Chip 
                  label={`${Math.floor((new Date(selectedDraftForPayment.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)) % 24}h`} 
                  size="small" 
                  color={selectedDraftForPayment.remainingDays === 0 ? "warning" : "default"}
                  variant="outlined"
                />
                
                <Chip 
                  label={`${Math.floor((new Date(selectedDraftForPayment.expiryDate).getTime() - new Date().getTime()) / (1000 * 60)) % 60}m`} 
                  size="small" 
                  color={selectedDraftForPayment.remainingDays === 0 ? "warning" : "default"}
                  variant="outlined"
                />
              </Stack>
            </Box>

            {/* Payment Options */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>Choose Your Plan</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Premium app listings get featured placement and enhanced visibility.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setSelectedDraftForPayment(null)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRetryPayment(selectedDraftForPayment)}
                variant="contained"
                color="primary"
                disabled={retryPaymentLoading === selectedDraftForPayment._id}
                startIcon={retryPaymentLoading === selectedDraftForPayment._id ? <CircularProgress size={16} /> : <CreditCard fontSize="small" />}
              >
                {retryPaymentLoading === selectedDraftForPayment._id ? 'Processing...' : 'Retry Payment'}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
} 