import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { DeploymentFlagService } from '@/utils/deploymentFlags';

interface DeploymentStatusBannerProps {
  showOnlyIfRelevant?: boolean;
}

export default function DeploymentStatusBanner({ showOnlyIfRelevant = true }: DeploymentStatusBannerProps) {
  const flags = DeploymentFlagService.getFlags();
  const phase = DeploymentFlagService.getDeploymentPhase();
  const statusMessage = DeploymentFlagService.getStatusMessage();
  
  // Don't show banner if fully operational and showOnlyIfRelevant is true
  if (showOnlyIfRelevant && phase === 'fully-operational') {
    return null;
  }
  
  // Show maintenance banner
  if (flags.maintenanceMode) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          <Typography variant="body2" fontWeight="medium">
            🚧 System Maintenance
          </Typography>
          <Typography variant="body2">
            {flags.maintenanceBanner || statusMessage}
          </Typography>
        </Alert>
      </Box>
    );
  }
  
  // Show deployment phase status
  const getSeverity = () => {
    switch (phase) {
      case 'blog-deployment':
      case 'blog-ready':
        return 'info';
      case 'app-launch-pending':
        return 'warning';
      case 'fully-operational':
        return 'success';
      default:
        return 'info';
    }
  };
  
  const getIcon = () => {
    switch (phase) {
      case 'blog-deployment':
        return '📝';
      case 'blog-ready':
        return '✅';
      case 'app-launch-pending':
        return '🚀';
      case 'fully-operational':
        return '🎉';
      default:
        return 'ℹ️';
    }
  };
  
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity={getSeverity()} sx={{ borderRadius: 2 }}>
        <Typography variant="body2" fontWeight="medium">
          {getIcon()} Deployment Status: {phase.replace('-', ' ').toUpperCase()}
        </Typography>
        <Typography variant="body2">
          {statusMessage}
        </Typography>
      </Alert>
    </Box>
  );
}
