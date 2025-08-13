import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AttachMoney, Star, CheckCircle, Info } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface PremiumApp {
  _id: string;
  name: string;
  description: string;
  isPremium: boolean;
  premiumStatus: string;
  premiumPlan: string;
  status: string;
  createdAt: string;
  views: number;
  likes: number;
}

interface PremiumAppManagerProps {
  apps: PremiumApp[];
  onUpdatePremiumStatus: (appId: string, status: string) => Promise<void>;
}

export default function PremiumAppManager({ apps, onUpdatePremiumStatus }: PremiumAppManagerProps) {
  const theme = useTheme();
  const [selectedApp, setSelectedApp] = React.useState<PremiumApp | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const premiumApps = apps.filter(app => app.isPremium);
  const regularApps = apps.filter(app => !app.isPremium);

  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onUpdatePremiumStatus(selectedApp._id, newStatus);
      setDialogOpen(false);
      setSelectedApp(null);
      setNewStatus('');
    } catch (err: any) {
      setError(err.message || 'Failed to update premium status');
    } finally {
      setLoading(false);
    }
  };

  const openStatusDialog = (app: PremiumApp) => {
    setSelectedApp(app);
    setNewStatus(app.premiumStatus || 'active');
    setDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Star color="warning" />
        Premium App Management
      </Typography>

      {/* Premium Apps Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom color="warning.main" fontWeight={600}>
          Premium Apps ({premiumApps.length})
        </Typography>
        
        <Grid container spacing={2}>
          {premiumApps.map((app) => (
            <Grid item xs={12} md={6} key={app._id}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `2px solid ${theme.palette.warning.main}`,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.warning.light}10 100%)`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {app.name}
                  </Typography>
                  <Chip
                    label="Premium"
                    color="warning"
                    size="small"
                    icon={<AttachMoney />}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {app.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={app.premiumStatus || 'active'}
                    color="success"
                    size="small"
                  />
                  {app.premiumPlan && (
                    <Chip label={app.premiumPlan} size="small" variant="outlined" />
                  )}
                  <Chip label={app.status} size="small" variant="outlined" />
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openStatusDialog(app)}
                  sx={{ mt: 1 }}
                >
                  Manage Premium Status
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {premiumApps.length === 0 && (
          <Alert severity="info">
            No premium apps found. Apps become premium when users purchase premium plans.
          </Alert>
        )}
      </Box>

      {/* Premium Status Update Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Premium Status: {selectedApp?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage the premium status of this app. Premium apps are featured on the launch page.
          </Typography>
          
          <TextField
            select
            fullWidth
            label="Premium Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mb: 2 }}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
          </TextField>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 