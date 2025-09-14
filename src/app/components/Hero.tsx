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
        minHeight: { xs: "calc(100vh - 64px)", sm: "100vh" }, // Account for navbar height on mobile
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 4, sm: 6 },
        px: { xs: 1, sm: 2 }, // Add horizontal padding to prevent edge overflow
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
          left: { xs: "5%", sm: "25%" }, // Reduced left position on mobile
          width: { xs: 150, sm: 288 }, // Smaller size on mobile
          height: { xs: 150, sm: 288 },
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
          right: { xs: "5%", sm: "25%" }, // Reduced right position on mobile
          width: { xs: 180, sm: 384 }, // Smaller size on mobile
          height: { xs: 180, sm: 384 },
          bgcolor: theme.palette.primary.main,
          opacity: theme.palette.mode === 'light' ? 0.06 : 0.1,
          borderRadius: "50%",
          filter: "blur(48px)",
          animation: theme.custom.animations.float,
          animationDelay: "3s"
        }}
      />

      <Container 
        maxWidth="md" 
        sx={{ 
          textAlign: "center", 
          position: "relative", 
          zIndex: 1,
          px: { xs: 1, sm: 2 }, // Ensure container doesn't overflow
          width: "100%"
        }}
      >
        {/* Badge */}
        <Paper
          elevation={3}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: { xs: 2, sm: 4 }, // Reduced padding on mobile
            py: { xs: 1, sm: 2 },
            mb: { xs: 4, sm: 6, md: 8 }, // Reduced margin on mobile
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
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
            fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
            fontWeight: 700,
            lineHeight: { xs: 1.1, md: 1.05 },
            letterSpacing: '-0.025em',
            color: theme.palette.text.primary,
            mb: { xs: 3, sm: 4 },
            textAlign: 'center',
            maxWidth: '100%',
            mx: 'auto'
          }}
        >
          Discover{" "}
          <Box
            component="span"
            sx={{
              ...commonStyles.textGradient(theme),
              fontWeight: 700
            }}
          >
            Coding Ideas and Insightful Tools
          </Box>
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            mb: { xs: 6, sm: 8 },
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            fontWeight: 400,
            textAlign: 'center'
          }}
        >
          Stay inspired with articles exploring unique programming concepts and actionable knowledge. From understanding Zod enums to tracking npm package trends with NpmStars, and using free tools like Pic2Map and Geotag Photos Online — BasicUtils helps you learn, analyze, and create smarter.
        </Typography>

        {/* CTA Buttons */}
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={{ xs: 2, sm: 4 }} 
          justifyContent="center" 
          alignItems="center" 
          sx={{ mb: { xs: 6, sm: 8, md: 12 } }} // Reduced margin on mobile
        >
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
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: 200 },
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
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: 160 },
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
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: 160 },
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
        <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center" sx={{ width: '100%', maxWidth: 1000, mx: 'auto', px: 2 }}>
          {stats.map((stat, index) => (
            <Grid xs={12} sm={6} md={4} key={stat.label}>
              <Box
                sx={{
                  p: { xs: 4, sm: 5 },
                  height: '100%',
                  borderRadius: 3,
                  textAlign: "center",
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    borderColor: theme.palette.primary.main + '40'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: theme.palette.text.primary, 
                    mb: 1,
                    fontWeight: 600,
                    fontSize: { xs: '1.75rem', sm: '2rem' }
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
