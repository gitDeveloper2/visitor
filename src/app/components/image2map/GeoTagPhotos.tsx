"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography, Box, Alert, Stack, Chip } from "@mui/material";
import UploadImage from "./UploadImage";
import { processImage } from "../../../lib/services/pic2map/imageService";
import  metadataSchema, { reconstructExifData } from "../../../lib/config/semanticKeyMapping";

import { convertCoordinatesToExif } from "../../../utils/extractors/geotag";

interface ImageMetadataEditorProps {
  lat: number;
  lon: number;
  onImageSelected?: (file: File) => void;
}

export const ImageMetadataEditor:React.FC<ImageMetadataEditorProps> = ({lat, lon, onImageSelected}) => {  
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updatedImageUrl, setUpdatedImageUrl] = useState<string | null>(null);
  const [isError, setError] = useState<boolean>(false);
  const [isProcessed, setProcessed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const stableMetadataSchema = React.useMemo(() => metadataSchema, []);

  const saveUpdatedMetadata = async (imageFile: File, updatedMetadata: any) => {
    setIsProcessing(true);
    const exifObj = reconstructExifData(updatedMetadata);

    try {
      const updatedBlob = await processImage(imageFile, exifObj);
      const url = URL.createObjectURL(updatedBlob);
      setUpdatedImageUrl(url);
      setProcessed(true);
    } catch (error) {
      console.error("Error processing image and EXIF data:", error);
      setProcessed(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (updatedImageUrl) {
      const link = document.createElement("a");
      link.href = updatedImageUrl;
      link.download = `geotagged-${imageFile?.name || 'image.jpg'}`;
      link.click();
    }
  };

  const handleError = useCallback((isError: boolean) => {
    setError((prevError) => (prevError !== isError ? isError : prevError));
  }, []);

  const handleMetadataExtracted = useCallback((metadata: any, file: File) => {
    setImageFile((prev) => (prev !== file ? file : prev));
    setProcessed(false);
    setUpdatedImageUrl(null);
    
    // Notify parent component about image selection
    if (onImageSelected) {
      onImageSelected(file);
    }

    const formValues = stableMetadataSchema.reduce((acc, field) => {
      if (field.functions?.getRawValue) {
        acc[field.key] = field.functions.getRawValue(metadata);
      } else {
        acc[field.key] = field.defaultValue || "";
      }
      return acc;
    }, {} as Record<string, any>);

    setFormData(formValues);
  }, [onImageSelected, stableMetadataSchema]);

  const handleInputChange1=(k:string,value:any)=>{
    // Handle select input changes
  }

  useEffect(() => {
    if (lat !== 0 || lon !== 0) {
      const exif = convertCoordinatesToExif(lat+","+lon);
      setFormData((prev) => ({
        ...prev,
        ['gps']: exif,
      }));
    }
  }, [lat, lon]);

  const handleInputChange = useCallback((key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSave = () => {
    if (isError) {
      return;
    }
    if (imageFile) {
      const updatedMetadata = stableMetadataSchema.reduce((acc, field) => {
        const fieldValue = formData[field.key];
        if (field.functions?.fromInput) {
          const res = field.functions.fromInput(fieldValue);
          acc[field.key] = res;
        } else {
          acc[field.key] = fieldValue;
        }
        return acc;
      }, {} as Record<string, any>);

      saveUpdatedMetadata(imageFile, updatedMetadata);
    }
  };

  const renderFields = React.useMemo(() => {
    return stableMetadataSchema.map((field) => {
      
      let rawValue = formData[field.key] || "";
  
      if (field.functions?.toInput) {
        rawValue = field.functions.toInput(rawValue);
      }
  
      return (
        <Box key={field.key} sx={{ marginBottom: 2 }}>
          <Typography variant="body1">{field.label}</Typography>
          {field.type === "custom" && field.customComponent ? (
            <field.customComponent
              value={rawValue}
              onError={handleError}
              onChange={(e) => handleInputChange(field.key,e)}
              label={field.label}
            />
          ) : field.type === "select" ? (
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={rawValue}
                onChange={(e) => handleInputChange1(field.key, e.target.value)}
                label={field.label}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              value={rawValue}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              fullWidth
              label={field.label}
              type={field.type}
            />
          )}
        </Box>
      );
    });
  }, [formData, handleError, handleInputChange]);

  return (
    <Box sx={{ padding: 2 }}>
      <UploadImage onMetadataExtracted={handleMetadataExtracted} />
      
      {imageFile && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
            ✓ Image uploaded successfully
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {imageFile.name}
          </Typography>
        </Box>
      )}

      {imageFile && (lat !== 0 || lon !== 0) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            GPS Coordinates
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              label={`Lat: ${lat.toFixed(6)}`} 
              color="primary" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label={`Lon: ${lon.toFixed(6)}`} 
              color="primary" 
              variant="outlined" 
              size="small"
            />
          </Stack>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            disabled={isProcessing}
            sx={{ mb: 2 }}
          >
            {isProcessing ? "Processing..." : (isProcessed ? "Write Again with New Coordinates" : "Write GPS Metadata")}
          </Button>

          {updatedImageUrl && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={downloadImage}
              sx={{ mb: 2 }}
            >
              Download Geotagged Image
            </Button>
          )}
        </Box>
      )}

      {!imageFile && (
        <Box sx={{ mt: 3, textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Upload an image to start geotagging
          </Typography>
        </Box>
      )}

      {!imageFile && (lat === 0 && lon === 0) && (
        <Box sx={{ mt: 3, textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Select a location on the map first
          </Typography>
        </Box>
      )}
  
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Please clear out all errors
        </Alert>
      )}
  
      {isProcessed && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Image has been successfully processed and is ready for download!
          <br />
          👉 You can <a href="/pic2map" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline" }}>go to Pic2Map</a> to test the inserted coordinates.
        </Alert>
      )}
    </Box>
  );
}

export default ImageMetadataEditor;
