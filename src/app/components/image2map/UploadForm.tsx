import React, { useState } from 'react';
import { Button, Typography, CircularProgress, Paper, Box, LinearProgress } from '@mui/material';
import { Exif } from '../../../types/ExifData'; // Assuming the shared type is here
import piexif from 'piexifjs';
import { mapExifData } from '../../../utils/extractors/exifTransformClient';

const allowedMimeTypes = [
  "image/jpeg", // MIME type for JPEG files
  "image/jpg",  // Optional: Some systems may use this, but technically "image/jpeg" covers it
];

const validateFileType = (file: File) => {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Unsupported file type. Please upload a jpg/jpeg valid image.");
  }
};

interface UploadFormProps {
  setMetadata: (metadata: Exif) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ setMetadata }) => {
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0); // For progress bar
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try {
        validateFileType(file);
        setImage(file);
        simulateUpload(file);
      } catch (error: any) {
        setError(error.message); // Handle unsupported file type
      }
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null); // Clear any previous errors

    // Simulate a file upload process
    const totalSize = file.size;
    let uploadedSize = 0;

    const interval = setInterval(() => {
      uploadedSize += totalSize * 0.2; // Simulate 10% upload per step
      const newProgress = Math.min((uploadedSize / totalSize) * 100, 100);
      setProgress(newProgress);

      if (newProgress === 100) {
        clearInterval(interval);
        setIsUploading(false);
        readExifData(file);
      }
    }, 300); // Update progress every 500ms
  };

  const readExifData = (file: File) => {
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const base64Data = e.target?.result as string;
        if (base64Data) {
          const exifData = piexif.load(base64Data);
  
          // Check if the EXIF data contains useful information (non-empty objects)
          const isExifDataEmpty = Object.keys(exifData).every(key =>
            // Skip the "meta" field and check the other fields
            key !== 'meta' && typeof exifData[key] === 'object' && Object.keys(exifData[key]).length === 0
          );
  
          if (isExifDataEmpty) {
            setError("The image might not contain Exif. Use our 'Edit-Photo-GPS button' above to add GPS(Exif) information");
          } else {
            const mappedExifData = mapExifData(exifData);
            mappedExifData.meta = {
              hasExif: true,
              message: 'EXIF data successfully loaded',
            };
            setMetadata(mappedExifData); // Update metadata with EXIF data
          }
        }
      } catch (error: any) {
        setError("The image might not contain Exif. Use our 'Edit-Photo-GPS button' above to add GPS(Exif) information");
        setIsUploading(false);
      }
    };
  
    reader.onerror = () => {
      setError("The image might not contain Exif. Use our 'Edit-Photo-GPS button' above to add GPS(Exif) information");
      setIsUploading(false);
    };
  
    reader.readAsDataURL(file);
  };
  

  return (
    <Paper
      sx={{
        padding: 3,
        borderRadius: 2,
        maxWidth: 400,
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Upload Image to show GPS location
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        {/* Enhanced File Input */}
        <Button variant={image?"outlined":"contained"} component="label" fullWidth>
          Choose File
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        {image && (
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {image.name}
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        onClick={() => simulateUpload(image!)} // Use the simulate upload on button click
        disabled={isUploading || !image}
        sx={{ marginBottom: 2 }}
      >
        {isUploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>

      {/* Progress Bar */}
      {isUploading && (
        <Box sx={{ mt: 2, width: '100%' }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Uploading... {Math.round(progress)}%
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          Error: {error}
        </Typography>
      )}
    </Paper>
  );
};

export default UploadForm;
