import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonateButton from "@/components/DonateButton";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { Code, Target, Users, Zap } from "lucide-react";

const AboutCompany = () => {
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
                About Our Company
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                We exist to{" "}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  simplify and inspire technology
                </Box>
                , empowering developers worldwide with innovative tools and resources.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Mission & Vision */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} sx={{ maxWidth: "xl", mx: "auto" }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Paper
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 4,
                      p: 4,
                      height: "100%",
                    }}
                  >
                    <Target style={{ width: 48, height: 48, color: "hsl(var(--primary))", marginBottom: 16 }} />
                    <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                      Our Mission
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      To democratize access to powerful development tools and knowledge, 
                      making complex technology simple and accessible for developers of all skill levels.
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Paper
                    sx={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 4,
                      p: 4,
                      height: "100%",
                    }}
                  >
                    <Zap style={{ width: 48, height: 48, color: "hsl(var(--primary))", marginBottom: 16 }} />
                    <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                      Our Vision
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      To become the go-to platform where developers find inspiration, 
                      learn new skills, and discover tools that accelerate their projects and career growth.
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Values */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", marginBottom: "4rem" }}
            >
              <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                Our Core Values
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Principles that guide everything we do
              </Typography>
            </motion.div>

            <Grid container spacing={4} sx={{ maxWidth: "xl", mx: "auto" }}>
              {[
                {
                  icon: Code,
                  title: "Innovation",
                  description: "Constantly pushing boundaries to create cutting-edge solutions that solve real problems."
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Building a supportive ecosystem where developers can learn, share, and grow together."
                },
                {
                  icon: Target,
                  title: "Excellence",
                  description: "Delivering high-quality tools and content that exceed expectations and drive success."
                }
              ].map((value, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={value.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Paper
                      sx={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 4,
                        p: 4,
                        textAlign: "center",
                        height: "100%",
                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: "hsl(var(--primary) / 0.5)",
                          boxShadow: "var(--shadow-elegant)",
                        },
                      }}
                    >
                      <value.icon style={{ width: 64, height: 64, color: "hsl(var(--primary))", margin: "0 auto 24px" }} />
                      <Typography variant="h5" component="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                        {value.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {value.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Company Stats */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ maxWidth: "lg", mx: "auto" }}>
              {[
                { number: "50K+", label: "Developers Served" },
                { number: "100+", label: "Tools Available" },
                { number: "500+", label: "Blog Articles" },
                { number: "99%", label: "Uptime" }
              ].map((stat, index) => (
                <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    style={{ textAlign: "center" }}
                  >
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                        fontSize: { xs: "2rem", md: "2.5rem" }
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                      {stat.label}
                    </Typography>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AboutCompany;