import React from "react";
import { Box, Container, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AboutUs = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        pb: { xs: 6, md: 8 }
      }}
    >
      <Container>
        <Divider variant="middle" />
        <Box
          sx={{
            py: { xs: 6, md: 8 },
          }}
        >
          <Typography
            sx={{
              pb: 3,
            }}
            variant="h3"
            component="h2"
            paragraph
          >
            Note About Us
          </Typography>
          <Box>
            <Typography
              sx={{
                margin: 'auto',
                width: "70%",
                textAlign: 'center'
              }}
            >
              We are passionate about programming and committed to sharing knowledge
              that helps developers achieve more. From insightful articles to free
              tools, our mission is to simplify and inspire.
            </Typography>
          </Box>
        </Box>
        <Divider variant="middle" />
      </Container>
    </Box>
  );
};

export default AboutUs; 