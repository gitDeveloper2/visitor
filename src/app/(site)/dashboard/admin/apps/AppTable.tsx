"use client";

import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Snackbar,
  Grid,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Warning from "@mui/icons-material/Warning";
import Error from "@mui/icons-material/Error";
import Refresh from "@mui/icons-material/Refresh";
import Visibility from "@mui/icons-material/Visibility";
import Security from "@mui/icons-material/Security";
import Tune from "@mui/icons-material/Tune";
// Remove direct import of verification service - use API calls instead

interface AppItem {
  _id: string;
  name: string;
  description: string;
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  // Verification fields
  verificationStatus?: 'pending' | 'verified' | 'failed' | 'not_required';
  verificationUrl?: string;
  verificationSubmittedAt?: string;
  verificationCheckedAt?: string;
  verificationAttempts?: number;
  requiresVerification?: boolean;
  pricing?: string;
  isPremium?: boolean;
  slug?: string;
}

// Status chips
const getStatusChip = (status: string) => {
  const colors = {
    pending: "warning",
    approved: "success",
    rejected: "error",
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={colors[status as keyof typeof colors] as any}
      variant="outlined"
      size="small"
    />
  );
};

// Verification status chips
const getVerificationChip = (status: string) => {
  const colors = {
    pending: "warning",
    verified: "success",
    failed: "error",
    not_required: "default",
  };

  const icons = {
    pending: <Warning fontSize="small" />,
    verified: <CheckCircle fontSize="small" />,
    failed: <Error fontSize="small" />,
    not_required: null,
  };

  return (
    <Chip
      label={status === 'not_required' ? 'N/A' : status.charAt(0).toUpperCase() + status.slice(1)}
      color={colors[status as keyof typeof colors] as any}
      variant="outlined"
      size="small"
      icon={icons[status as keyof typeof icons]}
    />
  );
};

export default function AppTable() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });
  
  // Verification modal state
  const [verificationModal, setVerificationModal] = useState<{ open: boolean; app: AppItem | null }>({ open: false, app: null });
  const [verificationUrl, setVerificationUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [pricingFilter, setPricingFilter] = useState('all');

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/apps");
       
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        console.log(data)
        setApps(data.apps || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const handleStatusUpdate = async (appId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/apps/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update app status");

      // Update the local state
      setApps(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      
      setSnackbar({ open: true, message: `App status updated to ${newStatus}`, severity: 'success' });
    } catch (err: any) {
      console.error("Error updating app status:", err);
      setSnackbar({ open: true, message: err.message || "Failed to update app status", severity: 'error' });
    }
  };

  const handleManualVerification = async () => {
    if (!verificationModal.app) return;
    
    setVerifying(true);
    try {
      const response = await fetch('/api/admin/verify-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify-single', 
          appId: verificationModal.app._id,
          verificationUrl: verificationUrl 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify app');
      }

      const result = await response.json();
      
      if (result.result.found) {
        setSnackbar({ open: true, message: 'Verification successful! Badge found on website.', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Verification failed. Badge not found on website.', severity: 'error' });
      }
      
      // Refresh apps to show updated verification status
      const res = await fetch("/api/admin/apps");
      if (res.ok) {
        const data = await res.json();
        setApps(data.apps || []);
      }
      
      setVerificationModal({ open: false, app: null });
      setVerificationUrl('');
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Verification failed", severity: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  const openVerificationModal = (app: AppItem) => {
    setVerificationModal({ open: true, app });
    setVerificationUrl(app.verificationUrl || '');
  };

  // Filter apps based on current filters
  const filteredApps = apps.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (verificationFilter !== 'all' && app.verificationStatus !== verificationFilter) return false;
    if (pricingFilter !== 'all' && app.pricing !== pricingFilter) return false;
    return true;
  });

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "App Name",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography fontWeight={600}>{params.row.name}</Typography>
          {params.row.isPremium && (
            <Chip label="Premium" color="warning" size="small" variant="filled" sx={{ mt: 0.5 }} />
          )}
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 300 
        }}>
          {params.row.description}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => getStatusChip(params.row.status),
    },
    {
      field: "verificationStatus",
      headerName: "Verification",
      width: 140,
      renderCell: (params) => getVerificationChip(params.row.verificationStatus || 'not_required'),
    },
    {
      field: "pricing",
      headerName: "Pricing",
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.row.pricing || 'Free'} 
          color={params.row.pricing === 'Premium' ? 'warning' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "authorName",
      headerName: "Author",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Submitted On",
      width: 140,
      valueGetter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.status === 'pending' && (
            <>
              <Button 
                size="small" 
                variant="outlined" 
                color="success"
                onClick={() => handleStatusUpdate(params.row._id, 'approved')}
              >
                Approve
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleStatusUpdate(params.row._id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
          {params.row.status === 'approved' && (
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={() => handleStatusUpdate(params.row._id, 'rejected')}
            >
              Reject
            </Button>
          )}
          {params.row.status === 'rejected' && (
            <Button 
              size="small" 
              variant="outlined" 
              color="success"
              onClick={() => handleStatusUpdate(params.row._id, 'approved')}
            >
              Approve
            </Button>
          )}
          
          {/* Verification button for free apps */}
          {params.row.requiresVerification && (
            <Tooltip title="Manual Verification">
              <IconButton
                size="small"
                color="info"
                onClick={() => openVerificationModal(params.row)}
              >
                <Security />
              </IconButton>
            </Tooltip>
          )}
          
          {/* View app button */}
          <Tooltip title="View App">
            <IconButton
              size="small"
              color="primary"
              component="a"
              href={`/launch/${params.row.slug}`}
              target="_blank"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
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

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Tune color="action" />
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Verification</InputLabel>
              <Select
                value={verificationFilter}
                label="Verification"
                onChange={(e) => setVerificationFilter(e.target.value)}
              >
                <MenuItem value="all">All Verification</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="not_required">Not Required</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Pricing</InputLabel>
              <Select
                value={pricingFilter}
                label="Pricing"
                onChange={(e) => setPricingFilter(e.target.value)}
              >
                <MenuItem value="all">All Pricing</MenuItem>
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Grid */}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredApps}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.default",
              fontWeight: "bold",
            },
          }}
        />
      </Box>

      {/* Verification Modal */}
      <Dialog open={verificationModal.open} onClose={() => setVerificationModal({ open: false, app: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Manual Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manually verify the verification badge for: <strong>{verificationModal.app?.name}</strong>
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
          <Button onClick={() => setVerificationModal({ open: false, app: null })}>
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
    </Box>
  );
}