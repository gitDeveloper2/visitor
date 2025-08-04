// "use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FileText } from "lucide-react";
import DonateButton from "../../components/DonateButton";

const DCMA = () => {
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
                DMCA Policy
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                Basicutils.com’s policy on copyright infringement and related procedures.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: August 4, 2025
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* DMCA Content */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              <Box>
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} sx={{ color: "text.secondary" }}>
                      <Typography paragraph>
                        Basicutils.com respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to claims of copyright infringement on our platform. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please notify us as outlined below.
                      </Typography>

                      <Typography variant="h5" fontWeight="bold">
                        Filing a DMCA Complaint
                      </Typography>
                      <Typography paragraph>
                        If you are the copyright owner or an agent authorized to act on behalf of one, and you believe that your copyrighted work has been infringed, please provide us with the following information in writing:
                      </Typography>
                      <List>
                        <ListItem disableGutters>
                          <ListItemText primary="Your name, address, phone number, and email address." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="A description of the copyrighted work that you claim has been infringed." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="A description of where the infringing material is located on our website, including a URL or other specific location information." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="A statement by you that you have a good-faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="A statement by you, made under penalty of perjury, that the information in your notification is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="Your electronic or physical signature." />
                        </ListItem>
                      </List>
                      <Typography paragraph>
                        Please send your DMCA notice to the following contact information:
                      </Typography>
                      <Typography component="address" sx={{ fontStyle: "normal", whiteSpace: "pre-line" }}>
                        Email: support@basicutils.com{"\n"}
                        Subject: DMCA Complaint
                      </Typography>

                      <Typography variant="h5" fontWeight="bold">
                        Counter-Notification
                      </Typography>
                      <Typography paragraph>
                        If you believe that the material removed or disabled due to a DMCA complaint was removed in error or misidentification, you may file a counter-notification with us. Your counter-notification must include:
                      </Typography>
                      <List>
                        <ListItem disableGutters>
                          <ListItemText primary="Your name, address, phone number, and email address." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="A description of the material that has been removed or disabled and the location where it appeared before it was removed or disabled." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="A statement under penalty of perjury that you have a good-faith belief that the material was removed or disabled as a result of mistake or misidentification." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="A statement that you consent to the jurisdiction of the federal court in your district or, if you are outside the United States, in any judicial district in which Basicutils.com may be found, and that you will accept service of process from the person who filed the original DMCA notice or an agent of such person." />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText primary="Your electronic or physical signature." />
                        </ListItem>
                      </List>
                      <Typography paragraph>
                        Send your counter-notification to the same contact details as above with the subject line: "DMCA Counter-Notification."
                      </Typography>

                      <Typography variant="h5" fontWeight="bold">
                        Repeat Infringers
                      </Typography>
                      <Typography paragraph>
                        Basicutils.com reserves the right to terminate accounts or access to users who are found to be repeat infringers under the DMCA or applicable law.
                      </Typography>

                      <Typography paragraph>
                        For further questions regarding our DMCA policy, please contact us through our{" "}
                        <Link href="/contactus" color="primary">
                          Contact Us
                        </Link>{" "}
                        page.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DCMA;
