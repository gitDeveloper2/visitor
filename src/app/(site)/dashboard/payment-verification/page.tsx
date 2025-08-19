"use client";

import React, { Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { Receipt, Shield, Clock, CheckCircle } from "lucide-react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "@/utils/themeUtils";
import { useAuthState } from "@/hooks/useAuth";
import PaymentVerification from "@/components/payment/PaymentVerification";

function PaymentVerificationPageContent() {
  const theme = useMuiTheme();
  const { user } = useAuthState();

  if (!user) {
    return (
      <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
        <Container maxWidth="lg">
          <Alert severity="warning">
            Please log in to verify your payment status.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={typographyVariants.sectionTitle}>
            <Box component="span" sx={commonStyles.textGradient(theme)}>Payment</Box> Verification
          </Typography>
          <Typography variant="h6" color="text.secondary" mt={2} mb={4}>
            Check the status of your payments and subscriptions
          </Typography>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Why Verify Your Payment?
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            <Paper sx={{ p: 3, textAlign: 'center', ...getGlassStyles(theme) }}>
              <Shield size={32} color={theme.palette.primary.main} style={{ margin: '0 auto 16px' }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Secure Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verify your payment status securely using your order number or email address
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3, textAlign: 'center', ...getGlassStyles(theme) }}>
              <Clock size={32} color={theme.palette.warning.main} style={{ margin: '0 auto 16px' }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Real-time Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get instant updates on your payment status, subscription details, and premium access
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3, textAlign: 'center', ...getGlassStyles(theme) }}>
              <CheckCircle size={32} color={theme.palette.success.main} style={{ margin: '0 auto 16px' }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Instant Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confirm your premium features are active and see when they expire
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Payment Verification Component */}
        <Paper sx={{ ...getGlassStyles(theme), p: 4, borderRadius: "1.5rem", boxShadow: getShadow(theme, "elegant") }}>
          <PaymentVerification />
        </Paper>

        {/* Help Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Need Help?
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Can't find your order number?
            </Typography>
            <Typography variant="body2">
              Check your email for the Lemon Squeezy receipt, or use the email address you used for payment.
            </Typography>
          </Alert>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Payment not showing up?
            </Typography>
            <Typography variant="body2">
              It may take a few minutes for payments to be processed. If you're still having issues, contact our support team.
            </Typography>
          </Alert>
          
          <Alert severity="info">
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Subscription questions?
            </Typography>
            <Typography variant="body2">
              View your subscription details, renewal dates, and manage your premium access all in one place.
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
}

export default function PaymentVerificationPage() {
  return (
    <Suspense fallback={<div />}>
      <PaymentVerificationPageContent />
    </Suspense>
  );
}
