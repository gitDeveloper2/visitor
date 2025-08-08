"use client";

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
  Link as MuiLink,
} from "@mui/material";
import {
  FileText,
  Info,
  Lightbulb,
  HeartHandshake,
  Users,
} from "lucide-react";

import DonateButton from "@components/DonateButton";
import Footer from "@components/Footer";

const AboutUs = () => {
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
                "radial-gradient(circle, rgba(103, 58, 183, 0.1) 0%, transparent 70%)",
              opacity: 0.25,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ textAlign: "center", maxWidth: "lg", mx: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Info style={{ width: 64, height: 64, color: "hsl(263 70% 50%)" }} />
              </Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #7e57c2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2.5rem", md: "3.75rem" },
                }}
              >
                About Us
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                Empowering developers with simple tools and rich programming insights.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Content Sections */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              {[
                {
                  icon: FileText,
                  title: "Our Mission",
                  content:
                    "Founded in 2024, BasicUtils.com is a platform dedicated to providing high-quality programming articles and practical online tools. Our goal is to simplify development workflows and educate through well-researched, actionable content.",
                },
                {
                  icon: Lightbulb,
                  title: "What We Offer",
                  content: (
                    <>
                      <Typography>We provide:</Typography>
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemText
                            primary={
                              <>
                                <strong>Programming Articles:</strong> Covering core to advanced concepts.
                              </>
                            }
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary={<><strong>Tools:</strong></>} />
                        </ListItem>
                        <List disablePadding dense sx={{ pl: 3 }}>
                          {[
                            { label: "Pic2Map", href: "/pic2map", desc: "Extract GPS from images." },
                            { label: "Image Compressor", href: "/imagecompressor" },
                            { label: "Image Resizer", href: "/imageresizer" },
                            { label: "Image Cropper", href: "/imagecropper" },
                          ].map(({ label, href, desc }) => (
                            <ListItem key={label} disableGutters>
                              <ListItemText
                                primary={<MuiLink href={href}>{label}</MuiLink>}
                                secondary={desc}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </List>
                    </>
                  ),
                },
                {
                  icon: HeartHandshake,
                  title: "Why Choose Us",
                  content: (
                    <List dense disablePadding>
                      {[
                        "Specialized Content: Focused purely on developer needs.",
                        "User-Centric Tools: Fast, clean and easy to use.",
                        "High Quality: Built with care, optimized for usability.",
                      ].map((text, i) => (
                        <ListItem key={i} disableGutters>
                          <ListItemText primary={text} />
                        </ListItem>
                      ))}
                    </List>
                  ),
                },
                {
                  icon: Users,
                  title: "Featured In",
                  content: (
                    <List dense disablePadding>
                      {[
                        {
                          label: "Steemit: Understanding Photo Metadata",
                          href: "https://steemit.com/exif/@iamjustin2/understanding-photo-metadata-what-you-need-to-know",
                        },
                        {
                          label: "Dev.to: Discovering GPS Locations",
                          href: "https://dev.to/horace_karatu_7dfd55f0f1f/unveiling-the-secrets-of-your-photos-discovering-gps-locations-27h1",
                        },
                        {
                          label: "GitHub Gist: Photo Metadata",
                          href: "https://gist.github.com/gitDeveloper3/76d854e2f0d58cbb06d082a0bfcc6fff",
                        },
                        {
                          label: "Hashnode: Photo Geolocation",
                          href: "https://vortexnode.hashnode.dev/discover-the-power-of-photo-geolocation",
                        },
                        {
                          label: "Blogger: EXIF Metadata",
                          href: "https://vo-code.blogspot.com/2024/12/understanding-exif-metadata-in-images.html",
                        },
                      ].map(({ label, href }) => (
                        <ListItem key={label} disableGutters>
                          <ListItemText
                            primary={
                              <MuiLink href={href} target="_blank" rel="noopener noreferrer">
                                {label}
                              </MuiLink>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ),
                },
                {
                  icon: Info,
                  title: "Let’s Connect",
                  content: (
                    <>
                      <Typography>We welcome collaboration and feedback.</Typography>
                      <Typography>
                        Email us at{" "}
                        <MuiLink href="mailto:support@basicutils.com">
                          support@basicutils.com
                        </MuiLink>
                      </Typography>
                    </>
                  ),
                },
              ].map(({ icon: Icon, title, content }, i) => (
                <Card key={title}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Icon style={{ width: 24, height: 24, color: "hsl(263 70% 50%)" }} />
                      <Typography variant="h5" fontWeight="bold">
                        {title}
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ color: "text.secondary" }}>
                      {content}
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

export default AboutUs;
