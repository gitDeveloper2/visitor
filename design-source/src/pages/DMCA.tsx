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
import { Shield, Mail, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const DMCA = () => {
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
                  <Shield style={{ width: 64, height: 64, color: "hsl(263 70% 50%)" }} />
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
                  DMCA Policy
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  Our commitment to respecting intellectual property rights while we{" "}
                  <strong>simplify and inspire technology</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: December 15, 2023
                </Typography>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* DMCA Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <FileText style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        DMCA Overview
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        DevTools respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement committed using our service.
                      </Typography>
                      <Typography>
                        If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to our designated DMCA agent with the information specified below.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Filing a DMCA Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Mail style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Filing a DMCA Notice
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        To file a DMCA takedown notice, please provide the following information in writing:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 3 }}>
                        <li><strong style={{ color: "hsl(0 0% 98%)" }}>Identification of the copyrighted work:</strong> Provide details of the copyrighted work that you claim has been infringed, including the title, description, and any registration numbers.</li>
                        <li><strong style={{ color: "hsl(0 0% 98%)" }}>Identification of the infringing material:</strong> Provide the URL or location of the material you claim is infringing, with enough detail to allow us to locate it.</li>
                        <li><strong style={{ color: "hsl(0 0% 98%)" }}>Contact information:</strong> Include your full name, mailing address, telephone number, and email address.</li>
                        <li><strong style={{ color: "hsl(0 0% 98%)" }}>Good faith statement:</strong> A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
                        <li><strong style={{ color: "hsl(0 0% 98%)" }}>Accuracy statement:</strong> A statement that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the copyright owner.</li>
                        <li><strong style={{ color: "hsl(0 0% 98%)" }}>Signature:</strong> Your physical or electronic signature.</li>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Our Response Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <CheckCircle style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Our Response Process
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        Upon receipt of a valid DMCA notice, we will:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 3 }}>
                        <li>Review the notice for completeness and validity</li>
                        <li>Remove or disable access to the allegedly infringing material</li>
                        <li>Notify the user who posted the content</li>
                        <li>Provide the user with an opportunity to submit a counter-notice</li>
                        <li>Restore the content if a valid counter-notice is received</li>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Counter-Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <AlertCircle style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Counter-Notice
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        If you believe your content was removed in error, you may submit a counter-notice containing:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 3 }}>
                        <li>Your contact information</li>
                        <li>Identification of the removed content and its location</li>
                        <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                        <li>Your consent to local federal court jurisdiction</li>
                        <li>Your physical or electronic signature</li>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Mail style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Contact Our DMCA Agent
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        Please send all DMCA notices and counter-notices to our designated agent:
                      </Typography>
                      <Typography>
                        Email: dmca@devtools.com
                      </Typography>
                      <Typography>
                        Address: 123 Developer Street, San Francisco, CA 94102
                      </Typography>
                      <Typography>
                        Phone: +1 (555) 123-4567
                      </Typography>
                    </Stack>
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

export default DMCA;