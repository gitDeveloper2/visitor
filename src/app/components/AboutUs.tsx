"use client";
import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles } from "../../utils/themeUtils";

const AboutUs = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 6, md: 8 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 256,
          height: 256,
          bgcolor: theme.palette.primary.main,
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(48px)",
          transform: "translate(-50%, -50%)",
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            ...getGlassStyles(theme),
            border: `1px solid ${theme.custom.glass.border}`,
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              ...commonStyles.textGradient(theme),
            }}
          >
            Note About Us
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
              mb: 2
            }}
          >
            We are passionate about programming and committed to sharing knowledge
            that helps developers achieve more. From insightful articles to free
            tools, our mission is to simplify and inspire.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Our platform serves thousands of developers worldwide, providing them with 
            the tools and resources they need to build amazing things. We believe that 
            great technology should be accessible to everyone.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutUs;
