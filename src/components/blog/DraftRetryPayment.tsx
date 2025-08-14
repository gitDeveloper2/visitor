import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import { Clock, AlertTriangle, CreditCard } from 'lucide-react';
import PremiumBlogSubscription from '../premium/PremiumBlogSubscription';

interface DraftRetryPaymentProps {
  draft: any;
  onPaymentSuccess?: () => void;
}

export default function DraftRetryPayment({ draft, onPaymentSuccess }: DraftRetryPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate remaining time
  useEffect(() => {
    const calculateRemainingTime = () => {
      if (!draft.expiryDate) return;

      const now = new Date().getTime();
      const expiry = new Date(draft.expiryDate).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setRemainingTime({ days, hours, minutes, seconds });
      } else {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateRemainingTime();
    const timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [draft.expiryDate]);

  const handleRetryPayment = async (variantId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user-blogs/draft/${draft._id}/retry-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId }),
      });

      if (res.ok) {
        const { checkoutUrl } = await res.json();
        window.location.href = checkoutUrl;
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to retry payment');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while retrying payment');
    } finally {
      setLoading(false);
    }
  };

  const isExpired = draft.isExpired || remainingTime.days === 0 && remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds === 0;
  const isExpiringSoon = remainingTime.days === 0 && remainingTime.hours < 24;

  if (isExpired) {
    return (
      <Alert severity="error" icon={<AlertTriangle />}>
        <Typography variant="body2">
          This draft has expired and can no longer be used for payment. 
          Please create a new blog submission.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Expiry Warning */}
      {isExpiringSoon && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<Clock />}>
          <Typography variant="body2">
            ⚠️ This draft expires soon! Complete your payment within the remaining time.
          </Typography>
        </Alert>
      )}

      {/* Countdown Timer */}
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: isExpiringSoon ? 'warning.main' : 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
          <Clock size={16} />
          <Typography variant="body2" color="text.secondary">
            Draft expires in:
          </Typography>
          
          {remainingTime.days > 0 && (
            <Chip 
              label={`${remainingTime.days}d`} 
              size="small" 
              color={isExpiringSoon ? "warning" : "default"}
              variant="outlined"
            />
          )}
          
          <Chip 
            label={`${remainingTime.hours.toString().padStart(2, '0')}h`} 
            size="small" 
            color={isExpiringSoon ? "warning" : "default"}
            variant="outlined"
          />
          
          <Chip 
            label={`${remainingTime.minutes.toString().padStart(2, '0')}m`} 
            size="small" 
            color={isExpiringSoon ? "warning" : "default"}
            variant="outlined"
          />
          
          <Chip 
            label={`${remainingTime.seconds.toString().padStart(2, '0')}s`} 
            size="small" 
            color={isExpiringSoon ? "warning" : "default"}
            variant="outlined"
          />
        </Stack>
      </Box>

      {/* Payment Retry Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCard size={20} />
          Retry Payment
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Complete your premium subscription to publish this blog post.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <PremiumBlogSubscription onSubscribe={handleRetryPayment} />
      </Box>

      {/* Info Box */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          💡 <strong>Tip:</strong> Drafts are automatically deleted after 7 days to keep your workspace clean. 
          No external notifications will be sent.
        </Typography>
      </Alert>
    </Box>
  );
} 