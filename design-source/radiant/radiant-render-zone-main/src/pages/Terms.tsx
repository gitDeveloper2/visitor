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
  Stack,
} from "@mui/material";
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";

const Terms = () => {
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
            >
              <Box sx={{ textAlign: "center", maxWidth: "lg", mx: "auto" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <FileText style={{ width: 64, height: 64, color: "hsl(263 70% 50%)" }} />
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
                  Terms of Use
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  Please read these terms carefully before using our platform designed to{" "}
                  <strong>simplify and inspire technology</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: December 15, 2023
                </Typography>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Terms Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              
              {/* Acceptance of Terms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <CheckCircle style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Acceptance of Terms
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        By accessing and using DevTools ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                      </Typography>
                      <Typography>
                        These Terms of Use constitute a legally binding agreement between you and DevTools regarding your use of the Service.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Use License */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Scale style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Use License
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        Permission is granted to temporarily use DevTools for personal and commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 3 }}>
                        <li>Modify or copy the materials</li>
                        <li>Use the materials for any commercial purpose without proper attribution</li>
                        <li>Attempt to reverse engineer any software contained on the website</li>
                        <li>Remove any copyright or other proprietary notations from the materials</li>
                      </Typography>
                      <Typography>
                        This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* User Accounts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Shield style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        User Accounts
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account.
                      </Typography>
                      <Typography>
                        You agree not to use the Service to:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 3 }}>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe upon the rights of others</li>
                        <li>Transmit harmful, offensive, or inappropriate content</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Intellectual Property */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <FileText style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Intellectual Property
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        The Service and its original content, features, and functionality are and will remain the exclusive property of DevTools and its licensors. The Service is protected by copyright, trademark, and other laws.
                      </Typography>
                      <Typography>
                        Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Limitation of Liability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <AlertTriangle style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Limitation of Liability
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        In no event shall DevTools, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
                      </Typography>
                      <Typography>
                        This includes, without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Termination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <XCircle style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Termination
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
                      </Typography>
                      <Typography>
                        Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <FileText style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Contact Us
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      If you have any questions about these Terms of Use, please contact us:
                    </Typography>
                    <Typography>
                      Email: legal@devtools.com
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Stack>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Terms;