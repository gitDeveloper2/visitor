import { Theme } from '@mui/material/styles';

// Helper functions for consistent theme usage
export const getGradient = (theme: Theme, gradientType: 'primary' | 'secondary' | 'hero') => {
  return theme?.custom?.gradients?.[gradientType] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
};

export const getGlassStyles = (theme: Theme) => ({
  background: theme?.custom?.glass?.background || 'hsla(0, 0%, 100%, 0.85)',
  border: `1px solid ${theme?.custom?.glass?.border || theme?.palette?.divider || '#e0e0e0'}`,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
});

export const getShadow = (theme: Theme, shadowType: 'elegant' | 'neon') => {
  return theme?.custom?.shadows?.[shadowType] || '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
};

export const getAnimation = (theme: Theme, animationType: 'float' | 'glow') => {
  return theme?.custom?.animations?.[animationType] || 'none';
};

// Common style objects for reuse
export const commonStyles = {
  glassCard: (theme: Theme) => ({
    ...getGlassStyles(theme),
    borderRadius: (theme?.shape?.borderRadius || 8) * 1.5,
    boxShadow: getShadow(theme, 'elegant'),
  }),

  gradientButton: (theme: Theme) => ({
    background: getGradient(theme, 'primary'),
    color: 'white',
    fontWeight: 600,
    borderRadius: theme?.shape?.borderRadius || 8,
    '&:hover': {
      background: getGradient(theme, 'primary'),
      boxShadow: getShadow(theme, 'neon'),
    },
  }),

  glassButton: (theme: Theme) => ({
    ...getGlassStyles(theme),
    color: theme?.palette?.primary?.main || '#667eea',
    borderColor: theme?.palette?.primary?.main || '#667eea',
    borderRadius: theme?.shape?.borderRadius || 8,
    '&:hover': {
      backgroundColor: `${theme?.palette?.primary?.main || '#667eea'}20`,
    },
  }),

  floatingElement: (theme: Theme) => ({
    animation: getAnimation(theme, 'float'),
  }),

  glowingElement: (theme: Theme) => ({
    animation: getAnimation(theme, 'glow'),
  }),

  sectionSpacing: {
    py: { xs: 6, md: 8 },
    px: { xs: 2, sm: 3 },
  },

  containerMaxWidth: 'lg',

  textGradient: (theme: Theme) => ({
    background: getGradient(theme, 'primary'),
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }),
};

// Typography variants for consistent text styling
export const typographyVariants = {
  heroTitle: {
    fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem', lg: '4rem' },
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },

  sectionTitle: {
    fontSize: { xs: '2.5rem', md: '3.5rem' },
    fontWeight: 700,
    lineHeight: 1.1,
  },

  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },

  bodyLarge: {
    fontSize: '1.125rem',
    lineHeight: 1.6,
  },

  caption: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};

// Layout helpers
export const layoutHelpers = {
  fullHeight: {
    minHeight: '100vh',
  },

  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  responsiveGrid: {
    container: true,
    spacing: { xs: 2, sm: 3, md: 4 },
  },

  responsiveText: {
    textAlign: { xs: 'center', md: 'left' },
  },
};

// Animation helpers
export const animationHelpers = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },

  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
}; 