"use client";
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { FeaturesData } from '../../data/FeaturesData';
import Feature from './Feature';
import { useTheme } from '@mui/material/styles';
import Image from "next/image";

export default function Features() {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={0}>
        <Grid item xs={false} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            
          <Box sx={{ textAlign: "center" }}>
              <Image
                src="/images/categories.svg"
                alt="Hero"
                width={775}
                height={760}
                style={{ maxWidth: "100%", height: "auto" }} // Optional: responsive scaling without distortion
              />
            </Box>

          </Grid>
          <Grid item xs={12} md={7}>

          <Grid container spacing={4}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography component="h2" variant="sectionTitle">
              Featured Categories
            </Typography>
          </Grid>

          {FeaturesData.map((item) => (
            <Grid item key={item.Title} xs={12}  md={6}>
              <Feature
                title={item.Title}
                description={item.Description}
                icon={item.icon}
              />
            </Grid>
          ))}
        </Grid>
          </Grid>
        
        </Grid>
      </Container>
    </Box>
  );
}
