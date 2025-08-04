"use client";
import "react-image-crop/dist/ReactCrop.css";
import { Grid, Typography, Paper,Box, List, ListItem, ListItemText, Button } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { StyledSectionGrid } from "@components/layout/Spacing";


const parentPath = "";
const thisPagePath = "";

export default function EasyIp() {
  const theme = useTheme();

  return (
    <StyledSectionGrid theme={theme} container  y32>
      
           <>
            <Box sx={{ my: 4 }}>
        <Typography variant="h2" gutterBottom>
          Easy IP Display for Firefox
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Easy IP Display, a convenient add-on designed specifically for Firefox users. Our extension simplifies the process of finding your IP address with just a few clicks.
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" gutterBottom>
            Features
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="body1" paragraph>
              <strong>Instant IP Lookup:</strong> Quickly find your public and local IP addresses.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Easy to Use:</strong> Simple interface that integrates seamlessly with Firefox.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Privacy Focused:</strong> Your IP information is only visible to you.
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            How to Install
          </Typography>
          <Typography variant="body1" paragraph>
            Installing the Easy IP Display add-on is quick and easy. Follow these simple steps:
          </Typography>
          <ol>
            <li>Open Firefox and go to the Add-ons section.</li>
            <li>Search for "Easy IP Display."</li>
            <li>Click "Add to Firefox" and follow the prompts to complete the installation.</li>
            <li>Once installed, click the add-on icon in your toolbar to start using it.</li>
          </ol>
        </Box>

        <Box sx={{ my: 4 }}>
         
          <Typography variant="body1" paragraph>
Thank you for choosing our product!          </Typography>
          
        </Box>
      </Box>
           </>
         
    </StyledSectionGrid>
  );
}
