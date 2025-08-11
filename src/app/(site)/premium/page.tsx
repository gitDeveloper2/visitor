'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { Crown, Star, BadgeCheck } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import PremiumBlogSubscription from '../../../components/premium/PremiumBlogSubscription';
import PremiumAppListing from '../../../components/premium/PremiumAppListing';

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
      id={`premium-tabpanel-${index}`}
      aria-labelledby={`premium-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PremiumPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Box sx={{ mb: 2 }}>
          <Crown size={64} color={theme.palette.primary.main} style={{ margin: '0 auto' }} />
        </Box>
        <Typography variant="h2" fontWeight={800} gutterBottom>
          Premium Features
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Unlock exclusive content, enhanced visibility, and premium benefits
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 600,
              minHeight: 60,
            }
          }}
        >
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Star size={20} />
                Premium Blog Access
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <BadgeCheck size={20} />
                Premium App Listings
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <PremiumBlogSubscription />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Premium App Listings
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Boost your app's visibility with premium features
          </Typography>
        </Box>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card sx={{ 
              height: '100%',
              border: `2px solid ${theme.palette.warning.main}`,
              borderRadius: 3,
              boxShadow: theme.shadows[8],
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                  <BadgeCheck size={64} color={theme.palette.warning.main} style={{ margin: '0 auto 16px' }} />
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
                  {[
                    'Verified badge and premium placement',
                    'Priority review process (24-48 hours)',
                    'Enhanced app analytics and insights',
                    'Featured in premium app showcase',
                    'Priority customer support',
                    'Marketing promotion opportunities',
                    'Lifetime premium status (no expiration)',
                  ].map((feature, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Star 
                        size={20} 
                        color={theme.palette.success.main} 
                        style={{ marginRight: 12 }}
                      />
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  To upgrade a specific app, go to your app's page and use the upgrade option there.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Footer Info */}
      <Box textAlign="center" mt={6}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          All payments are securely processed by Lemon Squeezy • 30-day money-back guarantee • 
          Cancel subscriptions anytime • Premium app listings are lifetime purchases
        </Typography>
      </Box>
    </Container>
  );
} 