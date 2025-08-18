"use client";

import React from "react";
import NextLink from "next/link";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Code,
  FileText,
  Users,
  Star,
} from "lucide-react";
import { commonStyles, getGlassStyles } from "../../utils/themeUtils";

const Footer = () => {
  const theme = useTheme();

  const footerLinks = {
    product: [
      { name: "Tools", href: "/launch", icon: Code },
      { name: "Blog", href: "/blogs", icon: FileText },
      { name: "Pricing", href: "/pricing", icon: Star },
      { name: "About", href: "/aboutus", icon: Users },
      { name: "Contact", href: "/contactus", icon: Mail },
    ],
    social: [
      { name: "GitHub", href: "https://github.com", icon: Github },
      { name: "Twitter", href: "https://twitter.com", icon: Twitter },
      { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
      { name: "Email", href: "mailto:hello@basicutils.com", icon: Mail },
    ],
  };

  const legalLinks: Array<{
    label: string;
    href: string;
    onClick?: () => void;
  }> = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "DMCA", href: "/dcma-policy" },
    { label: "Privacy & Cookies", href: "#", onClick: () => window.dispatchEvent(new CustomEvent('openCookiePreferences')) },
    // { label: "Legal", href: "/legal" },
  ];

  // Detect external links (http, mailto)
  const isExternal = (url: string) =>
    url.startsWith("http") || url.startsWith("mailto:");

  // Detect hash links (start with '#')
  const isHashLink = (url: string) => url.startsWith("#");

  // Render a link that uses NextLink for internal page links,
  // plain anchor for hash links or external links.
  const RenderLink = ({
    href,
    children,
    onClick,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: any;
  }) => {
    if (onClick) {
      // Link with custom onClick handler
      return (
        <Link
          href={href}
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          sx={{ cursor: 'pointer' }}
          {...props}
        >
          {children}
        </Link>
      );
    } else if (isExternal(href)) {
      // External link
      return (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    } else if (isHashLink(href)) {
      // Hash link (anchor on same page)
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
        );
    } else {
      // Internal page link, use NextLink for SPA navigation
      return (
        <Link component={NextLink} href={href} {...props}>
          {children}
        </Link>
      );
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bgcolor: theme.palette.background.default,
        borderTop: `1px solid ${theme.custom.glass.border}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(to bottom, transparent, ${theme.palette.primary.main}20)`,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 4, sm: 6 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: theme.shape.borderRadius,
                    background: theme.custom.gradients.primary,
                  }}
                >
                  <Code size={24} color="#fff" />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    ...commonStyles.textGradient(theme),
                  }}
                >
                  BasicUtils
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Empowering developers with powerful tools and insightful
                resources. Build better, code smarter, and stay inspired.
              </Typography>
            </Box>

            {/* Social Links */}
            <Box display="flex" gap={2}>
              {footerLinks.social.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    ...getGlassStyles(theme),
                    borderRadius: "50%",
                    "&:hover": {
                      borderColor: `${theme.palette.primary.main}50`,
                      boxShadow: theme.custom.shadows.neon,
                    },
                  }}
                >
                  <social.icon
                    style={{
                      width: 20,
                      height: 20,
                      color: theme.palette.text.primary,
                    }}
                  />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Product Links */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Product
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {footerLinks.product.map((link) => (
                <Box component="li" key={link.name} sx={{ mb: 1 }}>
                  <RenderLink
                    href={link.href}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: theme.palette.text.secondary,
                      textDecoration: "none",
                      transition: "color 0.2s",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    <link.icon size={16} />
                    {link.name}
                  </RenderLink>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box sx={{ pt: { xs: 6, sm: 8 }, borderTop: `1px solid ${theme.custom.glass.border}` }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: "0.95rem" }}
            >
              © 2024 BasicUtils. All rights reserved.
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                sx={{ color: theme.palette.text.secondary, fontSize: "0.95rem" }}
              >
                Made with
              </Typography>
              <Heart size={16} style={{ color: theme.palette.primary.main }} />
              <Typography
                sx={{ color: theme.palette.text.secondary, fontSize: "0.95rem" }}
              >
                for developers
              </Typography>
            </Box>
          </Box>

          {/* Legal Links */}
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "center",
                gap: { xs: 1, sm: 3 },
                flexWrap: "wrap",
              }}
            >
              {legalLinks.map((link) => (
                <RenderLink
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  {link.label}
                </RenderLink>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
