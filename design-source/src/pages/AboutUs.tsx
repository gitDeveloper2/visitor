import { Box, Container, Typography, Avatar, Grid, Paper, Stack, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonateButton from "@/components/DonateButton";

 const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Full-stack developer with 10+ years experience building scalable web applications.",
      avatar: "https://i.pravatar.cc/150?u=alex",
      social: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "DevOps expert passionate about automation and cloud infrastructure.",
      avatar: "/placeholder.svg",
      social: { github: "#", linkedin: "#" }
    },
    {
      name: "Michael Brown",
      role: "Lead Developer",
      bio: "Frontend specialist focused on creating beautiful and intuitive user experiences.",
      avatar: "/placeholder.svg",
      social: { github: "#", twitter: "#" }
    },
    {
      name: "Emma Davis",
      role: "Content Manager",
      bio: "Technical writer who makes complex concepts easy to understand.",
      avatar: "/placeholder.svg",
      social: { linkedin: "#", twitter: "#" }
    }
  ];

const AboutUs = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "hsl(var(--background))" }}>
      <Header />
      <DonateButton />

      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          pt: 20,
          pb: 16,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
            opacity: 0.1,
            zIndex: 0,
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              component="h1"
              fontWeight={800}
              gutterBottom
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                background: "var(--gradient-primary)",
                backgroundClip: "text",
                color: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "hsl(var(--muted-foreground))", maxWidth: 600, mx: "auto", mb: 6 }}
            >
              Meet the passionate team behind the mission to{" "}
              <strong>simplify and inspire technology</strong> for developers worldwide.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Our Story */}
      <Box component="section" sx={{ py: 0 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
              Our Story
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              sx={{ color: "hsl(var(--muted-foreground))", mb: 6 }}
            >
              Started in 2020 by a group of developers who were frustrated with scattered tools and
              fragmented resources, we set out to create a unified platform that would make
              development more efficient and enjoyable.
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(16px)",
              }}
            >
              <Typography sx={{ color: "hsl(var(--muted-foreground))", mb: 2 }}>
                What began as a small collection of personal tools has grown into a comprehensive
                platform serving thousands of developers. We believe that great tools should be
                accessible to everyone, regardless of their experience level or budget.
              </Typography>
              <Typography sx={{ color: "hsl(var(--muted-foreground))" }}>
                Today, we continue to expand our offerings while staying true to our core mission:
                to simplify complex technology and inspire developers to build amazing things.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Meet Our Team */}
      <Box component="section" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Meet Our Team
            </Typography>
            <Typography variant="h6" sx={{ color: "hsl(var(--muted-foreground))" }}>
              The talented individuals making it all happen
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid size={{xs:12,sm:6,md:3}}  key={member.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      textAlign: "center",
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                   <Typography
  variant="h6"
  fontWeight={600}
  sx={{ color: "hsl(var(--foreground))", mb: 0.5 }}
>
  {member.name}
</Typography>

                    <Typography sx={{ color: "hsl(var(--primary))", mb: 1 }}>
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "hsl(var(--muted-foreground))", mb: 2 }}
                    >
                      {member.bio}
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      {member.social.github && (
                      <IconButton
  href={member.social.github}
  size="small"
  sx={{
    color: "hsl(var(--foreground))",
    "&:hover": { color: "hsl(var(--primary))" },
  }}
>
  <Github size={18} />
</IconButton>
                      )}
                      {member.social.linkedin && (
                      
                        <IconButton
  href={member.social.linkedin}
  size="small"
  sx={{
    color: "hsl(var(--foreground))",
    "&:hover": { color: "hsl(var(--primary))" },
  }}
>
   <Linkedin size={18} />
</IconButton>
                      )}
                      {member.social.twitter && (
                      

                            <IconButton
  href={member.social.twitter}
  size="small"
  sx={{
    color: "hsl(var(--foreground))",
    "&:hover": { color: "hsl(var(--primary))" },
  }}
>
  <Twitter size={18} />
</IconButton>
                      )}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutUs;
