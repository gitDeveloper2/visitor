'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import { Lock, Crown, Star } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import PremiumBlogSubscription from './PremiumBlogSubscription';

interface PremiumContentGuardProps {
  children: React.ReactNode;
  isPremium: boolean;
  contentType: 'blog' | 'app';
  contentTitle?: string;
  showUpgradePrompt?: boolean;
}

export default function PremiumContentGuard({ 
  children, 
  isPremium, 
  contentType,
  contentTitle,
  showUpgradePrompt = true 
}: PremiumContentGuardProps) {
  const theme = useTheme();

  if (isPremium) {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Crown size={20} color={theme.palette.primary.main} />
          <Chip 
            label="Premium Content" 
            color="primary" 
            size="small" 
            variant="outlined"
          />
        </Box>
        {children}
      </Box>
    );
  }

  if (!showUpgradePrompt) {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock size={20} color={theme.palette.text.secondary} />
          <Chip 
            label="Premium Content" 
            color="default" 
            size="small" 
            variant="outlined"
          />
        </Box>
        <Box sx={{ 
          filter: 'blur(2px)', 
          pointerEvents: 'none',
          position: 'relative'
        }}>
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Lock size={20} color={theme.palette.warning.main} />
        <Chip 
          label="Premium Content" 
          color="warning" 
          size="small" 
          variant="outlined"
        />
      </Box>
      
      <Card sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.warning.main}10, ${theme.palette.primary.main}10)`,
        border: `1px solid ${theme.palette.warning.main}30`,
        borderRadius: 2,
        mb: 3,
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Star size={32} color={theme.palette.warning.main} />
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {contentType === 'blog' ? 'Premium Blog Content' : 'Premium App Content'}
              </Typography>
              {contentTitle && (
                <Typography variant="body2" color="text.secondary">
                  "{contentTitle}"
                </Typography>
              )}
            </Box>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            This {contentType === 'blog' ? 'article' : 'app'} is part of our premium content. 
            {contentType === 'blog' 
              ? ' Subscribe to access all premium articles, founder stories, and exclusive insights.'
              : ' Upgrade to premium listing for enhanced visibility and features.'
            }
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {contentType === 'blog' ? (
            <PremiumBlogSubscription />
          ) : (
            <Box textAlign="center">
              <Button
                variant="contained"
                color="warning"
                size="large"
                startIcon={<Star size={20} />}
                sx={{ borderRadius: 2, px: 4, py: 1.5 }}
              >
                View Premium Plans
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Blurred content preview */}
      <Box sx={{ 
        filter: 'blur(3px)', 
        pointerEvents: 'none',
        position: 'relative',
        opacity: 0.3,
      }}>
        {children}
      </Box>
    </Box>
  );
}

// Special component for founder stories (always free)
export function FounderStoryContent({ children, contentTitle }: { 
  children: React.ReactNode; 
  contentTitle?: string;
}) {
  const theme = useTheme();
  
  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Crown size={20} color={theme.palette.success.main} />
        <Chip 
          label="Founder Story" 
          color="success" 
          size="small" 
          variant="outlined"
        />
      </Box>
      {children}
    </Box>
  );
} 