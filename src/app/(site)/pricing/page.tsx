'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Check,
  Star,
  Crown,
  Zap,
  Users,
  Shield,
  Globe,
  Code,
  FileText,
  BadgeCheck,
  TrendingUp,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
  buttonText: string;
  buttonVariant: 'contained' | 'outlined';
  href: string;
}

export default function PricingPage() {
  const theme = useTheme();

  const pricingTiers: PricingTier[] = [
    {
      name: 'Basic',
      price: 0,
      description: 'Perfect for getting started and early visibility',
      features: [
        'App listed in our directory',
        'Shows in search results & category listings',
        'Good for early visibility and discovery'
      ],
      icon: Code,
      color: theme.palette.grey[500],
      buttonText: 'Get Started',
      buttonVariant: 'outlined',
      href: '/register'
    },
    {
      name: 'Verified',
      price: 0,
      description: 'Enhanced visibility with verification badge',
      features: [
        'All Basic benefits',
        'Verified badge for authenticity',
        'Dedicated detail page for your app (includes logo, screenshots, description, and your official website displayed on the profile)',
        'Higher placement in category results',
        'Unlocks full profile features once verification is completed by you'
      ],
      icon: BadgeCheck,
      color: theme.palette.success.main,
      buttonText: 'Verify Your App',
      buttonVariant: 'outlined',
      href: '/dashboard/submit/app'
    },
    {
      name: 'Premium',
      price: 9,
      description: 'Fastest path to full visibility with assisted verification',
      features: [
        'All Verified benefits (dedicated detail page, badge, profile features)',
        'We handle verification for you — no changes required on your side',
        'Fast-tracked review and priority placement in categories',
        'Featured exposure opportunities (homepage/spotlight)'
      ],
      icon: Star,
      color: theme.palette.warning.main,
      buttonText: 'Get Premium',
      buttonVariant: 'contained',
      href: '/premium',
      popular: true
    }
  ];



  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          App Directory Pricing
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
          Choose the plan that fits your app's visibility needs. All plans include core listing features with transparent pricing.
        </Typography>
      </Box>

             {/* App Directory Pricing Cards */}
       <Grid container spacing={3} justifyContent="center">
         {pricingTiers.map((tier, index) => (
           <Grid item xs={12} sm={6} md={4} key={tier.name}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                border: tier.popular ? `2px solid ${tier.color}` : '1px solid',
                borderColor: tier.popular ? tier.color : 'divider',
                transform: tier.popular ? 'scale(1.05)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: tier.popular ? 'scale(1.07)' : 'scale(1.02)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {tier.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: tier.color,
                    color: 'white',
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  Most Popular
                </Box>
              )}
              
              <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box textAlign="center" mb={1}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: `${tier.color}20`,
                      mb: 1,
                    }}
                  >
                    <tier.icon size={24} color={tier.color} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {tier.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {tier.description}
                  </Typography>
                  
                  {/* Price */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      ${tier.price}
                    </Typography>
                    {tier.price > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        one-time payment
                      </Typography>
                    )}
                    {tier.price === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Free forever
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Features */}
                <List dense sx={{ flexGrow: 1, mb: 1 }}>
                  {tier.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} sx={{ px: 0, py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Check size={14} color={tier.color} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* CTA Button */}
                <Button
                  component={Link}
                  href={tier.href}
                  variant={tier.buttonVariant}
                  size="medium"
                  fullWidth
                  sx={{
                    mt: 'auto',
                    py: 1,
                    fontSize: '1rem',
                    fontWeight: 600,
                    ...(tier.popular && {
                      bgcolor: tier.color,
                      '&:hover': {
                        bgcolor: tier.color,
                        opacity: 0.9,
                      },
                    }),
                  }}
                >
                  {tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Blog Publishing Pricing Section */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Blog Publishing Pricing
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Share your story and content with our community
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={5}>
            <Card sx={{ 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: theme.shadows[8],
              },
            }}>
              <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box textAlign="center" mb={2}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: `${theme.palette.grey[500]}20`,
                      mb: 1,
                    }}
                  >
                    <FileText size={24} color={theme.palette.grey[500]} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Founder Story
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Share your entrepreneurial journey
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h3" fontWeight={800} color="primary">
                      $0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Free forever
                    </Typography>
                  </Box>
                </Box>

                <List dense sx={{ flexGrow: 1, mb: 1 }}>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.grey[500]} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Editorial review & free publication (if it meets criteria)"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.grey[500]} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Story-first format focused on origin, struggles, lessons, and product journey"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.grey[500]} />
                    </ListItemIcon>
                    <ListItemText
                      primary="One author bio (with one official link) displayed"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.grey[500]} />
                    </ListItemIcon>
                    <ListItemText
                      primary="No overt promotional pitching"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                </List>

                <Button
                  component={Link}
                  href="/blogs"
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 'auto',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  Submit Story
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <Card sx={{ 
              height: '100%',
              border: `2px solid ${theme.palette.primary.main}`,
              transform: 'scale(1.02)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.04)',
                boxShadow: theme.shadows[8],
              },
            }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  zIndex: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                Most Popular
              </Box>
              
              <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box textAlign="center" mb={2}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: `${theme.palette.primary.main}20`,
                      mb: 1,
                    }}
                  >
                    <Crown size={24} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Standard
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Comprehensive content marketing solution
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h3" fontWeight={800} color="primary">
                      $20
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      one-time payment
                    </Typography>
                  </Box>
                </Box>

                <List dense sx={{ flexGrow: 1, mb: 1 }}>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Editorial review & publication"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Full article format (tutorials, case studies, thought leadership, product updates)"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Featured on blog homepage for 7 days"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Priority placement in category listings"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Highlighted excerpt on homepage"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Author bio with official link"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="One social share"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Check size={16} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Optional add-ons available"
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                </List>

                <Button
                  component={Link}
                  href="/blogs"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 'auto',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                      opacity: 0.9,
                    },
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Everything you need to know about our pricing
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                How does app verification work?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For Verified plans, you complete a simple verification step on your website. For Premium plans, we handle verification for you.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                What's the difference between Basic and Verified?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Basic gets you listed, while Verified adds a badge, dedicated profile page, and higher placement in search results.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                How long does blog review take?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Founder Story submissions are reviewed within 5-7 days. Standard articles are reviewed within 3-5 business days.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Can I upgrade my plan later?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, you can upgrade from Basic to Verified or Premium at any time. All plans are one-time payments.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          mt: 6,
          textAlign: 'center',
          p: 4,
          borderRadius: 4,
          background: theme.custom?.gradients?.primary || theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Ready to get started?
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
          List your app or share your story with our community
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/dashboard/submit/app"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Submit Your App
          </Button>
          <Button
            component={Link}
            href="/dashboard/submit/blog"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Write for Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 