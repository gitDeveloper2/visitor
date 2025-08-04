import { Paper, Typography } from '@mui/material';
import { FlashAuto, FlashOff, Light } from '@mui/icons-material';
import React from 'react';
// import styled from '@emotion/styled';
import { styled } from '@mui/material/styles'

// Styled component for image (if needed)

const StyledImage = styled('img')(({ theme }) => ({
  width: "64px",
}));

// Feature component definition
interface FeatureProps {
  icon: React.ReactNode; // Can be a Material-UI icon or any React node
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <Paper elevation={0} sx={{ textAlign: "center", padding: '20px' }}>
      {/* Render the icon */}
      {icon}
      <Typography sx={{color:'secondary.main'

      }} variant='h5' component='h3' gutterBottom>
        {title}
      </Typography>
      <Typography variant='body2' paragraph>
        {description}
      </Typography>
    </Paper>
  );
};

export default Feature;
