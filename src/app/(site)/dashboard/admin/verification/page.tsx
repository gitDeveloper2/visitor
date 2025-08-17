"use client";
export const dynamic = "force-dynamic";

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
  Tabs,
  Tab,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Warning from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import Refresh from '@mui/icons-material/Refresh';
import Security from '@mui/icons-material/Security';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import Visibility from '@mui/icons-material/Visibility';
import FilterList from '@mui/icons-material/FilterList';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Schedule from '@mui/icons-material/Schedule';
import Assignment from '@mui/icons-material/Assignment';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import { useTheme } from '@mui/material/styles';

interface VerificationStats {
  total: number;
  pending: number;
  needs_review: number;
  verified: number;
  failed: number;
  not_required: number;
  averageScores: {
    pending: number;
    needs_review: number;
    failed: number;
  };
}

interface AppItem {
  _id: string;
  name: string;
  verificationUrl: string;
  verificationSubmittedAt: string;
  verificationAttempts: any; // Can be number (legacy) or array of VerificationAttempt objects
  pricing: string;
  authorName: string;
  slug: string;
  verificationScore?: number;
  lastVerificationMethod?: string;
  lastVerificationAttempt?: number;
}

interface VerificationAttempt {
  attempt: number;
  method: 'static' | 'rendered' | 'admin_review' | 'admin_override';
  score: {
    total: number;
    linkScore: number;
    textScore: number;
    dofollowScore: number;
    accessibilityScore: number;
    status: 'pending' | 'verified' | 'needs_review' | 'failed';
    details: {
      hasLink: boolean;
      hasCorrectUrl: boolean;
      hasCorrectText: boolean;
      isDofollow: boolean;
      isAccessible: boolean;
      linkCount: number;
      textMatches: string[];
      errors: string[];
    };
  };
  timestamp: Date;
  details: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`verification-tabpanel-${index}`}
      aria-labelledby={`verification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AdminVerificationPage() {
  const theme = useTheme();
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    needs_review: 0,
    verified: 0,
    failed: 0,
    not_required: 0,
    averageScores: { pending: 0, needs_review: 0, failed: 0 }
  });
  const [apps, setApps] = useState<{
    pending: AppItem[];
    needsReview: AppItem[];
    failed: AppItem[];
  }>({ pending: [], needsReview: [], failed: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Batch verification state
  const [batchVerifying, setBatchVerifying] = useState(false);
  const [batchModal, setBatchModal] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  
  // Migration state
  const [migrating, setMigrating] = useState(false);
  const [migratingAttempts, setMigratingAttempts] = useState(false);
  
  // Manual verification state
  const [manualModal, setManualModal] = useState<{ open: boolean; app: AppItem | null }>({ open: false, app: null });
  const [verificationUrl, setVerificationUrl] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Admin override state
  const [overrideModal, setOverrideModal] = useState<{ open: boolean; app: AppItem | null }>({ open: false, app: null });
  const [overrideStatus, setOverrideStatus] = useState<'verified' | 'failed' | 'needs_review'>('verified');
  const [overrideScore, setOverrideScore] = useState<number>(100);
  const [overrideReason, setOverrideReason] = useState('');
  const [overriding, setOverriding] = useState(false);

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const fetchVerificationData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/verify-apps', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch verification data');
      }

      const data = await response.json();
      setStats(data.stats);
      setApps(data.apps);
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
        credentials: 'include',
        body: JSON.stringify({ action: 'verify-all' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start batch verification');
      }

      const result = await response.json();
      setSnackbar({ 
        open: true, 
        message: `Batch verification completed. Processed ${result.totalProcessed} apps. ${result.summary.verified} verified, ${result.summary.needsReview} need review.`, 
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

  const handleMigration = async () => {
    setMigrating(true);
    try {
      const response = await fetch('/api/admin/migrate-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to migrate verification system');
      }

      const result = await response.json();
      setSnackbar({ 
        open: true, 
        message: `Migration completed! Updated ${result.migrationResults.freeAppsUpdated} free apps, set status for ${result.migrationResults.statusSet} apps. Total apps requiring verification: ${result.finalStats.totalRequiringVerification}`, 
        severity: 'success' 
      });
      
      // Refresh data after migration
      fetchVerificationData();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Migration failed', severity: 'error' });
    } finally {
      setMigrating(false);
    }
  };

  const handleMigrateAttempts = async () => {
    setMigratingAttempts(true);
    try {
      const response = await fetch('/api/admin/migrate-verification-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to migrate verification attempts');
      }

      const result = await response.json();
      setSnackbar({ 
        open: true, 
        message: `Attempts migration completed! Migrated ${result.summary.migratedCount} apps. Errors: ${result.summary.errorCount}`, 
        severity: 'success' 
      });
      
      // Refresh data after migration
      fetchVerificationData();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Attempts migration failed', severity: 'error' });
    } finally {
      setMigratingAttempts(false);
    }
  };

  const handleManualVerification = async () => {
    if (!manualModal.app) return;
    
    setVerifying(true);
    try {
      const response = await fetch(`/api/admin/verify-apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'manual-verify', 
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
        message: `Manual verification completed! Score: ${result.score.total}/100. Status: ${result.status}. ${result.nextAction}`, 
        severity: result.score.status === 'verified' ? 'success' : 'info' 
      });
      
      setManualModal({ open: false, app: null });
      setVerificationUrl('');
      fetchVerificationData(); // Refresh data
      
      // Show additional notification about user dashboard update
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: `💡 The user will see this update in their dashboard within 30 seconds (automatic refresh) or immediately if they click Refresh.`,
          severity: 'info'
        });
      }, 2000);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Manual verification failed', severity: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  const openManualModal = (app: AppItem) => {
    setManualModal({ open: true, app });
    setVerificationUrl(app.verificationUrl || '');
  };

  const openOverrideModal = (app: AppItem) => {
    setOverrideModal({ open: true, app });
    setOverrideStatus('verified');
    setOverrideScore(100);
    setOverrideReason('');
  };

  const handleAdminOverride = async () => {
    if (!overrideModal.app) return;
    
    setOverriding(true);
    try {
      const response = await fetch(`/api/admin/verify-apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'admin-override', 
          appId: overrideModal.app._id,
          overrideStatus,
          overrideScore,
          overrideReason
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to override verification');
      }

      const result = await response.json();
      setSnackbar({ 
        open: true, 
        message: `Admin override completed! ${result.appName} is now ${overrideStatus}${overrideScore ? ` (${overrideScore}/100)` : ''}. ${result.nextAction}`, 
        severity: 'success' 
      });
      
      setOverrideModal({ open: false, app: null });
      setOverrideStatus('verified');
      setOverrideScore(100);
      setOverrideReason('');
      fetchVerificationData(); // Refresh data
      
      // Show additional notification about user dashboard update
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: `💡 The user will see this update in their dashboard within 30 seconds (automatic refresh) or immediately if they click Refresh.`,
          severity: 'info'
        });
      }, 2000);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Admin override failed', severity: 'error' });
    } finally {
      setOverriding(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    if (score >= 50) return 'info';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'needs_review': return 'warning';
      case 'failed': return 'error';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'needs_review': return 'Needs Review';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const getAttemptsCount = (verificationAttempts: any): number => {
    if (Array.isArray(verificationAttempts)) {
      return verificationAttempts.length;
    }
    if (typeof verificationAttempts === 'number') {
      return verificationAttempts;
    }
    return 0;
  };

  const getAttemptsDetails = (verificationAttempts: any): string => {
    if (Array.isArray(verificationAttempts) && verificationAttempts.length > 0) {
      const lastAttempt = verificationAttempts[verificationAttempts.length - 1];
      if (lastAttempt && lastAttempt.score) {
        return `${verificationAttempts.length} attempts - Last: ${lastAttempt.score.total}/100 (${lastAttempt.method})`;
      }
      return `${verificationAttempts.length} attempts`;
    }
    
    if (typeof verificationAttempts === 'number' && verificationAttempts > 0) {
      return `${verificationAttempts} attempts (legacy format)`;
    }
    
    return 'No attempts';
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
        Manage app verification with intelligent scoring and priority queues.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Enhanced Statistics Cards */}
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
              <Typography variant="caption" color="text.secondary">
                Avg Score: {stats.averageScores.pending.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" gutterBottom>
                {stats.needs_review}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Need Admin Review
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Score: {stats.averageScores.needs_review.toFixed(1)}
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
      </Grid>

      {/* Action Buttons */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={batchVerifying ? <CircularProgress size={16} /> : <PlayArrow />}
            onClick={() => setBatchModal(true)}
            disabled={batchVerifying || (apps.pending.length + apps.needsReview.length + apps.failed.length) === 0}
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

          {/* Migration Buttons */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleMigration}
            disabled={loading || migrating}
            startIcon={migrating ? <CircularProgress size={16} /> : undefined}
            sx={{ borderColor: 'warning.main', color: 'warning.main' }}
          >
            {migrating ? 'Migrating...' : 'Migrate Existing Apps'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleMigrateAttempts}
            disabled={loading || migratingAttempts}
            startIcon={migratingAttempts ? <CircularProgress size={16} /> : <Security />}
            sx={{ borderColor: 'error.main', color: 'error.main' }}
          >
            {migratingAttempts ? 'Migrating...' : 'Fix Legacy Attempts'}
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {apps.pending.length + apps.needsReview.length + apps.failed.length} apps need attention
          </Typography>
        </Stack>
      </Paper>

      {/* Tabs for different verification queues */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Schedule />
                  <span>Pending ({apps.pending.length})</span>
                </Stack>
              } 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Assignment />
                  <span>Needs Review ({apps.needsReview.length})</span>
                </Stack>
              } 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <ErrorIcon />
                  <span>Failed ({apps.failed.length})</span>
                </Stack>
              } 
            />
          </Tabs>
        </Box>

        {/* Pending Apps Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Pending Verification Apps
          </Typography>
          
          {apps.pending.length === 0 ? (
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
                  {apps.pending.map((app) => (
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
                          <Tooltip title={getAttemptsDetails(app.verificationAttempts)}>
                            <Chip 
                              label={getAttemptsCount(app.verificationAttempts)} 
                              size="small"
                              color={(getAttemptsCount(app.verificationAttempts) > 3) ? 'error' : 'default'}
                            />
                          </Tooltip>
                        </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Manual Verification">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => openManualModal(app)}
                            >
                              <AutoFixHigh />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Admin Override">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => openOverrideModal(app)}
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
        </TabPanel>

        {/* Needs Review Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Apps Needing Admin Review
          </Typography>
          
          {apps.needsReview.length === 0 ? (
            <Alert severity="info">
              No apps currently need admin review.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>App Name</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Last Method</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Verification URL</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apps.needsReview.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>
                        <Typography fontWeight={600}>{app.name}</Typography>
                      </TableCell>
                      <TableCell>{app.authorName}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip 
                            label={`${app.verificationScore || 0}/100`}
                            color={getScoreColor(app.verificationScore || 0)}
                            size="small"
                          />
                          <Typography variant="caption">
                            {getScoreLabel(app.verificationScore || 0)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={app.lastVerificationMethod || 'Unknown'} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                                              <TableCell>
                          <Tooltip title={getAttemptsDetails(app.verificationAttempts)}>
                            <Chip 
                              label={getAttemptsCount(app.verificationAttempts)} 
                              size="small"
                              color="warning"
                            />
                          </Tooltip>
                        </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.verificationUrl || 'Not provided'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Manual Verification">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => openManualModal(app)}
                            >
                              <AutoFixHigh />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Admin Override">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => openOverrideModal(app)}
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
        </TabPanel>

        {/* Failed Apps Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Failed Verification Apps
          </Typography>
          
          {apps.failed.length === 0 ? (
            <Alert severity="info">
              No apps have failed verification.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>App Name</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Last Method</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Verification URL</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apps.failed.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>
                        <Typography fontWeight={600}>{app.name}</Typography>
                      </TableCell>
                      <TableCell>{app.authorName}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip 
                            label={`${app.verificationScore || 0}/100`}
                            color={getScoreColor(app.verificationScore || 0)}
                            size="small"
                          />
                          <Typography variant="caption">
                            {getScoreLabel(app.verificationScore || 0)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={app.lastVerificationMethod || 'Unknown'} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                                              <TableCell>
                          <Tooltip title={getAttemptsDetails(app.verificationAttempts)}>
                            <Chip 
                              label={getAttemptsCount(app.verificationAttempts)} 
                              size="small"
                              color="error"
                            />
                          </Tooltip>
                        </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.verificationUrl || 'Not provided'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Manual Verification">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openManualModal(app)}
                            >
                              <AutoFixHigh />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Admin Override">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => openOverrideModal(app)}
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
        </TabPanel>
      </Paper>

      {/* Batch Verification Modal */}
      <Dialog open={batchModal} onClose={() => setBatchModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Batch Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will verify all pending, needs review, and failed apps automatically using the intelligent scoring system.
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Smart Processing:</strong> Apps will be processed based on priority scores and verification attempts.
            </Typography>
          </Alert>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Apps to process: {apps.pending.length + apps.needsReview.length + apps.failed.length}
            </Typography>
          </Box>
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
            {batchVerifying ? 'Processing...' : 'Start Smart Verification'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Verification Modal */}
      <Dialog open={manualModal.open} onClose={() => setManualModal({ open: false, app: null })} maxWidth="md" fullWidth>
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
          
          {manualModal.app && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Verification History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Current Score:</strong> {manualModal.app.verificationScore || 0}/100
                  </Typography>
                                                              <Typography variant="body2">
                      <strong>Attempts:</strong> {getAttemptsCount(manualModal.app.verificationAttempts)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Method:</strong> {manualModal.app.lastVerificationMethod || 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Submitted:</strong> {new Date(manualModal.app.verificationSubmittedAt).toLocaleDateString()}
                    </Typography>
                    
                    {/* Show verification history if available */}
                    {Array.isArray(manualModal.app.verificationAttempts) && manualModal.app.verificationAttempts.length > 0 && (
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle2">Verification History</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={1}>
                            {manualModal.app.verificationAttempts.map((attempt: any, index: number) => (
                              <Box key={index} sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                <Typography variant="body2">
                                  <strong>Attempt {attempt.attempt}:</strong> {attempt.method} - {attempt.score?.total || 0}/100
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(attempt.timestamp).toLocaleString()}
                                </Typography>
                                {attempt.details && (
                                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                    {attempt.details}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}
          
          <Alert severity="info">
            This will check if the verification badge exists on the provided URL and update the verification status with a detailed score.
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

      {/* Admin Override Modal */}
      <Dialog open={overrideModal.open} onClose={() => setOverrideModal({ open: false, app: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Admin Override Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Force the verification status for: <strong>{overrideModal.app?.name}</strong>
          </Typography>
          
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Override Status</InputLabel>
            <Select
              value={overrideStatus}
              label="Override Status"
              onChange={(e) => setOverrideStatus(e.target.value as 'verified' | 'failed' | 'needs_review')}
            >
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="needs_review">Needs Review</MenuItem>
            </Select>
          </FormControl>

          {overrideStatus === 'verified' && (
            <TextField
              fullWidth
              label="Override Score (0-100)"
              type="number"
              value={overrideScore}
              onChange={(e) => setOverrideScore(Number(e.target.value))}
              min="0"
              max="100"
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Override Reason (optional)"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Important:</strong> This action cannot be undone. You are forcing the verification status to <strong>{overrideStatus}</strong>.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideModal({ open: false, app: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleAdminOverride}
            variant="contained"
            disabled={overriding}
            startIcon={overriding ? <CircularProgress size={16} /> : <Security />}
          >
            {overriding ? 'Overriding...' : 'Apply Override'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
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
