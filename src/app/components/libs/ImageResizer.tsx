"use client"
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import {
  StyledImagePreview,
  StyledImagePreviewContainer,
  VisuallyHiddenInput,
} from "../customhtml/Input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ProductInfo } from "../home/ProductInfo";
import { productInfo } from "../../data/ProductData";
import  { StyledSectionGrid } from "../layout/Spacing";
import { useTheme , styled} from  '@mui/material/styles';
import BlogComponent from "../blog/BlogContentForApps";
import Resizer from "../../data/blogs/Resizer";

const ImageResizer: React.FC = () => {
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resizedSrc, setResizedSrc] = useState<string | null>(null);
  const currentProductInfo = productInfo.find(item => item.kind === "resizer");
const theme=useTheme()
  useEffect(() => {
    if (resizedSrc) {
      handleDownload();
    }
  }, [resizedSrc]);

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(event.target.value);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResizedSrc(null);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResize = () => {
    const img = new Image();
    img.src = imageSrc as string;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width ? parseInt(width) : img.width;
      canvas.height = height ? parseInt(height) : img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setResizedSrc(canvas.toDataURL("image/png"));
      }
    };
  };

  const handleDownload = () => {
    if (resizedSrc) {
      const link = document.createElement("a");
      link.href = resizedSrc;
      link.download = "resized-image.png";
      link.click();
    }
  };

  return (
    <StyledSectionGrid theme={theme} container y16>
      <Grid item xs={12} textAlign="center" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Image Resizer
        </Typography>
        <Typography variant="body1">Quickly resize images</Typography>
      </Grid>
      <Grid item xs={12} textAlign="center" sx={{ mb: 2 }}>
        <Button
          component="label"
          role="button"
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload
          <VisuallyHiddenInput
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container sx={{ mt: 1 }}>
          <Grid item xs={12} md={10}>
            <Grid container justifyContent="center">
              {imageSrc && (
                <StyledImagePreviewContainer>
                  <StyledImagePreview
                    src={imageSrc}
                    alt="Uploaded Image Preview"
                  />
                </StyledImagePreviewContainer>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Custom Settings
              </Typography>
              <TextField
                label="Width (px)"
                variant="outlined"
                value={width}
                onChange={handleWidthChange}
                size="small"
              />
              <TextField
                label="Height (px)"
                variant="outlined"
                value={height}
                onChange={handleHeightChange}
                sx={{ mt: 1 }}
                size="small"
              />
              {!height || !width ? (
                <Typography variant="body2" color="error">
                  * Please enter both width and height
                </Typography>
              ) : null}
              <Button
                variant="contained"
                onClick={handleResize}
                disabled={!imageSrc || !height || !width}
                sx={{ mt: 2 }}
              >
                Resize & Download
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
      <BlogComponent blogComponent={<Resizer/>}/>
      </Grid>
    </StyledSectionGrid>
  );
};

export default ImageResizer;
