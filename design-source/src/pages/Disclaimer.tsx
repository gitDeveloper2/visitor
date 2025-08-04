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
  Link,
} from "@mui/material";
import { AlertTriangle, Info, Shield, ExternalLink } from "lucide-react";

const Disclaimer = () => {
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
                <AlertTriangle style={{ width: 64, height: 64, color: "hsl(var(--primary))" }} />
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
                Disclaimer
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Important disclaimers about our platform and services as we{" "}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  simplify and inspire technology
                </Box>
                .
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: December 15, 2023
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Disclaimer Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: "lg", mx: "auto" }}>
              <Stack spacing={4}>
                
                {/* General Disclaimer */}
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
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <Info style={{ width: 24, height: 24, color: "hsl(var(--primary))" }} />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                          General Disclaimer
                        </Typography>
                      </Box>
                      <Stack spacing={2} sx={{ color: "text.secondary" }}>
                        <Typography>
                          The information contained on DevTools website is for general information purposes only. The information is provided by DevTools and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
                        </Typography>
                        <Typography>
                          Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tools and Services Disclaimer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <Shield style={{ width: 24, height: 24, color: "hsl(var(--primary))" }} />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                          Tools and Services
                        </Typography>
                      </Box>
                      <Stack spacing={2} sx={{ color: "text.secondary" }}>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Educational Purpose:
                          </Box>{" "}
                          Our tools and content are provided for educational and informational purposes. They should not be considered as professional advice for production environments without proper testing and validation.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            No Warranty:
                          </Box>{" "}
                          We provide our tools "as is" without any warranty, express or implied. We do not guarantee that our tools will be error-free, secure, or suitable for your specific needs.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            User Responsibility:
                          </Box>{" "}
                          Users are responsible for testing and validating any code, configurations, or outputs generated by our tools before using them in production environments.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Data Loss:
                          </Box>{" "}
                          We are not responsible for any data loss, corruption, or damage that may occur from using our tools or services.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* External Links Disclaimer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <ExternalLink style={{ width: 24, height: 24, color: "hsl(var(--primary))" }} />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                          External Links
                        </Typography>
                      </Box>
                      <Stack spacing={2} sx={{ color: "text.secondary" }}>
                        <Typography>
                          Through this website you may be able to link to other websites which are not under the control of DevTools. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
                        </Typography>
                        <Typography>
                          Every effort is made to keep the website up and running smoothly. However, DevTools takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Content Accuracy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <AlertTriangle style={{ width: 24, height: 24, color: "hsl(var(--primary))" }} />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                          Content Accuracy
                        </Typography>
                      </Box>
                      <Stack spacing={2} sx={{ color: "text.secondary" }}>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Best Practices:
                          </Box>{" "}
                          While we strive to provide accurate and up-to-date information, technology evolves rapidly. Best practices, frameworks, and tools change frequently.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Version Compatibility:
                          </Box>{" "}
                          Code examples and tutorials may not be compatible with all versions of software, libraries, or frameworks. Always check compatibility with your specific environment.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Third-Party Information:
                          </Box>{" "}
                          Some content may reference third-party tools, services, or documentation. We are not responsible for changes to external services or their documentation.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Community Contributions:
                          </Box>{" "}
                          Some content may be contributed by the community. While we moderate content, we cannot guarantee the accuracy of all community-contributed material.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Security Considerations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <Shield style={{ width: 24, height: 24, color: "hsl(var(--primary))" }} />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                          Security Considerations
                        </Typography>
                      </Box>
                      <Stack spacing={2} sx={{ color: "text.secondary" }}>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Security Testing:
                          </Box>{" "}
                          Any code, configurations, or security-related content should be thoroughly tested in a safe environment before implementation.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            Vulnerability Disclosure:
                          </Box>{" "}
                          If you discover any security vulnerabilities in our tools or content, please report them responsibly to security@devtools.com.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            No Security Guarantee:
                          </Box>{" "}
                          We do not guarantee that our tools or content are free from security vulnerabilities or that they meet specific security standards.
                        </Typography>
                        <Typography>
                          <Box component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
                            User Responsibility:
                          </Box>{" "}
                          Users are responsible for implementing appropriate security measures in their own projects and environments.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Limitation of Liability */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <AlertTriangle style={{ width: 24, height: 24, color: "hsl(var(--primary))" }} />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                          Limitation of Liability
                        </Typography>
                      </Box>
                      <Stack spacing={2} sx={{ color: "text.secondary" }}>
                        <Typography>
                          To the maximum extent permitted by applicable law, DevTools shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
                          <Typography component="li">Your use or inability to use our services</Typography>
                          <Typography component="li">Any unauthorized access to or use of our servers and/or any personal information stored therein</Typography>
                          <Typography component="li">Any interruption or cessation of transmission to or from our services</Typography>
                          <Typography component="li">Any bugs, viruses, trojan horses, or the like that may be transmitted through our services</Typography>
                          <Typography component="li">Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content</Typography>
                        </Box>
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
                  <Card
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                      textAlign: "center",
                      p: 4,
                    }}
                  >
                    <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                      Questions About This Disclaimer?
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      If you have any questions about this disclaimer or need clarification on any point, please contact us:
                    </Typography>
                    <Stack spacing={1} sx={{ color: "text.secondary" }}>
                      <Typography>
                        Email:{" "}
                        <Link href="mailto:legal@devtools.com" sx={{ color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                          legal@devtools.com
                        </Link>
                      </Typography>
                      <Typography>Address: 123 Developer Street, San Francisco, CA 94102</Typography>
                      <Typography>Phone: +1 (555) 123-4567</Typography>
                    </Stack>
                  </Card>
                </motion.div>
              </Stack>
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Disclaimer;