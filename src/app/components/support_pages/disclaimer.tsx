import { Box, Container, Typography, Card, CardContent, Stack, Link } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import DonateButton from "../../components/DonateButton";
import Footer from "../../components/Footer";

const Disclaimer = () => {
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
            <Box sx={{ textAlign: "center", maxWidth: "lg", mx: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <AlertTriangle style={{ width: 64, height: 64, color: "hsl(263 70% 50%)" }} />
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
                Disclaimer
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                Please read this disclaimer carefully before using our platform.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: August 4, 2025
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Disclaimer Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography color="text.secondary" paragraph>
                    The information provided on Basicutils.com is for general informational and educational purposes only. While we strive to ensure that the content on our website is accurate, complete, and up-to-date, we make no guarantees regarding the reliability, suitability, or availability of the content. Any reliance you place on such information is strictly at your own risk.
                  </Typography>

                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                    No Professional Advice
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    The articles and tools provided on Basicutils.com are not intended as a substitute for professional advice. For specific advice tailored to your situation, please consult a qualified professional.
                  </Typography>

                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                    External Links
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Our website may contain links to third-party websites or services. These links are provided for your convenience and do not signify our endorsement of the content or services provided by these third parties. We are not responsible for the content, privacy practices, or availability of these external sites.
                  </Typography>

                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                    Limitation of Liability
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    To the fullest extent permitted by applicable law, Basicutils.com disclaims all liability for any loss, injury, or damage of any kind arising out of your use of our website, articles, tools, or reliance on any information provided therein.
                  </Typography>

                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                    Changes to Content
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    We reserve the right to modify, update, or remove content on Basicutils.com at any time without prior notice. It is your responsibility to review this page periodically to stay informed of any changes.
                  </Typography>

                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                    Contact Us
                  </Typography>
                  <Typography color="text.secondary">
                    If you have any questions or concerns about this disclaimer, please reach out to us through our{" "}
                    <Link href="/contactus" color="primary">
                      Contact Us
                    </Link>{" "}
                    page or via email at{" "}
                    <Link href="mailto:support@basicutils.com" color="primary">
                      support@basicutils.com
                    </Link>
                    .
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Disclaimer;
