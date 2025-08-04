"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Rating,
  IconButton,
  iconButtonClasses,
} from "@mui/material";
import { StyledSectionGrid } from "./Spacing";
import { links } from "../../data/HeaderData";
import { ArrowForward } from "@mui/icons-material";

const ExtrasSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: "background.default", pt: { xs: 6, md: 8 }, pb: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
      <Typography
        variant="sectionTitle"
        component="h2"
        align="center"
        gutterBottom
      >
        Handy Extras for Your Workflow
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}  align="center" paragraph>
        We also provide these free tools to enhance your productivity:
      </Typography>

      <StyledSectionGrid
        theme={theme}
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        alignItems="stretch"
      >
        {links.apps.map((tool) => (
          <Grid item xs={12} sm={6} md={3} key={tool.name}>
            <Box
              sx={{
                height: "100%",
                p: 3,
                backgroundColor: "background.paper",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: (theme) => theme.transitions.create(["box-shadow"]),
                "&:hover": {
                  boxShadow: 4,
                  [`& .${iconButtonClasses.root}`]: {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    boxShadow: 3,
                  },
                },
              }}
            >
              {tool.icon}
              <Typography variant="h6" component="h3" sx={{ mt: 1, mb: 1 }}>
                {tool.name}
              </Typography>
              <Typography variant="body2"  sx={{ mb: 2,color: 'text.secondary' }}>
                {tool.description}
              </Typography>
              <Rating
                name="rating"
                size="small"
                precision={0.5}
                value={tool?.stars}
                readOnly
                getLabelText={() => `${tool.starGazers} ratings`}
              />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                ({tool.stars}) – {tool.starGazers} ratings
              </Typography>
              <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  size="small"
                  href={tool.path}
                  target="_blank"
                  rel="noopener"
                  color="primary"
                  sx={{
                    mt: 2,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </StyledSectionGrid>
    </Box>
  );
};

export default ExtrasSection;
