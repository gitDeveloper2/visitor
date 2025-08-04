import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonateButton from "@/components/DonateButton";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Link,
} from "@mui/material";
import { Scale, Shield, FileText, AlertTriangle } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const Legal = () => {
  const legalSections = [
    {
      icon: FileText,
      title: "Terms of Use",
      description: "Detailed terms and conditions for using our platform and services.",
      link: "/terms"
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information.",
      link: "/privacy"
    },
    {
      icon: AlertTriangle,
      title: "Disclaimer",
      description: "Important disclaimers about our services and content.",
      link: "/disclaimer"
    },
    {
      icon: Scale,
      title: "DMCA Policy",
      description: "Our policy for handling copyright infringement claims.",
      link: "/dmca"
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
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
              background: "radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)",
              opacity: 0.3,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", maxWidth: "lg", margin: "0 auto" }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Scale style={{ width: 64, height: 64, color: "hsl(var(--primary))" }} />
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
                  fontSize: { xs: "2.5rem", md: "3.75rem" }
                }}
              >
                Legal Information
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Important legal documents and policies that govern the use of our platform.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Legal Sections */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              {legalSections.map((section, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={section.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      component={RouterLink}
                      to={section.link}
                      sx={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        backdropFilter: "blur(8px)",
                        height: "100%",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        textDecoration: "none",
                        "&:hover": {
                          borderColor: "hsl(var(--primary) / 0.5)",
                          boxShadow: "var(--shadow-elegant)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardHeader sx={{ textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                          <Box
                            sx={{
                              transition: "transform 0.3s",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <section.icon style={{ width: 48, height: 48, color: "hsl(var(--primary))" }} />
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: "bold",
                            transition: "color 0.2s",
                            "&:hover": { color: "hsl(var(--primary))" },
                          }}
                        >
                          {section.title}
                        </Typography>
                      </CardHeader>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {section.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* General Information */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: "lg", mx: "auto" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    backdropFilter: "blur(8px)",
                    p: 4,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
                  >
                    Important Information
                  </Typography>
                  <Stack spacing={3}>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      These legal documents are designed to protect both our users and our platform. 
                      We strive to{" "}
                      <Box component="span" sx={{ fontWeight: "bold" }}>
                        simplify and inspire technology
                      </Box>{" "}
                      while maintaining transparency about our practices and policies.
                    </Typography>
                    
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: "semibold", mb: 2 }}>
                        Last Updated
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        All legal documents were last updated on December 15, 2023. We may update these 
                        documents from time to time, and we will notify users of any significant changes.
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: "semibold", mb: 2 }}>
                        Contact for Legal Matters
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        If you have any questions about our legal policies or need to report a legal issue:
                      </Typography>
                      <Stack spacing={1} sx={{ color: "text.secondary", mb: 2 }}>
                        <Typography>• Email: legal@devtools.com</Typography>
                        <Typography>• Address: 123 Developer Street, San Francisco, CA 94102</Typography>
                        <Typography>• Phone: +1 (555) 123-4567</Typography>
                      </Stack>
                    </Box>
                    
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: "semibold", mb: 2 }}>
                        Governing Law
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        These terms and all related matters are governed by the laws of the State of California, 
                        United States, without regard to conflict of law principles.
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Legal;