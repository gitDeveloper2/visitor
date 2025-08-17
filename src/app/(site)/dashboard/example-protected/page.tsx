'use client';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { AuthGuard, ConditionalRender } from '@/components/auth/client';
import { usePermission, usePermissions } from '@/hooks/useAuthGuard';

export default function ExampleProtectedPage() {
  // Example of using permission hooks
  const canEditContent = usePermission('edit-content');
  const canDeleteContent = usePermission('delete-content');
  const permissions = usePermissions(['admin', 'moderator', 'pro', 'create-content']);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Authentication Protection Examples
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page demonstrates different ways to use the uniform authentication protection system.
      </Typography>

      {/* Example 1: Basic protection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Example 1: Basic Authentication Protection
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This content is protected by AuthGuard and only visible to authenticated users.
          </Typography>
          <AuthGuard>
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" color="white">
                ✅ This content is only visible to authenticated users!
              </Typography>
            </Box>
          </AuthGuard>
        </CardContent>
      </Card>

      {/* Example 2: Role-based protection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Example 2: Admin-Only Content
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This content is only visible to users with admin role.
          </Typography>
          <AuthGuard requiredRole="admin" showAuthDisplay={false}>
            <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="body2" color="white">
                🔒 This is admin-only content!
              </Typography>
            </Box>
          </AuthGuard>
        </CardContent>
      </Card>

      {/* Example 3: Conditional rendering */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Example 3: Conditional Rendering Based on Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These buttons are conditionally rendered based on user permissions.
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <ConditionalRender condition={canEditContent}>
              <Button variant="contained" color="primary">
                Edit Content
              </Button>
            </ConditionalRender>
            
            <ConditionalRender condition={canDeleteContent}>
              <Button variant="contained" color="error">
                Delete Content
              </Button>
            </ConditionalRender>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Current permissions:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {Object.entries(permissions).map(([permission, hasPermission]) => (
              <Chip
                key={permission}
                label={permission}
                color={hasPermission ? 'success' : 'default'}
                size="small"
                variant={hasPermission ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Example 4: Permission-based UI */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Example 4: Permission-Based UI Elements
          </Typography>
          
          <Stack spacing={2}>
            <ConditionalRender condition={permissions.admin}>
              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="white">
                  🛡️ Admin Panel Access
                </Typography>
              </Box>
            </ConditionalRender>
            
            <ConditionalRender condition={permissions.moderator}>
              <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="white">
                  📝 Moderator Tools
                </Typography>
              </Box>
            </ConditionalRender>
            
            <ConditionalRender condition={permissions.pro}>
              <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="white">
                  ⭐ Pro Features
                </Typography>
              </Box>
            </ConditionalRender>
            
            <ConditionalRender condition={permissions['create-content']}>
              <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2" color="white">
                  ✏️ Content Creation
                </Typography>
              </Box>
            </ConditionalRender>
          </Stack>
        </CardContent>
      </Card>

      {/* Example 5: Custom fallback */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Example 5: Custom Fallback Component
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This example shows a custom fallback when user lacks permissions.
          </Typography>
          
          <AuthGuard 
            requiredRole="admin" 
            showAuthDisplay={false}
            fallback={
              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  🔒 Admin access required
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 1 }}
                  href="/dashboard"
                >
                  Go to Dashboard
                </Button>
              </Box>
            }
          >
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" color="white">
                🎉 You have admin access!
              </Typography>
            </Box>
          </AuthGuard>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        How to Use This System
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The authentication protection system provides several ways to protect your content:
      </Typography>
      
      <Stack spacing={1}>
        <Typography variant="body2">
          • <strong>AuthGuard</strong>: Client-side protection for React components
        </Typography>
        <Typography variant="body2">
          • <strong>ServerAuthGuard</strong>: Server-side protection for layouts
        </Typography>
        <Typography variant="body2">
          • <strong>ConditionalRender</strong>: Show/hide content based on conditions
        </Typography>
        <Typography variant="body2">
          • <strong>usePermission</strong>: Check specific permissions
        </Typography>
        <Typography variant="body2">
          • <strong>usePermissions</strong>: Check multiple permissions at once
        </Typography>
      </Stack>
    </Box>
  );
} 