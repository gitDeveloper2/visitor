'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { Search, Receipt, Mail, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

interface PaymentVerificationProps {
  onVerificationSuccess?: (data: any) => void;
}

interface VerificationResult {
  success: boolean;
  accessFixed?: boolean;
  order: {
    orderNumber: number;
    status: string;
    total: number;
    totalFormatted: string;
    createdAt: string;
    productName: string;
    variantName: string;
  };
  subscription?: {
    id: number;
    status: string;
    renewsAt: string;
    endsAt: string;
  };
  premiumAccess?: {
    isActive: boolean;
    expiresAt: string;
    plan: string;
  };
}

export default function PaymentVerification({ onVerificationSuccess }: PaymentVerificationProps) {
  const theme = useTheme();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!orderNumber && !email) {
      setError('Please provide either an order number or email address');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: orderNumber || undefined,
          email: email || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setResult(data);
      if (onVerificationSuccess) {
        onVerificationSuccess(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'active':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'failed':
      case 'cancelled':
      case 'refunded':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom display="flex" alignItems="center" gap={1}>
        <Receipt size={24} color={theme.palette.primary.main} />
        Payment Verification
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Check the status of your payment using your order number or email address.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Order Number"
                placeholder="e.g., 12345"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                InputProps={{
                  startAdornment: <Receipt size={20} style={{ marginRight: 8 }} />,
                }}
                helperText="Enter your Lemon Squeezy order number"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <Mail size={20} style={{ marginRight: 8 }} />,
                }}
                helperText="Enter the email used for payment"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading || (!orderNumber && !email)}
              startIcon={loading ? <CircularProgress size={20} /> : <Search size={20} />}
              sx={{ px: 4 }}
            >
              {loading ? 'Verifying...' : 'Verify Payment'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<AlertTriangle />}>
          {error}
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <CheckCircle size={20} color={theme.palette.success.main} />
              Payment Verified
            </Typography>

            {result.accessFixed && (
              <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Access Restored! 🎉
                </Typography>
                <Typography variant="body2">
                  Your premium access has been automatically restored. You should now have full access to your purchased features.
                </Typography>
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Order Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Order Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Order Number
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    #{result.order.orderNumber}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={result.order.status}
                    color={getStatusColor(result.order.status) as any}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {result.order.totalFormatted}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(result.order.createdAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Product
                  </Typography>
                  <Typography variant="body1">
                    {result.order.productName} - {result.order.variantName}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Subscription Details */}
            {result.subscription && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Subscription Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={result.subscription.status}
                      color={getStatusColor(result.subscription.status) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  
                  {result.subscription.renewsAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Next Renewal
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(result.subscription.renewsAt)}
                      </Typography>
                    </Grid>
                  )}
                  
                  {result.subscription.endsAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Ends At
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(result.subscription.endsAt)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Premium Access Status */}
            {result.premiumAccess && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Premium Access Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={result.premiumAccess.isActive ? 'Active' : 'Inactive'}
                      color={result.premiumAccess.isActive ? 'success' : 'error'}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  
                  {result.premiumAccess.plan && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Plan
                      </Typography>
                      <Typography variant="body1">
                        {result.premiumAccess.plan}
                      </Typography>
                    </Grid>
                  )}
                  
                  {result.premiumAccess.expiresAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Expires At
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(result.premiumAccess.expiresAt)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 3 }} icon={<Info />}>
              <Typography variant="body2">
                If you have any questions about your payment or subscription, please contact our support team.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
