"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import { Mail, Clock } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles, typographyVariants } from "../../../utils/themeUtils";

const Contact = () => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Box component="main" sx={{ pt: 12 }}>
        {/* Hero Section */}
        <Box
          component="section"
          sx={{
            py: 10,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
              opacity: 0.3,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ textAlign: "center", maxWidth: "lg", mx: "auto" }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  ...typographyVariants.sectionTitle,
                  mb: 3,
                  ...commonStyles.textGradient(theme),
                }}
              >
                Contact Us
              </Typography>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 4, lineHeight: 1.6 }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Contact Form & Info */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} sx={{ maxWidth: "xl", mx: "auto" }}>
              {/* Contact Form */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ ...getGlassStyles(theme) }}>
                  <CardHeader
                    title={
                      <Typography variant="h5" component="h2" sx={{ color: theme.palette.text.primary }}>
                        Send us a message
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            placeholder="John"
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                ...getGlassStyles(theme),
                                borderRadius: theme.shape.borderRadius,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            placeholder="Doe"
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                ...getGlassStyles(theme),
                                borderRadius: theme.shape.borderRadius,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...getGlassStyles(theme),
                            borderRadius: theme.shape.borderRadius,
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Subject"
                        placeholder="What's this about?"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...getGlassStyles(theme),
                            borderRadius: theme.shape.borderRadius,
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Message"
                        placeholder="Tell us more about your inquiry..."
                        multiline
                        rows={5}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...getGlassStyles(theme),
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          ...commonStyles.gradientButton(theme),
                          py: 1.5,
                        }}
                      >
                        Send Message
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} lg={6}>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: "bold", color: theme.palette.text.primary }}>
                      Get in Touch
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                      We're here to help and answer any question you might have. Whether you need support with our tools, want to suggest a feature, or just want to say hello, we'd love to hear from you.
                    </Typography>
                  </Box>

                  <Stack spacing={3}>
                    {[
                      {
                        icon: Mail,
                        title: "Email",
                        content: "support@basicutils.com",
                        description: "Send us an email anytime!",
                      },
                      {
                        icon: Clock,
                        title: "Response Time",
                        content: "Within 24 hours",
                        description: "We aim to respond quickly",
                      },
                    ].map((item) => (
                      <Paper
                        key={item.title}
                        sx={{
                          ...getGlassStyles(theme),
                          p: 2,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <IconButton
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            color: "white",
                            "&:hover": {
                              bgcolor: theme.palette.primary.dark,
                            },
                          }}
                        >
                          <item.icon size={20} />
                        </IconButton>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="semibold" sx={{ color: theme.palette.text.primary }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" sx={{ color: theme.palette.text.primary }}>
                            {item.content}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* FAQ CTA */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Paper
              sx={{
                ...getGlassStyles(theme),
                textAlign: "center",
                borderRadius: 4,
                p: 6,
                maxWidth: "lg",
                mx: "auto",
              }}
            >
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: "bold", color: theme.palette.text.primary }}>
                Need Quick Answers?
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                Check out our frequently asked questions for instant help.
              </Typography>
              <Button variant="outlined" size="large" sx={{ ...commonStyles.glassButton(theme) }}>
                Visit FAQ
              </Button>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
