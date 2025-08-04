"use client"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  List,
  ListItem,
  ListItemText,
  useTheme
} from "@mui/material";
import {
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield
} from "lucide-react";


// Make this page statically rendered at build time
export const dynamic = "error";

const sections = [
  {
    icon: CheckCircle,
    title: "Acceptance of Terms",
    content: [
      `By accessing and using BasicUtils ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
      "These Terms of Use constitute a legally binding agreement between you and BasicUtils regarding your use of the Service."
    ]
  },
  {
    icon: Scale,
    title: "Use License",
    content: [
      "Permission is granted to temporarily use BasicUtils for personal and commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:"
    ],
    list: [
      "Modify or copy the materials",
      "Use the materials for any commercial purpose without proper attribution",
      "Attempt to reverse engineer any software contained on the website",
      "Remove any copyright or other proprietary notations from the materials"
    ],
    afterList: [
      "This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time."
    ]
  },
  {
    icon: Shield,
    title: "User Accounts",
    content: [
      "When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account.",
      "You agree not to use the Service to:"
    ],
    list: [
      "Violate any applicable laws or regulations",
      "Infringe upon the rights of others",
      "Transmit harmful, offensive, or inappropriate content",
      "Attempt to gain unauthorized access to our systems"
    ]
  },
  {
    icon: FileText,
    title: "Intellectual Property",
    content: [
      "The Service and its original content, features, and functionality are and will remain the exclusive property of BasicUtils and its licensors. The Service is protected by copyright, trademark, and other laws.",
      "Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent."
    ]
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: [
      "In no event shall BasicUtils, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.",
      "This includes, without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service."
    ]
  },
  {
    icon: XCircle,
    title: "Termination",
    content: [
      "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.",
      "Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service."
    ]
  },
  {
    icon: FileText,
    title: "Contact Us",
    content: [
      "If you have any questions about these Terms of Use, please contact us:",
      "Email: support@basicutils.com"
    ]
  }
];

const TermsPage = () => {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      
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
              opacity: 0.3
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ textAlign: "center", mx: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <FileText style={{ width: 64, height: 64, color: iconColor }} />
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
          </Container>
        </Box>

        {/* Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4}>
              {sections.map((section) => (
                <Card key={section.title} elevation={3}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <section.icon style={{ width: 24, height: 24, color: iconColor }} />
                      <Typography variant="h5" fontWeight="bold">
                        {section.title}
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      {section.content.map((text, i) => (
                        <Typography key={i}>{text}</Typography>
                      ))}
                      {section.list && (
                        <List dense>
                          {section.list.map((item, i) => (
                            <ListItem key={i} disablePadding>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      )}
                      {section.afterList &&
                        section.afterList.map((text, i) => (
                          <Typography key={`after-${i}`}>{text}</Typography>
                        ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default TermsPage;
