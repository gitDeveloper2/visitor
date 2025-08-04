"use client"
import React, { useState, useRef, ChangeEvent } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Box, Button, Typography, Grid } from "@mui/material";
import { canvasPreview } from './CropImage';
import { StyledImagePreviewBox, StyledImagePreviewContainer, VisuallyHiddenInput } from '../customhtml/Input';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Download, Rotate90DegreesCw } from '@mui/icons-material';
import { StyledSectionGrid } from '../layout/Spacing';
import { ProductInfo } from "../home/ProductInfo";
import { productInfo } from "../../data/ProductData";
import { useTheme , styled} from  '@mui/material/styles';
import BlogComponent from '../blog/BlogContentForApps';
import Cropper from '../../data/blogs/Cropper';

interface ImageCropProps {
  url?: string;
}

export default function ImageCropper({ url = "https://plus.unsplash.com/premium_photo-1689974465650-b223928cdc9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" }: ImageCropProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [completedCrop, setCompletedCrop] = useState<Crop | undefined>();
  const [imageUrl, setImageUrl] = useState<string>(url);
  const [file, setFile] = useState<File | null>(null);
  const currentProductInfo = productInfo.find(item => item.kind === "cropper");
const theme=useTheme()
  const onZoom = (e: string) => {
    setScale(parseFloat(e));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const rotateRight = () => {
    let newRotation = rotation + 90;
    if (newRotation >= 360) {
      newRotation = 0;
    }
    setRotation(newRotation);
  };

  const download = async () => {
    if (imgRef.current && completedCrop) {
      await canvasPreview(imgRef.current, completedCrop, scale, rotation);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setHeight(height);
    setWidth(width);
    setCompletedCrop({
      x: 0,
      y: 0,
      height: height,
      width: width,
      unit: 'px'
    });
  };

  return (
    <StyledSectionGrid theme={theme} container gap={1} y16>
      <Grid item xs={12} textAlign={'center'} sx={{ mb: 2 }}>
        <Typography textAlign={'center'} variant="h5" component={'h1'} gutterBottom>Image Crop</Typography>
        <Typography textAlign={'center'} variant="body1">Quickly crop images</Typography>
      </Grid>
      <Grid item xs={12} textAlign={'center'}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload Image
          <VisuallyHiddenInput
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </Button>
      </Grid>
      <Grid item xs={12} textAlign={'center'}>
        <Box display={'flex'} justifyContent={'space-around'} sx={{ mb: 2 }}>
          {file && <Button variant='contained' startIcon={<Rotate90DegreesCw />} onClick={rotateRight}>Rotate</Button>}
          {file && <Button variant='contained' startIcon={<Download />} onClick={download}>Download</Button>}
        </Box>
        {file && (
          <div className={'controls'}>
            <input
              type='range'
              min={0.1}
              max={3}
              step={0.05}
              value={scale}
              onInput={(e) => onZoom((e.target as HTMLInputElement).value)}
              className={'slider'}
            />
            <span className={'rangeText'}>Zoom In/Out</span>
          </div>
        )}
      </Grid>
      <Grid item xs={12} textAlign={'center'}>
        <StyledImagePreviewBox>
          <StyledImagePreviewContainer>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              {file && (
                <img
                  ref={imgRef}
                  alt='Image Not Selected'
                  src={imageUrl}
                  style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
                  onLoad={onImageLoad}
                />
              )}
            </ReactCrop>
          </StyledImagePreviewContainer>
        </StyledImagePreviewBox>
      </Grid>
      <Grid item xs={12}>
      <BlogComponent blogComponent={<Cropper/>}/>
      </Grid>
    </StyledSectionGrid>
  );
}
