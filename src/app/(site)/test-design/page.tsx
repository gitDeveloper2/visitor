"use client"
import { Box, Container, Typography, Button, Paper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { commonStyles, getGlassStyles, typographyVariants } from "../../../utils/themeUtils";
import { ArrowRight, Code2, Sparkles } from "lucide-react";

export default function TestDesignPage() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h1"
              sx={{
                ...typographyVariants.heroTitle,
                color: theme.palette.text.primary,
                mb: 3,
              }}
            >
              Modern Design System
            </Typography>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
              Testing the integration of the modern design system from your driver project
            </Typography>
          </Box>

          {/* Theme Toggle Test */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 3,
              textAlign: "center",
              ...getGlassStyles(theme),
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: theme.palette.text.primary }}>
              Theme System Working! 🎉
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>
              Current theme: {theme.palette.mode}
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              You can toggle between light and dark themes using the theme toggle in the navbar
            </Typography>
          </Paper>

          {/* Gradient Buttons Test */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
              Button Styles
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight />}
                  sx={commonStyles.gradientButton(theme)}
                >
                  Gradient Button
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Code2 />}
                  sx={commonStyles.glassButton(theme)}
                >
                  Glass Button
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Glass Cards Test */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
              Glass Morphism Cards
            </Typography>
            <Grid container spacing={4}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} md={4} key={item}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: item * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        textAlign: "center",
                        ...getGlassStyles(theme),
                        height: "100%",
                      }}
                    >
                      <Sparkles style={{ width: 40, height: 40, color: theme.palette.primary.main, marginBottom: 16 }} />
                      <Typography variant="h5" sx={{ mb: 2, color: theme.palette.text.primary }}>
                        Card {item}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        This card demonstrates the glass morphism effect with backdrop blur and transparency.
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Color Palette Test */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
              Color Palette
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Primary
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.secondary.main,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Secondary
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.text.primary,
                    color: theme.palette.background.default,
                    textAlign: "center",
                  }}
                >
                  Text Primary
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.text.secondary,
                    color: theme.palette.background.default,
                    textAlign: "center",
                  }}
                >
                  Text Secondary
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Success Message */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
              border: `1px solid ${theme.palette.primary.main}30`,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main }}>
              ✅ Integration Successful!
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              The modern design system has been successfully integrated into your Next.js project. 
              You now have access to beautiful gradients, glass morphism effects, smooth animations, 
              and a complete theme system with dark/light mode support.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
} 