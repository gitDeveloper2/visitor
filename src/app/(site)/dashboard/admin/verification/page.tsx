"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Security,
  PlayArrow,
  Stop,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Note: This page uses API calls instead of direct imports to avoid client-side server code issues

interface VerificationStats {
  total: number;
  pending: number;
  verified: number;
  failed: number;
  not_required: number;
}

interface PendingApp {
  _id: string;
  name: string;
  verificationUrl: string;
  verificationSubmittedAt: string;
  verificationAttempts: number;
  pricing: string;
  authorName: string;
  slug: string;
}

export default function AdminVerificationPage() {
  const theme = useTheme();
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    verified: 0,
    failed: 0,
    not_required: 0,
  });
  const [pendingApps, setPendingApps] = useState<PendingApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });
  
  // Batch verification state
  const [batchVerifying, setBatchVerifying] = useState(false);
  const [batchModal, setBatchModal] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  
  // Manual verification state
  const [manualModal, setManualModal] = useState<{ open: boolean; app: PendingApp | null }>({ open: false, app: null });
  const [verificationUrl, setVerificationUrl] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const fetchVerificationData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        fetch('/api/admin/verify-apps'),
        fetch('/api/user-apps?verificationStatus=pending&requiresVerification=true')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingApps(pendingData.apps || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch verification data');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchVerification = async () => {
    setBatchVerifying(true);
    try {
      const response = await fetch('/api/admin/verify-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-all' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start batch verification');
      }

      const result = await response.json();
      setSnackbar({ 
        open: true, 
        message: `Batch verification completed. Processed ${result.totalProcessed} apps.`, 
        severity: 'success' 
      });
      
      setBatchModal(false);
      fetchVerificationData(); // Refresh data
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Batch verification failed', severity: 'error' });
    } finally {
      setBatchVerifying(false);
    }
  };

  const handleManualVerification = async () => {
    if (!manualModal.app) return;
    
    setVerifying(true);
    try {
      const response = await fetch(`/api/admin/verify-apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify-single', 
          appId: manualModal.app._id,
          verificationUrl: verificationUrl 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify app');
      }

      const result = await response.json();
      setSnackbar({ 
        open: true, 
        message: result.result.found ? 'Verification successful!' : 'Verification failed - badge not found', 
        severity: result.result.found ? 'success' : 'error' 
      });
      
      setManualModal({ open: false, app: null });
      setVerificationUrl('');
      fetchVerificationData(); // Refresh data
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Manual verification failed', severity: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  const openManualModal = (app: PendingApp) => {
    setManualModal({ open: true, app });
    setVerificationUrl(app.verificationUrl || '');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Verification Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage app verification status and manually verify badges.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Apps
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Verification
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                {stats.verified}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" gutterBottom>
                {stats.failed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Failed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={batchVerifying ? <CircularProgress size={16} /> : <PlayArrow />}
            onClick={() => setBatchModal(true)}
            disabled={batchVerifying || pendingApps.length === 0}
          >
            {batchVerifying ? 'Verifying...' : 'Batch Verify All'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchVerificationData}
            disabled={loading}
          >
            Refresh Data
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {pendingApps.length} apps pending verification
          </Typography>
        </Stack>
      </Paper>

      {/* Pending Apps Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pending Verification Apps
        </Typography>
        
        {pendingApps.length === 0 ? (
          <Alert severity="info">
            No apps are currently pending verification.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>App Name</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Pricing</TableCell>
                  <TableCell>Verification URL</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Attempts</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApps.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <Typography fontWeight={600}>{app.name}</Typography>
                    </TableCell>
                    <TableCell>{app.authorName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={app.pricing || 'Free'} 
                        color={app.pricing === 'Premium' ? 'warning' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.verificationUrl || 'Not provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(app.verificationSubmittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={app.verificationAttempts || 0} 
                        size="small"
                        color={app.verificationAttempts > 3 ? 'error' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Manual Verification">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => openManualModal(app)}
                          >
                            <Security />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View App">
                          <IconButton
                            size="small"
                            color="primary"
                            component="a"
                            href={`/launch/${app.slug}`}
                            target="_blank"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Batch Verification Modal */}
      <Dialog open={batchModal} onClose={() => setBatchModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Batch Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will verify all pending apps automatically. The process may take several minutes.
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> This process will check each app's verification URL and update their verification status accordingly.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleBatchVerification}
            variant="contained"
            disabled={batchVerifying}
            startIcon={batchVerifying ? <CircularProgress size={16} /> : <PlayArrow />}
          >
            {batchVerifying ? 'Processing...' : 'Start Batch Verification'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Verification Modal */}
      <Dialog open={manualModal.open} onClose={() => setManualModal({ open: false, app: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Manual Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manually verify the verification badge for: <strong>{manualModal.app?.name}</strong>
          </Typography>
          
          <TextField
            fullWidth
            label="Verification URL"
            value={verificationUrl}
            onChange={(e) => setVerificationUrl(e.target.value)}
            placeholder="https://example.com/page-with-badge"
            sx={{ mb: 2 }}
          />
          
          <Alert severity="info">
            This will check if the verification badge exists on the provided URL and update the verification status accordingly.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualModal({ open: false, app: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleManualVerification}
            variant="contained"
            disabled={!verificationUrl.trim() || verifying}
            startIcon={verifying ? <CircularProgress size={16} /> : <Security />}
          >
            {verifying ? 'Verifying...' : 'Verify Badge'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
