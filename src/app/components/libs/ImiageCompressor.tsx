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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTheme , styled} from  '@mui/material/styles';
import { StyledSectionGrid } from "../layout/Spacing";
import { Download } from "@mui/icons-material";
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
        const compressed = await compressImage(file, options);
        setCompressedFile(compressed);
        setCompressionError(null);
      } catch (error) {
        setCompressionError("Error compressing file");
        console.error("Error compressing file:", error);
      }
    }
  };

  return (
    <StyledSectionGrid theme={theme} container spacing={2} y16>
      <Grid item xs={12} textAlign="center" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
        Compress Image to Email Size
        </Typography>
        <Typography variant="body1">Discover how to compress images for email and website use with our comprehensive guide. Learn methods to compress image to email size, optimize images for web performance, and use various formats like WebP. Find tips on achieving quality compression without losing image clarity.</Typography>
      </Grid>
      <Grid item xs={12} textAlign="center" justifyContent="space-between">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            [theme.breakpoints.down("sm")]: {
              flexDirection: "column",
              gap: "8px",
            },
          }}
        >
          <Button
            component="label"
            role="button"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {compressedFile && (
            <Button
              onClick={handleFileDownload}
              variant="contained"
              startIcon={<Download />}
              sx={{ [theme.breakpoints.up("md")]: { ml: 2 } }}
            >
              Download
            </Button>
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={10} justifyContent="center" textAlign="center">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                [theme.breakpoints.up("md")]: {
                  flexDirection: "row",
                },
              }}
            >
              {compressionError && <Typography color="error">{compressionError}</Typography>}
              <StyledImagePreviewBox>
                {selectedFile && (
                  <StyledImagePreviewContainer>
                    <Typography variant="h6">Original Image Preview:</Typography>
                    <Typography variant="body2">
                      Original Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                    <StyledImagePreview
                      src={URL.createObjectURL(selectedFile)}
                      alt="Original Preview"
                    />
                  </StyledImagePreviewContainer>
                )}
                {compressedFile && (
                  <StyledImagePreviewContainer>
                    <Typography variant="h6">Compressed Image Preview:</Typography>
                    <Typography variant="body2">
                      Compressed Size: {(compressedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                    <StyledImagePreview
                      src={URL.createObjectURL(compressedFile)}
                      alt="Compressed Preview"
                    />
                  </StyledImagePreviewContainer>
                )}
              </StyledImagePreviewBox>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                padding: "0 0 0 16px",
                flexDirection: "column",
                alignContent: "flex-end",
              }}
            >
              <Typography variant="h6">Custom Settings</Typography>
              <Divider variant="fullWidth" />
              <FormControl margin="normal">
                <TextField
                  size="small"
                  label="Max Size (MB)"
                  type="number"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                  inputProps={{ step: "0.1", min: "0.1" }}
                  style={{ marginRight: "10px" }}
                />
              </FormControl>
              <FormControl margin="normal">
                <TextField
                  size="small"
                  label="Initial Quality (0-1)"
                  type="number"
                  value={initialQuality}
                  onChange={(e) => setInitialQuality(parseFloat(e.target.value))}
                  inputProps={{ step: "0.1", min: "0", max: "1" }}
                  style={{ marginRight: "10px" }}
                />
              </FormControl>
              <FormControl margin="normal">
                <TextField
                  size="small"
                  label="Max Width/Height"
                  type="number"
                  value={maxWidthOrHeight}
                  onChange={(e) => setMaxWidthOrHeight(parseInt(e.target.value, 10))}
                  inputProps={{ step: "10", min: "100" }}
                  style={{ marginRight: "10px" }}
                />
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={useWebWorker}
                    onChange={(e) => setUseWebWorker(e.target.checked)}
                    color="primary"
                  />
                }
                label="Use Web Worker"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={convertToJPEG}
                    onChange={(e) => setConvertToJPEG(e.target.checked)}
                    color="primary"
                  />
                }
                label="Convert to JPEG"
              />
              <FormControl margin="normal">
                <InputLabel id="output-format-label">Output Format</InputLabel>
                <Select
                  size="small"
                  labelId="output-format-label"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as "jpeg" | "png" | "webp")}
                >
                  <MenuItem value={"jpeg"}>JPEG</MenuItem>
                  <MenuItem value={"png"}>PNG</MenuItem>
                  <MenuItem value={"webp"}>WEBP</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <BlogComponent blogComponent={<Compressor/>}/>
      </Grid>
    </StyledSectionGrid>
  );
};
export default ImageCompressor;