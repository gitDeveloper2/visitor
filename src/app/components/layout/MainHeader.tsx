import Kimage from "@components/ClientSideImage";
import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";

import React from "react";

const MainHeader = () => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        position: "relative",
        pt: 4,
        pb: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={0}>
          <Grid item xs={12} md={7} >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: {
                  xs: "center",
                  md: "left",
                },
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h2"
                  component={'h2'}
                  sx={{
                    fontSize: { xs: 40, md: 72 },
                    position: "relative",
                    letterSpacing: 1.5,
                    fontWeight: "bold",
                    lineHeight: 1.3,
                  }}
                >
                  <Typography
                    component={"mark"}
                    sx={{
                      fontSize: "inherit",
                      backgroundColor: "unset",
                      fontWeight: "inherit",
                      color: "primary.main",
                    }}
                  >
                    Discover{" "}
                    <Box
                      sx={{
                        position: "absolute",
                        top: { xs: 54, md: 94 },
                        left: 2,
                        transform: "rotate(3deg)",
                        "& img": {
                          width: { xs: 146, md: 210 },
                          height: "auto",
                        },
                      }}
                    >
                      {/* eslint-disable-next-line */}
                      <Kimage
                      
                        src={"/images/headline-curve.svg"}
                        alt={"Headline curve"}
                      />
                    </Box>
                  </Typography>
                  Coding Ideas and Insights
                </Typography>
              </Box>
              <Box sx={{ mb: 4, width: { xs: "100%", md: "70%" } }}>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  Stay inspired with articles exploring unique programming
                  concepts and actionable knowledge. From understanding Zod
                  enums to tracking npm package trends with NpmStars, and using free tools like Pic2Map and Geotag Photos Online — BasicUtils helps you learn, analyze, and create smarter.
                </Typography>
              </Box>
              <Box>
                <Button   href="/npmstars" startIcon={<ArrowForward />}  variant="contained">Try out NpmStars Tool</Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} >
            <Box sx={{ textAlign: "center" }}>
              <Kimage
                src="/images/home-hero.jpg"
                alt="Hero"
                width={775}
                height={760}
                sx={{ maxWidth: "100%", height: "auto" }} // Optional: responsive scaling without distortion
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MainHeader;
