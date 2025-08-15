import React, { useState, useEffect, useRef } from "react";
import * as piexif from "piexifjs";
import { Box, Button, Typography, LinearProgress, Paper, Stack, Alert } from "@mui/material";
import { CloudUpload, CheckCircle, Error } from "@mui/icons-material";

const allowedMimeTypes = ["image/jpeg", "image/jpg"];

const validateFileType = (file: File) => {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Unsupported file type. Please upload a valid JPG image.");
  }
};

const UploadImage = ({
  onMetadataExtracted,
}: {
  onMetadataExtracted: (metadata: any, file: File) => void;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const intervalRef = useRef<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadStatus('idle');
    const file = e.target.files?.[0] || null;

    if (file) {
      try {
        validateFileType(file);
        setImage(file);
        simulateUpload(file); // Automatically start upload after selection
      } catch (err: any) {
        setError(err.message);
        setUploadStatus('error');
      }
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setUploadStatus('uploading');

    const totalSize = file.size;
    let uploadedSize = 0;

    intervalRef.current = window.setInterval(() => {
      uploadedSize += totalSize * 0.2;
      const newProgress = Math.min((uploadedSize / totalSize) * 100, 100);
      setProgress(newProgress);

      if (newProgress === 100) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsUploading(false);
        setUploadStatus('success');
        readExifData(file);
      }
    }, 300);
  };

  const readExifData = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Data = e.target?.result as string;

      if (base64Data) {
        try {
          const exifData = piexif.load(base64Data);
          onMetadataExtracted(exifData, file);
        } catch (err: any) {
          setError("Failed to extract EXIF metadata. Please try again.");
          setUploadStatus('error');
        }
      }
    };

    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      setUploadStatus('error');
    };

    reader.readAsDataURL(file);
  };

  const resetUpload = () => {
    setImage(null);
    setProgress(0);
    setError(null);
    setUploadStatus('idle');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Paper
      sx={{
        padding: 3,
        borderRadius: 2,
        maxWidth: 400,
        margin: "auto",
        textAlign: "center",
        border: '2px dashed',
        borderColor: uploadStatus === 'success' ? 'success.main' : 
                    uploadStatus === 'error' ? 'error.main' : 
                    uploadStatus === 'uploading' ? 'primary.main' : 'grey.300',
        backgroundColor: uploadStatus === 'success' ? 'success.50' : 
                       uploadStatus === 'error' ? 'error.50' : 
                       uploadStatus === 'uploading' ? 'primary.50' : 'transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <Stack spacing={2} alignItems="center">
        {/* Upload Icon */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: uploadStatus === 'success' ? 'success.100' : 
                         uploadStatus === 'error' ? 'error.100' : 
                         uploadStatus === 'uploading' ? 'primary.100' : 'grey.100',
          color: uploadStatus === 'success' ? 'success.main' : 
                 uploadStatus === 'error' ? 'error.main' : 
                 uploadStatus === 'uploading' ? 'primary.main' : 'grey.500',
          transition: 'all 0.3s ease',
        }}>
          {uploadStatus === 'success' ? (
            <CheckCircle sx={{ fontSize: 32 }} />
          ) : uploadStatus === 'error' ? (
            <Error sx={{ fontSize: 32 }} />
          ) : uploadStatus === 'uploading' ? (
            <CloudUpload sx={{ fontSize: 32 }} />
          ) : (
            <CloudUpload sx={{ fontSize: 32 }} />
          )}
        </Box>

        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          {uploadStatus === 'success' ? 'Upload Complete!' :
           uploadStatus === 'error' ? 'Upload Failed' :
           uploadStatus === 'uploading' ? 'Uploading...' : 'Upload an Image'}
        </Typography>

        {uploadStatus === 'idle' && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a JPEG image to add GPS coordinates
          </Typography>
        )}

        {/* File Selection */}
        {uploadStatus === 'idle' && (
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            startIcon={<CloudUpload />}
            sx={{ 
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.50',
              }
            }}
          >
            Choose File
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        )}

        {/* File Info */}
        {image && (
          <Box sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            width: '100%',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Selected File:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              {image.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Size: {(image.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <Box sx={{ mt: 2, width: "100%" }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Processing... {Math.round(progress)}%
            </Typography>
          </Box>
        )}

        {/* Success State */}
        {uploadStatus === 'success' && (
          <Alert severity="success" sx={{ width: '100%' }}>
            Image uploaded successfully! EXIF data extracted.
          </Alert>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}

        {/* Reset Button */}
        {uploadStatus !== 'idle' && (
          <Button 
            variant="outlined" 
            onClick={resetUpload}
            sx={{ mt: 2 }}
          >
            Upload Another Image
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default UploadImage;
