"use client";
import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles, typographyVariants } from "../../utils/themeUtils";

const AboutUs = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        py: { xs: 8, sm: 10, md: 12 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
        background: isDark 
          ? 'radial-gradient(circle at 50% 50%, rgba(30, 30, 40, 0.8) 0%, #121212 70%)'
          : 'radial-gradient(circle at 50% 50%, rgba(240, 240, 250, 0.8) 0%, #f9f9ff 70%)',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(72px)',
          opacity: 0.6,
          zIndex: 0,
        },
        '&::before': {
          top: '10%',
          left: '10%',
          width: 300,
          height: 300,
          background: theme.palette.primary.light,
          animation: 'float 12s ease-in-out infinite',
        },
        '&::after': {
          bottom: '10%',
          right: '10%',
          width: 250,
          height: 250,
          background: theme.palette.secondary.light,
          animation: 'float 10s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 4,
            background: theme.palette.background.paper,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, 
                ${theme.palette.primary.main}, 
                ${theme.palette.secondary.main}, 
                ${theme.palette.primary.light}, 
                ${theme.palette.secondary.light}
              )`,
              backgroundSize: '300% 100%',
              animation: 'gradient 8s ease infinite',
            },
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        >
          <Box sx={{ maxWidth: 120, mx: 'auto', mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: theme.palette.primary.contrastText,
                fontSize: 32,
                fontWeight: 700,
                boxShadow: `0 0 15px ${theme.palette.primary.light},
                           0 0 30px ${theme.palette.primary.main}40`,
                textShadow: `0 0 10px ${theme.palette.primary.light}`,
              }}
            >
              BU
            </Box>
          </Box>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                ...typographyVariants.heroTitle,
                color: theme.palette.text.primary,
                mb: 3,
                textAlign: 'center',
                mx: 'auto',
                maxWidth: 800,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(90deg, #fff, #e0e0ff)' 
                  : 'linear-gradient(90deg, #1a1a2e, #3a3a5e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <Box 
                component="span" 
                sx={{
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(90deg, #fff, #e0e0ff)' 
                    : 'linear-gradient(90deg, #1a1a2e, #3a3a5e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 4,
                    left: 0,
                    width: '100%',
                    height: 4,
                    background: theme.palette.primary.main,
                    borderRadius: 2,
                  }
                }}
              >
                About
              </Box>
              <Box component="span" sx={commonStyles.textGradient(theme)}>
                BasicUtils
              </Box>
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography
              variant="h6"
              component="p"
              sx={{
                ...typographyVariants.bodyLarge,
                color: theme.palette.text.secondary,
                mb: 6,
                maxWidth: 700,
                mx: 'auto',
                textAlign: 'center',
                px: { xs: 2, sm: 0 },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -10,
                  left: -20,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: theme.palette.primary.light,
                  opacity: 0.3,
                  zIndex: -1
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -30,
                  right: -20,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: theme.palette.secondary.light,
                  opacity: 0.3,
                  zIndex: -1
                }
              }}
            >
              We&apos;re passionate about programming and committed to sharing knowledge
              that helps developers achieve more. From insightful articles to powerful
              tools, our mission is to simplify development and inspire innovation.
            </Typography>

            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                mt: 4,
                mb: 2
              }}
            >
              {['Development', 'Innovation', 'Community', 'Excellence'].map((item) => (
                <Box
                  key={item}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 4,
                    bgcolor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
                      transition: 'all 0.2s ease',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;
