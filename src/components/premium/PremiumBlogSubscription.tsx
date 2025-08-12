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
} from '@mui/material';
import { Check, Star, Crown } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { getCheckoutUrl, VARIANT_IDS } from '@lib/lemonsqueezy';

interface PremiumBlogSubscriptionProps {
  userEmail?: string;
  userName?: string;
  isPremium?: boolean;
  onSubscribe?: (variantId: string) => void;
}

const plans = [
  {
    id: VARIANT_IDS.PREMIUM_BLOG_MONTHLY,
    name: 'Monthly',
    price: 9.99,
    period: 'month',
    popular: false,
    features: [
      'Access to all premium blog content',
      'Exclusive founder stories',
      'Early access to new content',
      'Premium community access',
      'Cancel anytime',
    ],
  },
  {
    id: VARIANT_IDS.PREMIUM_BLOG_YEARLY,
    name: 'Yearly',
    price: 99.99,
    period: 'year',
    popular: true,
    savings: 20,
    features: [
      'Everything in Monthly plan',
      '2 months free',
      'Priority support',
      'Exclusive member events',
      'Early access to new features',
    ],
  },
];

export default function PremiumBlogSubscription({ 
  userEmail, 
  userName, 
  isPremium = false,
  onSubscribe
}: PremiumBlogSubscriptionProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState<string | null>(null);

  if (isPremium) {
    return (
      <Card sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 3,
        p: 3,
        textAlign: 'center'
      }}>
        <Crown size={48} color={theme.palette.primary.main} style={{ margin: '0 auto 16px' }} />
        <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
          You're Already Premium! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enjoy unlimited access to all premium blog content and exclusive features.
        </Typography>
      </Card>
    );
  }

  const handleSubscribe = async (variantId: string) => {
    setLoading(variantId);
  
    try {
      if (onSubscribe) {
        // Use the parent component's subscription handler
        await onSubscribe(variantId);
      } else {
        // Fallback to the original implementation
        const res = await fetch("/api/lemonsqueezy/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variantId,
            email: userEmail,
            name: userName,
            custom: {
              subscription_type: "premium_blog",
            },
          }),
        });
    
        if (!res.ok) {
          throw new Error(`Checkout creation failed: ${res.statusText}`);
        }
    
        const { checkoutUrl } = await res.json();
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      setLoading(null);
    }
  };
  

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Unlock Premium Blog Access
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Get exclusive access to premium content, founder stories, and insights from industry leaders
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} md={6} lg={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%',
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'none',
                border: plan.popular ? `3px solid ${theme.palette.warning.main}` : '1px solid',
                borderColor: plan.popular ? theme.palette.warning.main : theme.palette.divider,
                boxShadow: plan.popular ? theme.shadows[8] : theme.shadows[2],
                '&:hover': {
                  transform: plan.popular ? 'scale(1.07)' : 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                }
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="warning"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 700,
                    zIndex: 1,
                  }}
                />
              )}
              
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {plan.name}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" fontWeight={800} color="primary">
                    ${plan.price}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    per {plan.period}
                  </Typography>
                  {plan.savings && (
                    <Chip
                      label={`Save ${plan.savings}%`}
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3, textAlign: 'left' }}>
                  {plan.features.map((feature, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                      <Check 
                        size={20} 
                        color={theme.palette.success.main} 
                        style={{ marginRight: 8 }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  startIcon={loading === plan.id ? <CircularProgress size={20} /> : <Star size={20} />}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  {loading === plan.id ? 'Processing...' : `Subscribe to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Typography variant="body2" color="text.secondary">
          Secure payment powered by Lemon Squeezy • Cancel anytime • 30-day money-back guarantee
        </Typography>
      </Box>
    </Box>
  );
} 