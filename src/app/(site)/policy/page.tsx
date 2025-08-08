"use client"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Link,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import { Shield } from "lucide-react";
import DonateButton from "../../components/DonateButton";
import Footer from "../../components/Footer";

const PrivacyPolicy = () => {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <DonateButton />
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
              background:
                "radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)",
              opacity: 0.3,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ textAlign: "center", mx: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Shield style={{ width: 64, height: 64, color: iconColor }} />
              </Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2.5rem", md: "3.75rem" },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                Learn how we protect your data and what terms apply when using our services.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: 1st November 2024
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Privacy Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4}>
              <Card elevation={3}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2} sx={{ color: "text.secondary" }}>
                    <Typography>
                      At <strong>Basicutils.com</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you visit our website or use our services.
                    </Typography>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      1. Data We Collect
                    </Typography>
                    <List dense>
                      {[
                        "Contact information via forms (email + message)",
                        "Image metadata if you use tools like compression or cropping",
                        "Location data for services like Pic2Map (via EXIF or direct input)",
                        "Server logs processed via Grafana Cloud and Prometheus",
                      ].map((item, i) => (
                        <ListItem key={i} disablePadding>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      2. How We Use Your Data
                    </Typography>
                    <List dense>
                      {[
                        "Responding to your inquiries",
                        "Processing your images or data",
                        "Providing mapping and geocoding services",
                        "Performance monitoring",
                      ].map((item, i) => (
                        <ListItem key={i} disablePadding>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      3. Third-Party Services
                    </Typography>
                    <List dense>
                      {[
                        "OpenStreetMap & Nominatim for reverse geocoding",
                        "Grafana Cloud via Prometheus for analytics",
                        "MongoDB Atlas for optional image storage",
                      ].map((item, i) => (
                        <ListItem key={i} disablePadding>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      4. Data Security
                    </Typography>
                    <Typography>
                      We implement standard industry practices to safeguard your data. Email communications are not encrypted.
                    </Typography>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      5. Cookies
                    </Typography>
                    <Typography>
                      We do not use cookies for tracking. Authentication cookies are stored only for logged-in users.
                    </Typography>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      6. Data Retention and Deletion
                    </Typography>
                    <Typography>
                      Images are deleted within 24 hours unless explicitly opted-in for storage. Contact form data is only kept for follow-up.
                    </Typography>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      7. User Rights
                    </Typography>
                    <List dense>
                      {[
                        "Right to access and correct data",
                        "Right to delete personal data",
                        "Right to opt out of marketing (if applicable)",
                      ].map((item, i) => (
                        <ListItem key={i} disablePadding>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      8. Changes
                    </Typography>
                    <Typography>
                      Policy changes will be posted with updated effective dates. Please check back periodically.
                    </Typography>

                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
                      9. Contact Us
                    </Typography>
                    <List dense>
                      <ListItem disablePadding>
                        <ListItemText
                          primary={
                            <Typography>
                              Email:{" "}
                              <Link href="mailto:support@basicutils.com">
                                support@basicutils.com
                              </Link>
                            </Typography>
                          }
                        />
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemText
                          primary={
                            <Typography>
                              Contact Page:{" "}
                              <Link
                                href="https://basicutils.com/contactus"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                https://basicutils.com/contactus
                              </Link>
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PrivacyPolicy;
