"use client";

import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { FileText } from "lucide-react";
import DonateButton from "../../components/DonateButton";
import Footer from "../../components/Footer";

const FAQS = () => {
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
                  fontSize: { xs: "2.5rem", md: "3.75rem" },
                }}
              >
                Frequently Asked Questions (FAQs)
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                Common questions about Basicutils.com’s tools, articles, and support.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: August 4, 2025
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* FAQ Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={6} sx={{ maxWidth: "lg", mx: "auto", color: "text.secondary" }}>
              
              {/* General */}
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  General
                </Typography>
                <Box component="dl" sx={{ pl: 2 }}>
                  <Typography component="dt" fontWeight="bold" mb={1}>
                    What is Basicutils.com?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    Basicutils.com is a platform that provides programming-related articles and interactive tools for image processing. Our goal is to help developers and tech enthusiasts enhance their skills and workflows.
                  </Typography>

                  <Typography component="dt" fontWeight="bold" mb={1}>
                    Is Basicutils.com free to use?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    Yes, all tools and articles on Basicutils.com are free to access and use.
                  </Typography>
                </Box>
              </Box>

              {/* Tools */}
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Tools
                </Typography>
                <Box component="dl" sx={{ pl: 2 }}>
                  <Typography component="dt" fontWeight="bold" mb={1}>
                    What tools are available on Basicutils.com?
                  </Typography>
                  <Typography component="dd" mb={2}>
                    We offer the following tools:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                    <li><strong>Pic2Map:</strong> Converts images into location-rich maps using GPS data.</li>
                    <li><strong>Image Compressor:</strong> Optimizes images without compromising quality.</li>
                    <li><strong>Image Resizer:</strong> Adjusts the dimensions of images quickly and easily.</li>
                    <li><strong>Image Cropper:</strong> Allows you to trim and crop images effortlessly.</li>
                  </Box>

                  <Typography component="dt" fontWeight="bold" mb={1}>
                    Do you store uploaded images?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    No, we do not store uploaded images by default. However, users can choose to allow us to store their images for public display as samples.
                  </Typography>

                  <Typography component="dt" fontWeight="bold" mb={1}>
                    Is my data secure?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    Yes, we prioritize the security of your data. Images and metadata processed through our tools are not stored unless explicitly permitted by the user.
                  </Typography>

                  <Typography component="dt" fontWeight="bold" mb={1}>
                    What formats are supported for image processing?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    Most standard image formats, such as JPEG and PNG, are supported.
                  </Typography>
                </Box>
              </Box>

              {/* Articles */}
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Articles
                </Typography>
                <Box component="dl" sx={{ pl: 2 }}>
                  <Typography component="dt" fontWeight="bold" mb={1}>
                    What topics do the articles cover?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    Our articles focus on programming-related topics, including coding practices, tools, and frameworks, to help developers learn and grow.
                  </Typography>

                  <Typography component="dt" fontWeight="bold" mb={1}>
                    Can I share the articles?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    Yes, you may share links to our articles. However, redistribution or republishing the content without permission is prohibited.
                  </Typography>
                </Box>
              </Box>

              {/* Contact and Support */}
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Contact and Support
                </Typography>
                <Box component="dl" sx={{ pl: 2 }}>
                  <Typography component="dt" fontWeight="bold" mb={1}>
                    How can I contact Basicutils.com?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    You can contact us through the{" "}
                    <Link href="/contactus" color="primary" underline="hover">
                      Contact Us
                    </Link>{" "}
                    page or by sending an email to support@basicutils.com.
                  </Typography>

                  <Typography component="dt" fontWeight="bold" mb={1}>
                    What if I encounter a problem with a tool?
                  </Typography>
                  <Typography component="dd" mb={3}>
                    If you encounter any issues, please report them through the{" "}
                    <Link href="/contactus" color="primary" underline="hover">
                      Contact Us
                    </Link>{" "}
                    page. We’ll do our best to assist you.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default FAQS;
