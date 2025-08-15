"use client"
import React, { useState } from "react";
import {
  Button,
  Input,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Stack,
  Chip,
  Alert,
  LinearProgress,
  Container,
} from "@mui/material";
import {
  CloudUpload,
  Download,
  Compress,
  Settings,
  Image,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import { getGlassStyles, getShadow } from '../../../utils/themeUtils';
import { StyledSectionGrid } from "../layout/Spacing";
import {
  StyledImagePreview,
  StyledImagePreviewBox,
  StyledImagePreviewContainer,
  VisuallyHiddenInput,
} from "../customhtml/Input";
import { ProductInfo } from "../home/ProductInfo";
import { productInfo } from "../../data/ProductData";
import compressImage from "../../../lib/ImageCompression";
import BlogComponent from "../blog/BlogContentForApps";
import Compressor from "../../data/blogs/Compressor";

const ImageCompressor: React.FC = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [maxSizeMB, setMaxSizeMB] = useState<number>(1);
  const [initialQuality, setInitialQuality] = useState<number>(0.8);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number>(800);
  const [useWebWorker, setUseWebWorker] = useState<boolean>(true);
  const [convertToJPEG, setConvertToJPEG] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  
  const currentProductInfo = productInfo.find(item => item.kind === "compressor");

  const handleFileDownload = () => {
    if (compressedFile) {
      const url = URL.createObjectURL(compressedFile);
      const link = document.createElement("a");
      link.href = url;
      const originalName = compressedFile.name;
      const extension = outputFormat === "jpeg" ? "jpg" : outputFormat;
      const baseName = originalName.substring(0, originalName.lastIndexOf("."));
      link.download = `${baseName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCompressedFile(null);
      setCompressionError(null);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setCompressionProgress(0);
    setCompressionError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setCompressionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const options = {
        maxSizeMB: parseFloat(maxSizeMB.toString()),
        initialQuality: parseFloat(initialQuality.toString()),
        maxWidthOrHeight: parseInt(maxWidthOrHeight.toString(), 10),
        useWebWorker: useWebWorker,
        fileType:
          outputFormat === "jpeg"
            ? "image/jpeg"
            : outputFormat === "png"
            ? "image/png"
            : "image/webp",
      };
      
      const compressed = await compressImage(selectedFile, options);
      setCompressedFile(compressed);
      setCompressionProgress(100);
      setCompressionError(null);
    } catch (error) {
      setCompressionError("Error compressing file. Please try again.");
      console.error("Error compressing file:", error);
    } finally {
      setIsCompressing(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            mb: 2,
            background: theme.custom.gradients.primary,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Image Compressor
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
        >
          Compress your images to reduce file size while maintaining quality. 
          Perfect for email attachments, websites, and social media.
        </Typography>
        
        {/* Feature Chips */}
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
          <Chip 
            icon={<Compress />} 
            label="Smart Compression" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<Settings />} 
            label="Custom Settings" 
            color="primary" 
            variant="filled" 
          />
          <Chip 
            icon={<Download />} 
            label="Instant Download" 
            color="primary" 
            variant="filled" 
          />
        </Stack>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Panel - Upload and Settings */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Upload Section */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CloudUpload sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upload Image
                </Typography>
              </Box>

              <Button
                variant="contained"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{
                  background: theme.custom.gradients.primary,
                  mb: 2,
                  '&:hover': {
                    background: theme.custom.gradients.primary,
                    boxShadow: getShadow(theme, "neon"),
                  }
                }}
              >
                Choose Image
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>

              {selectedFile && (
                <Alert severity="success" icon={<CheckCircle />}>
                  <Typography variant="body2">
                    <strong>{selectedFile.name}</strong> selected
                    <br />
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Alert>
              )}
            </Paper>

            {/* Compression Settings */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Settings sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Compression Settings
                </Typography>
              </Box>

              <Stack spacing={3}>
                <TextField
                  label="Max Size (MB)"
                  type="number"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  inputProps={{ min: 0.1, max: 10, step: 0.1 }}
                  fullWidth
                />

                <TextField
                  label="Quality (0-1)"
                  type="number"
                  value={initialQuality}
                  onChange={(e) => setInitialQuality(Number(e.target.value))}
                  inputProps={{ min: 0.1, max: 1, step: 0.1 }}
                  fullWidth
                />

                <TextField
                  label="Max Width/Height (px)"
                  type="number"
                  value={maxWidthOrHeight}
                  onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                  inputProps={{ min: 100, max: 4000, step: 50 }}
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Output Format</InputLabel>
                  <Select
                    value={outputFormat}
                    label="Output Format"
                    onChange={(e) => setOutputFormat(e.target.value as "jpeg" | "png" | "webp")}
                  >
                    <MenuItem value="jpeg">JPEG</MenuItem>
                    <MenuItem value="png">PNG</MenuItem>
                    <MenuItem value="webp">WebP</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useWebWorker}
                      onChange={(e) => setUseWebWorker(e.target.checked)}
                    />
                  }
                  label="Use Web Worker (faster processing)"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={convertToJPEG}
                      onChange={(e) => setConvertToJPEG(e.target.checked)}
                    />
                  }
                  label="Convert to JPEG"
                />
              </Stack>
            </Paper>

            {/* Compress Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleCompress}
              disabled={!selectedFile || isCompressing}
              startIcon={isCompressing ? <LinearProgress /> : <Compress />}
              sx={{
                background: theme.custom.gradients.primary,
                py: 2,
                '&:hover': {
                  background: theme.custom.gradients.primary,
                  boxShadow: getShadow(theme, "neon"),
                }
              }}
            >
              {isCompressing ? 'Compressing...' : 'Compress Image'}
            </Button>

            {/* Progress Bar */}
            {isCompressing && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={compressionProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: `${theme.palette.primary.main}20`,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: theme.custom.gradients.primary,
                    }
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Compressing... {compressionProgress}%
                </Typography>
              </Box>
            )}

            {/* Error Message */}
            {compressionError && (
              <Alert severity="error" icon={<Error />}>
                {compressionError}
              </Alert>
            )}
          </Stack>
        </Grid>

        {/* Right Panel - Preview and Download */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              ...getGlassStyles(theme),
              boxShadow: getShadow(theme, "elegant"),
              height: 'fit-content',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Image sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Image Preview
              </Typography>
            </Box>

            {selectedFile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Original Image
                </Typography>
                <StyledImagePreviewContainer>
                  <StyledImagePreview
                    src={URL.createObjectURL(selectedFile)}
                    alt="Original"
                  />
                </StyledImagePreviewContainer>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            )}

            {compressedFile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Compressed Image
                </Typography>
                <StyledImagePreviewContainer>
                  <StyledImagePreview
                    src={URL.createObjectURL(compressedFile)}
                    alt="Compressed"
                  />
                </StyledImagePreviewContainer>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Size: {(compressedFile.size / 1024 / 1024).toFixed(2)} MB
                  {selectedFile && (
                    <span style={{ color: theme.palette.success.main }}>
                      {' '}({((1 - compressedFile.size / selectedFile.size) * 100).toFixed(1)}% reduction)
                    </span>
                  )}
                </Typography>
              </Box>
            )}

            {compressedFile && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleFileDownload}
                startIcon={<Download />}
                sx={{
                  background: theme.custom.gradients.primary,
                  '&:hover': {
                    background: theme.custom.gradients.primary,
                    boxShadow: getShadow(theme, "neon"),
                  }
                }}
              >
                Download Compressed Image
              </Button>
            )}

            {!selectedFile && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Image sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No Image Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload an image to see the preview and compression results.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Blog Content */}
      <Box sx={{ mt: 6 }}>
        <BlogComponent blogData={Compressor} />
      </Box>
    </Container>
  );
};

export default ImageCompressor;