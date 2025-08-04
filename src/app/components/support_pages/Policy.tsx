'use client';

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Stack, Card, CardContent, Divider, Link } from '@mui/material';
import { StyledSectionGrid } from '../layout/Spacing';

const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();

  return (
    <StyledSectionGrid theme={theme} y16 id="policy">
      <Card
        elevation={0}
        sx={{
          p: { xs: 2, md: 6 },
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[12],
          borderRadius: 4,
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        <CardContent>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Effective Date:</strong> 1st November 2024
              </Typography>
            </Box>

            <Typography>
              At <strong>Basicutils.com</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you visit our website or use our services. By using our website and services, you consent to the practices outlined in this policy.
            </Typography>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                1. Data We Collect
              </Typography>
              <ul>
                <li><strong>Contact Information:</strong> When you contact us via our "Contact Us" form, we collect your email address and message. This is used only to respond and is not stored unless needed for communication.</li>
                <li><strong>Image Data:</strong> When using our tools, we collect image metadata (e.g., EXIF). We store this only with explicit consent for public display, stored securely in <strong>MongoDB Atlas</strong>.</li>
                <li><strong>Location Data:</strong> Used for mapping in <strong>Pic2Map</strong> and reverse geocoded via <strong>OpenStreetMap</strong>.</li>
                <li><strong>Server Logs:</strong> We collect anonymized IP/device logs via <strong>Grafana Cloud</strong> and <strong>Prometheus</strong> for monitoring.</li>
              </ul>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                2. How We Use Your Data
              </Typography>
              <ul>
                <li>To respond to inquiries.</li>
                <li>To process image-related requests.</li>
                <li>To offer mapping/location services.</li>
                <li>To optimize site functionality via metrics.</li>
              </ul>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                3. Third-Party Services
              </Typography>
              <ul>
                <li><strong>OpenStreetMap / Nominatim:</strong> For GPS-to-location conversion.</li>
                <li><strong>Grafana Cloud, Prometheus, Loki:</strong> For site performance monitoring.</li>
                <li><strong>MongoDB Atlas:</strong> For opt-in image storage.</li>
              </ul>
              <Typography variant="body2">
                These third-party services have their own privacy policies.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                4. Data Security
              </Typography>
              <Typography>
                We use standard protections to secure your data. While emails aren't encrypted, we strive to safeguard all user data appropriately.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                5. Cookies
              </Typography>
              <Typography>
                We don't track users with cookies unless you log in. Session cookies are used for authentication purposes only.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                6. Data Retention and Deletion
              </Typography>
              <Typography>
                Data is kept only as long as needed. Image data is deleted within 24 hours unless you opt-in for storage (in MongoDB Atlas).
              </Typography>
              <Typography variant="body2">
                Contact us if you’d like your data deleted.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                7. User Rights
              </Typography>
              <ul>
                <li>Access or correct your personal data.</li>
                <li>Request deletion unless legally restricted.</li>
                <li>Opt out of marketing (we don’t send any by default).</li>
              </ul>
              <Typography variant="body2">
                Reach us via the contact info below to exercise your rights.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                8. Changes to This Policy
              </Typography>
              <Typography>
                We may revise this policy over time. Updates will be posted here.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                9. Contact Us
              </Typography>
              <ul>
                <li><strong>Email:</strong>{' '}
                  <Link href="mailto:support@basicutils.com">
                    support@basicutils.com
                  </Link>
                </li>
                <li><strong>Contact Page:</strong>{' '}
                  <Link href="https://basicutils.com/contactus" target="_blank" rel="noopener">
                    https://basicutils.com/contactus
                  </Link>
                </li>
              </ul>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </StyledSectionGrid>
  );
};

export default PrivacyPolicy;
