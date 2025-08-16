"use client";
import { Box, Container, Typography, Stack, Button, Paper, Grid } from "@mui/material";
import { ArrowRight, Code2, Sparkles, Star } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { commonStyles, typographyVariants, getGlassStyles } from "../../utils/themeUtils";

const stats = [
  { number: "5+", label: "Online Tools" },
  { number: "100+", label: "Tech Articles" },
  { number: "Growing", label: "Developers" }
];

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      id="home"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        pt: 10,
        bgcolor: theme.palette.background.default
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: theme.custom.gradients.hero,
          opacity: theme.palette.mode === 'light' ? 0.06 : 0.10,
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "25%",
          width: 288,
          height: 288,
          bgcolor: theme.palette.primary.main,
          opacity: theme.palette.mode === 'light' ? 0.10 : 0.2,
          borderRadius: "50%",
          filter: "blur(48px)",
          animation: theme.custom.animations.float
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          width: 384,
          height: 384,
          bgcolor: theme.palette.primary.main,
          opacity: theme.palette.mode === 'light' ? 0.06 : 0.1,
          borderRadius: "50%",
          filter: "blur(48px)",
          animation: theme.custom.animations.float,
          animationDelay: "3s"
        }}
      />

      <Container maxWidth="md" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <Paper
          elevation={3}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 4,
            py: 2,
            mb: 8,
            borderRadius: "999px",
            ...getGlassStyles(theme),
            boxShadow: theme.custom.shadows.elegant
          }}
        >
          <Sparkles style={{ width: 20, height: 20, color: theme.palette.primary.main }} />
          <Typography 
            variant="body2" 
            fontWeight={600} 
            sx={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
              fontSize: '0.875rem',
              letterSpacing: '0.025em'
            }}
          >
            Powerful Development Tools & Resources
          </Typography>
        </Paper>

        {/* Main Heading */}
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem', lg: '4.5rem' },
            fontWeight: 800,
            lineHeight: { xs: 1.1, md: 1.05 },
            letterSpacing: { xs: '-0.02em', md: '-0.03em' },
            color: theme.palette.text.primary,
            mb: 4,
            fontFamily: '"Outfit", "Poppins", sans-serif',
            textAlign: 'center',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          Discover{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              ...commonStyles.textGradient(theme),
              fontWeight: 800,
              fontFamily: '"Outfit", "Poppins", sans-serif',
            }}
          >
            Coding Ideas and Insightful Tools
          </Box>
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            mb: 8,
            maxWidth: 700,
            mx: "auto",
            lineHeight: { xs: 1.6, md: 1.7 },
            color: theme.palette.text.secondary,
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
            fontWeight: 400,
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            letterSpacing: '0.01em',
            textAlign: 'center',
            px: { xs: 2, sm: 0 }
          }}
        >
          Stay inspired with articles exploring unique programming concepts and actionable knowledge. From understanding Zod enums to tracking npm package trends with NpmStars, and using free tools like Pic2Map and Geotag Photos Online — BasicUtils helps you learn, analyze, and create smarter.
        </Typography>

        {/* CTA Buttons */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4} justifyContent="center" alignItems="center" sx={{ mb: 12 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={
              <ArrowRight
                style={{
                  transition: "transform 0.2s"
                }}
                className="arrow-right-icon"
              />
            }
            sx={{
              ...commonStyles.gradientButton(theme),
              "&:hover .arrow-right-icon": {
                transform: "translateX(4px)"
              }
            }}
          >
            Try out NpmStars Tool
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Code2 style={{ width: 22, height: 22 }} />}
            sx={{
              ...commonStyles.glassButton(theme),
              // improve contrast in light mode
              color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.main,
              borderColor: theme.palette.mode === 'light' ? `${theme.palette.primary.main}66` : theme.palette.primary.main,
            }}
          >
            Read Articles
          </Button>
          <Button
            component={Link}
            href="/pricing"
            variant="outlined"
            size="large"
            startIcon={<Star style={{ width: 22, height: 22 }} />}
            sx={{
              ...commonStyles.glassButton(theme),
              color: theme.palette.warning.main,
              borderColor: theme.palette.warning.main,
              "&:hover": {
                borderColor: theme.palette.warning.dark,
                bgcolor: `${theme.palette.warning.main}10`,
              },
            }}
          >
            View Pricing
          </Button>
        </Stack>

        {/* Stats */}
        <Grid container spacing={8} justifyContent="center" sx={{ maxWidth: 900, mx: "auto" }}>
          {stats.map((stat, index) => (
            <Grid xs={12} md={4} key={stat.label}>
              <Paper
                elevation={2}
                sx={{
                  p: 6,
                  borderRadius: "2rem",
                  ...getGlassStyles(theme),
                  textAlign: "center",
                  animation: theme.custom.animations.glow,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)"
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    mb: 2,
                    fontFamily: '"Outfit", "Poppins", sans-serif',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
