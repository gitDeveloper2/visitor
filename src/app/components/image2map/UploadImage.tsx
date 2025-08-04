import React, { useState, useEffect, useRef } from "react";
import * as piexif from "piexifjs";
import { Box, Button, Typography, LinearProgress, Paper } from "@mui/material";

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
  const intervalRef = useRef<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] || null;

    if (file) {
      try {
        validateFileType(file);
        setImage(file);
        simulateUpload(file); // Automatically start upload after selection
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setProgress(0);

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
        }
      }
    };

    reader.onerror = () => {
      setError("Error reading file. Please try again.");
    };

    reader.readAsDataURL(file);
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
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 3 }}>
        Upload an Image
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Button variant="outlined" component="label" fullWidth>
          Choose File
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {image && (
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Selected File: {image.name}
          </Typography>
        )}
      </Box>

      {isUploading && (
        <Box sx={{ mt: 3, width: "100%" }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Uploading... {Math.round(progress)}%
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ marginTop: 3 }}>
          Error: {error}
        </Typography>
      )}
    </Paper>
  );
};

export default UploadImage;
