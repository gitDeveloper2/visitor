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
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { Shield, Eye, Lock, Database, UserCheck, AlertCircle } from "lucide-react";

const Privacy = () => {
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
                  Privacy Policy
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  Your privacy is important to us. Learn how we protect your data while we{" "}
                  <strong>simplify and inspire technology</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: December 15, 2023
                </Typography>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Privacy Overview */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ maxWidth: "xl", mx: "auto", mb: 8 }}>
              {[
                {
                  icon: Eye,
                  title: "Transparency",
                  description: "We're clear about what data we collect and how we use it."
                },
                {
                  icon: Lock,
                  title: "Security",
                  description: "Your data is protected with industry-standard encryption."
                },
                {
                  icon: UserCheck,
                  title: "Control",
                  description: "You have full control over your personal information."
                }
              ].map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <item.icon style={{ width: 48, height: 48, color: "hsl(263 70% 50%)" }} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Privacy Policy Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              
              {/* Information We Collect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Database style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Information We Collect
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        <strong style={{ color: "hsl(0 0% 98%)" }}>Personal Information:</strong> When you create an account, we collect your name, email address, and any profile information you choose to provide.
                      </Typography>
                      <Typography>
                        <strong style={{ color: "hsl(0 0% 98%)" }}>Usage Data:</strong> We collect information about how you use our tools, including which features you access and how long you spend using them.
                      </Typography>
                      <Typography>
                        <strong style={{ color: "hsl(0 0% 98%)" }}>Technical Data:</strong> We automatically collect certain technical information, such as your IP address, browser type, and device information.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* How We Use Your Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Eye style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        How We Use Your Information
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        <strong style={{ color: "hsl(0 0% 98%)" }}>Service Provision:</strong> To provide and maintain our tools and services, including processing your requests and improving functionality.
                      </Typography>
                      <Typography>
                        <strong style={{ color: "hsl(0 0% 98%)" }}>Communication:</strong> To send you important updates, respond to your inquiries, and provide customer support.
                      </Typography>
                      <Typography>
                        <strong style={{ color: "hsl(0 0% 98%)" }}>Improvement:</strong> To analyze usage patterns and improve our tools and user experience.
                      </Typography>
                      <Typography>
                        <strong style={{ color: "hsl(0 0% 98%)" }}>Security:</strong> To protect against fraud, abuse, and security threats.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data Protection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Lock style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Data Protection
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        We implement industry-standard security measures to protect your personal information, including:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 3 }}>
                        <li>Encryption of data in transit and at rest</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls and authentication</li>
                        <li>Secure data centers and infrastructure</li>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Your Rights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <UserCheck style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Your Rights
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      <Typography>
                        You have the right to:
                      </Typography>
                      <Typography component="ul" sx={{ pl: 3 }}>
                        <li>Access your personal data</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your data</li>
                        <li>Object to processing of your data</li>
                        <li>Data portability</li>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <AlertCircle style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        Contact Us
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </Typography>
                    <Typography>
                      Email: privacy@devtools.com
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

export default Privacy;