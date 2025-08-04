"use client";
import { Box, Container, Typography, Stack, Button, Paper, Grid } from "@mui/material";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { useTheme } from "@mui/material/styles";
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
          opacity: 0.10,
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
          opacity: 0.2,
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
          opacity: 0.1,
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
          <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.text.primary }}>
            Powerful Development Tools & Resources
          </Typography>
        </Paper>

        {/* Main Heading */}
        <Typography
          component="h1"
          sx={{
            ...typographyVariants.heroTitle,
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          Discover{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              ...commonStyles.textGradient(theme),
              fontWeight: 800,
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
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.5,
            color: theme.palette.text.secondary,
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
            }}
          >
            Read Articles
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
                <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {stat.number}
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary }}>{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
