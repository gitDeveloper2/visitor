import React, { useState, useCallback } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  Paper,
  Box,
  LinearProgress,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  PhotoCamera,
  CheckCircle,
  Error,
  UploadFile,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getShadow } from '../../../utils/themeUtils';
import { Exif } from '../../../types/ExifData';
import piexif from 'piexifjs';
import { mapExifData } from '../../../utils/extractors/exifTransformClient';

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
];

const validateFileType = (file: File) => {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Please upload a JPEG/JPG image file.");
  }
};

interface UploadFormProps {
  setMetadata: (metadata: Exif) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ setMetadata }) => {
  const theme = useTheme();
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    try {
      validateFileType(file);
      setImage(file);
      setError(null);
      setUploadSuccess(false);
      simulateUpload(file);
    } catch (error: any) {
      setError(error.message);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setUploadSuccess(false);

    const totalSize = file.size;
    let uploadedSize = 0;

    const interval = setInterval(() => {
      uploadedSize += totalSize * 0.2;
      const newProgress = Math.min((uploadedSize / totalSize) * 100, 100);
      setProgress(newProgress);

      if (newProgress === 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadSuccess(true);
        readExifData(file);
      }
    }, 300);
  };

  const readExifData = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const base64Data = e.target?.result as string;
        if (base64Data) {
          const exifData = piexif.load(base64Data);

          const isExifDataEmpty = Object.keys(exifData).every(key =>
            key !== 'meta' && typeof exifData[key] === 'object' && Object.keys(exifData[key]).length === 0
          );

          if (isExifDataEmpty) {
            setError("No EXIF data found. Use the 'Edit Photo GPS' button to add GPS information.");
          } else {
            const mappedExifData = mapExifData(exifData);
            mappedExifData.meta = {
              hasExif: true,
              message: 'EXIF data successfully loaded',
            };
            setMetadata(mappedExifData);
          }
        }
      } catch (error: any) {
        setError("No EXIF data found. Use the 'Edit Photo GPS' button to add GPS information.");
        setIsUploading(false);
        setUploadSuccess(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
      setIsUploading(false);
      setUploadSuccess(false);
    };

    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    if (image && !isUploading) {
      simulateUpload(image);
    }
  };

  return (
    <Box>
      {/* Upload Area */}
      <Paper
        elevation={0}
        sx={{
          border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          backgroundColor: isDragOver
            ? `${theme.palette.primary.main}08`
            : theme.palette.background.paper,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: `${theme.palette.primary.main}04`,
          },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/jpg"
          hidden
          onChange={handleImageChange}
        />

        <Stack spacing={2} alignItems="center">
          {uploadSuccess ? (
            <CheckCircle sx={{ fontSize: 48, color: theme.palette.success.main }} />
          ) : error ? (
            <Error sx={{ fontSize: 48, color: theme.palette.error.main }} />
          ) : (
            <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main }} />
          )}

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {uploadSuccess ? 'Upload Complete!' : error ? 'Upload Failed' : 'Upload Photo'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {uploadSuccess
                ? 'Your photo has been processed successfully'
                : error
                ? 'Please try uploading a different image'
                : 'Drag and drop your JPEG image here, or click to browse'
              }
            </Typography>
          </Box>

          {image && (
            <Chip
              icon={<PhotoCamera />}
              label={image.name}
              variant="outlined"
              color="primary"
            />
          )}

          {!image && (
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadFile />}
              sx={{
                background: theme.custom.gradients.primary,
                '&:hover': {
                  background: theme.custom.gradients.primary,
                  boxShadow: getShadow(theme, "neon"),
                }
              }}
            >
              Choose File
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Upload Button */}
      {image && !isUploading && !uploadSuccess && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleUploadClick}
            startIcon={<UploadFile />}
            sx={{
              background: theme.custom.gradients.primary,
              '&:hover': {
                background: theme.custom.gradients.primary,
                boxShadow: getShadow(theme, "neon"),
              }
            }}
          >
            Process Image
          </Button>
        </Box>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
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
            Processing... {Math.round(progress)}%
          </Typography>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {uploadSuccess && !error && (
        <Alert
          severity="success"
          sx={{ mt: 3 }}
          icon={<CheckCircle />}
        >
          Image processed successfully! Check the map and metadata below.
        </Alert>
      )}

      {/* File Type Info */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Supported formats: JPEG, JPG
        </Typography>
      </Box>
    </Box>
  );
};

export default UploadForm;
