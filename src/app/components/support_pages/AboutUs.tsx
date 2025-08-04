"use client";
import React from "react";
import { Box } from "@mui/system";
import { Container, Divider, Typography } from "@mui/material";
import { Theme, useTheme, styled } from "@mui/material/styles";

const StyledAboutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "0 16px 64px",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "32px",
  textAlign: "center",
  flexWrap: "wrap",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "left",
    padding: "0 32px 64px",
  },
  [theme.breakpoints.up("md")]: {
    padding: "0px 120px 64px",
  },
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const StyledDescriptionBox = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.up("sm")]: {
    flex: 2,
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  width: "100%",
}));

export default function AboutUs() {
  const theme = useTheme();

  return (
    <Box
    sx={{
      textAlign:'center',
      pb: {xs:6,md:8}
    }}
    >
      <Container>
      <StyledDivider variant="middle" />
      <Box
      sx={
        {  py: {xs:6,md:8},
         }
      }
      >
      
        <Typography sx={{
          pb:3,
         
        }} variant="sectionTitle" component="h2" paragraph>
          Note About Us
        </Typography>
<Box

>
        <Typography
        sx={{
          margin:'auto',
           width:"70%",
           textAlign:'center'
        }}
         
          
        >
          We are passionate about programming and committed to sharing knowledge
          that helps developers achieve more. From insightful articles to free
          tools, our mission is to simplify and inspire.
        </Typography>
        </Box>
        </Box>
      <StyledDivider variant="middle" />
      </Container>
      </Box>
  );
}
