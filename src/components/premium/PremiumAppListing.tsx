'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Check, Star, BadgeCheck, DollarSign } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { getCheckoutUrl, VARIANT_IDS } from '@lib/lemonsqueezy';

interface PremiumAppListingProps {
  appId: string;
  appName: string;
  userEmail?: string;
  userName?: string;
  isPremium?: boolean;
}

const premiumFeatures = [
  'Verified badge and premium placement',
  'Priority review process (24-48 hours)',
  'Enhanced app analytics and insights',
  'Featured in premium app showcase',
  'Priority customer support',
  'Marketing promotion opportunities',
  'Lifetime premium status (no expiration)',
];

export default function PremiumAppListing({ 
  appId,
  appName,
  userEmail, 
  userName, 
  isPremium = false 
}: PremiumAppListingProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (isPremium) {
    return (
      <Card sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.primary.main}15)`,
        border: `2px solid ${theme.palette.success.main}`,
        borderRadius: 3,
        p: 3,
        textAlign: 'center'
      }}>
        <BadgeCheck size={48} color={theme.palette.success.main} style={{ margin: '0 auto 16px' }} />
        <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
          Premium App Listing Active! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your app "{appName}" is enjoying premium benefits and enhanced visibility.
        </Typography>
      </Card>
    );
  }

  const handleUpgrade = async () => {
    setLoading(true);
  
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: VARIANT_IDS.PREMIUM_APP_LISTING,
          custom: {
            app_id: appId,
            app_name: appName,
            subscription_type: "premium_app_listing",
          },
        }),
      });
  
      if (!res.ok) {
        throw new Error(`Checkout creation failed: ${res.statusText}`);
      }
  
      const { checkoutUrl } = await res.json();
  
      // Redirect to Lemon Squeezy checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout:", error);
      setLoading(false);
    }
  };
  

  const handleConnectOrder = async () => {
    if (!orderId.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/lemonsqueezy/connect-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), appId }),
      });
      
      if (response.ok) {
        setShowOrderDialog(false);
        setOrderId('');
        // Refresh the page or update state to show premium status
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Error connecting order');
      }
    } catch (error) {
      console.error('Error connecting order:', error);
      alert('Error connecting order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Upgrade to Premium Listing
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Boost your app's visibility and get premium features for just $19
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ 
            height: '100%',
            border: `2px solid ${theme.palette.warning.main}`,
            borderRadius: 3,
            boxShadow: theme.shadows[8],
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <DollarSign size={64} color={theme.palette.warning.main} style={{ margin: '0 auto 16px' }} />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Premium App Listing
                </Typography>
                <Typography variant="h2" fontWeight={800} color="warning.main">
                  $19
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  One-time payment • Lifetime benefits
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  What you get:
                </Typography>
                {premiumFeatures.map((feature, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Check 
                      size={20} 
                      color={theme.palette.success.main} 
                      style={{ marginRight: 12 }}
                    />
                    <Typography variant="body1">{feature}</Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleUpgrade}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Star size={20} />}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 2,
                }}
              >
                {loading ? 'Processing...' : 'Upgrade to Premium - $19'}
              </Button>

              <Button
                variant="outlined"
                size="medium"
                fullWidth
                onClick={() => setShowOrderDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                Already purchased? Connect your order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <Typography variant="body2" color="text.secondary">
          Secure payment powered by Lemon Squeezy • Instant activation • No recurring fees
        </Typography>
      </Box>

      {/* Order Connection Dialog */}
      <Dialog open={showOrderDialog} onClose={() => setShowOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Connect Your Order
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            If you've already purchased a premium listing, enter your order ID to activate it for this app.
          </Typography>
          <TextField
            fullWidth
            label="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g., 12345"
            helperText="You can find this in your Lemon Squeezy account or email receipt"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOrderDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConnectOrder} 
            variant="contained"
            disabled={!orderId.trim() || loading}
          >
            {loading ? 'Connecting...' : 'Connect Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 