"use client";
import { Box, Container, Typography, Paper, Grid, Chip } from "@mui/material";
import { Code, FileText, Image, Zap } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { commonStyles, typographyVariants, getGlassStyles, getShadow } from "../../utils/themeUtils";

const tools = [
  {
    icon: Code,
    title: "NpmStars",
    description: "View Package npm downloads and github stars side by side. Track package popularity and usage trends.",
    category: "Development",
    popular: true
  },
  {
    icon: Image,
    title: "Pic2Map",
    description: "Convert images into location-rich maps. Extract GPS data from photos and visualize locations.",
    category: "Media",
    popular: true
  },
  {
    icon: FileText,
    title: "GeoTagger",
    description: "Add location metadata to your photos. Optimize images with GPS coordinates and location data.",
    category: "Media",
    popular: true
  },
  {
    icon: Image,
    title: "Image Compressor",
    description: "Optimize images without losing quality. Compress photos for web and mobile applications.",
    category: "Media",
    popular: true
  },
  {
    icon: Image,
    title: "Image Resizer",
    description: "Easily adjust image dimensions. Resize photos to specific dimensions for different platforms.",
    category: "Media",
    popular: false
  },
  {
    icon: Image,
    title: "Image Crop",
    description: "Quickly trim your images. Crop photos to focus on important content and remove unwanted areas.",
    category: "Media",
    popular: false
  }
];

const ToolsSection = () => {
  const theme = useTheme();

  return (
    <Box
      id="tools"
      sx={{
        py: { xs: 10, md: 10 },
        position: "relative",
        bgcolor: "transparent"
      }}
      component="section"
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: 256,
          height: 256,
          bgcolor: theme.palette.primary.main,
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(48px)",
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 384,
          height: 384,
          bgcolor: theme.palette.primary.main,
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(48px)",
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Box
          sx={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <Paper
            elevation={0}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 4,
              py: 2,
              mb: 3,
              borderRadius: "999px",
              ...getGlassStyles(theme),
              boxShadow: getShadow(theme, 'elegant')
            }}
          >
            <Zap style={{ width: 18, height: 18, color: theme.palette.primary.main }} />
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: theme.palette.text.primary }}
            >
              Development Tools
            </Typography>
          </Paper>

          <Typography
            variant="h2"
            sx={{
              ...typographyVariants.sectionTitle,
              mb: 2,
            }}
          >
            <Box
              component="span"
              sx={{
                ...commonStyles.textGradient(theme),
                display: "inline",
              }}
            >
              Powerful Tools
            </Box>
            <br />
            <Box
              component="span"
              sx={{
                color: theme.palette.text.primary,
                display: "inline",
              }}
            >
              For Developers
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
              mb: 2
            }}
          >
            Boost your productivity with our collection of carefully crafted online tools designed for modern developers.
          </Typography>
        </Box>

        {/* Tools Grid */}
        <Grid container spacing={6} justifyContent="center">
          {tools.map((tool) => (
            <Grid xs={12} sm={6} md={4} key={tool.title}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: "1rem",
                  ...getGlassStyles(theme),
                  boxShadow: getShadow(theme, 'elegant'),
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  "&:hover": {
                    borderColor: `${theme.palette.primary.main}50`,
                    boxShadow: getShadow(theme, 'elegant'),
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      background: theme.custom.gradients.primary,
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "box-shadow 0.2s",
                      "&:hover": {
                        boxShadow: `0 0 20px ${theme.palette.primary.main}30`,
                      },
                    }}
                  >
                    <tool.icon style={{ width: 24, height: 24, color: "#fff" }} />
                  </Box>
                  {tool.popular && (
                    <Chip
                      label="Popular"
                      size="small"
                      sx={{
                        bgcolor: `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main,
                        borderColor: `${theme.palette.primary.main}30`,
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ px: 3, pb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      transition: "color 0.2s",
                      "&:hover": { color: theme.palette.primary.main },
                      fontSize: "1.25rem",
                      mb: 1,
                    }}
                  >
                    {tool.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "1rem",
                      mb: 2,
                    }}
                  >
                    {tool.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 3,
                    pb: 3,
                    mt: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "0.95rem", color: theme.palette.text.secondary }}>
                    {tool.category}
                  </span>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ToolsSection;
