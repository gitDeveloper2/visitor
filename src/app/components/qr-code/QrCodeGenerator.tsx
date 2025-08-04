"use client"
// components/QRCodeGeneratorWithStyle.tsx
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { TextField, Button, Container, Typography, Slider, Box } from '@mui/material';
import { useTheme } from  '@mui/material/styles';
import { StyledSectionGrid } from '@components/layout/Spacing';

const QRCodeGeneratorWithStyle: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');
  const [size, setSize] = useState<number>(128);
const theme=useTheme()

  return (
  
        <StyledSectionGrid theme={theme} y16 id='contactus'>
       <Typography textAlign={'center'} variant="h5" component={'h1'} gutterBottom>QR GEnerator</Typography>
        <Typography textAlign={'center'} variant="body1">Quickly crop images</Typography>
      
      <TextField
        label="Enter text or URL"
        variant="outlined"
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Color"
        type="color"
        variant="outlined"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Box sx={{ marginTop: 2, marginBottom: 2 }}>
        <Typography gutterBottom>Size</Typography>
        <Slider
          value={size}
          min={50}
          max={500}
          step={10}
          onChange={(e, newValue) => setSize(newValue as number)}
          valueLabelDisplay="auto"
          aria-labelledby="size-slider"
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // You can add any additional logic here if needed
        }}
      >
        Generate QR Code
      </Button>
      {inputValue && (
        <Box sx={{ marginTop: 3 }}>
          <QRCode value={inputValue} size={size} fgColor={color} />
        </Box>
      )}
      </StyledSectionGrid>
  );
};

export default QRCodeGeneratorWithStyle;
