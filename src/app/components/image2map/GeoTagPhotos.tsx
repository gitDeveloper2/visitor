"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography, Box, Alert } from "@mui/material";
import UploadImage from "./UploadImage";
import { processImage } from "../../../lib/services/pic2map/imageService";
import  metadataSchema, { reconstructExifData } from "../../../lib/config/semanticKeyMapping";

import { convertCoordinatesToExif } from "../../../utils/extractors/geotag";
interface ImageMetadataEditorProps {
  lat: number;
  lon: number;
}
export const ImageMetadataEditor:React.FC<ImageMetadataEditorProps> = ({lat,lon}) => {  
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updatedImageUrl, setUpdatedImageUrl] = useState<string | null>(null);
  const [isError, setError] = useState<boolean>(false);
  const [isProcessed, setProcessed] = useState<boolean>(false); // State to track processing completion

  const stableMetadataSchema = React.useMemo(() => metadataSchema, []);


  
  
  const saveUpdatedMetadata = async (imageFile: File, updatedMetadata: any) => {
    const exifObj = reconstructExifData(updatedMetadata);
   

    try {
      const updatedBlob = await processImage(imageFile, exifObj);
      const url = URL.createObjectURL(updatedBlob);
      setUpdatedImageUrl(url);
      setProcessed(true); // Set processed state to true
    } catch (error) {
      console.error("Error processing image and EXIF data:", error);
      setProcessed(false); // Reset in case of failure
    }
  };

  const downloadImage = () => {
    if (updatedImageUrl) {
      const link = document.createElement("a");
      link.href = updatedImageUrl;
      link.download = "updated-image.jpg";
      link.click();
    }
  };

  const handleError = useCallback((isError: boolean) => {
    setError((prevError) => (prevError !== isError ? isError : prevError));
  }, []);
  

  const handleMetadataExtracted = useCallback((metadata: any, file: File) => {
    setImageFile((prev) => (prev !== file ? file : prev));
    setProcessed(false); // Reset processed state when a new image is uploaded
  
    const formValues = stableMetadataSchema.reduce((acc, field) => {
      if (field.functions?.getRawValue) {
        acc[field.key] = field.functions.getRawValue(metadata);
      } else {
        acc[field.key] = field.defaultValue || "";
      }
      return acc;
    }, {} as Record<string, any>);
  
    // Update state in a single step
    setFormData(formValues);
  }, []);
  
  
const handleInputChange1=(k:string,value:any)=>{

}

useEffect(() => {
  const exif=convertCoordinatesToExif(lat+","+lon);
  setFormData((prev) => ({
    ...prev,
    ['gps']: exif,
  }));
  
}, [lat, lon]);
  const handleInputChange = useCallback((key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []); // No need to include formData in dependencies
  

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
  }, [formData]);
  
  

  return (
    <Box sx={{ padding: 3 }}>
      <UploadImage onMetadataExtracted={handleMetadataExtracted} />
  <Typography style={{
    color:"blue",
    textAlign:"center",
    margin:"8px 0"
  }} paragraph>Select a location of the map first!</Typography>
    <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" }, // column on mobile, row on larger screens
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  }}
>
<Button
  variant="contained"
  color="primary"
  fullWidth
  sx={{ maxWidth: { xs: "100%", sm: "200px" } }}
  onClick={handleSave}
>
  {isProcessed ? "Write Again with New Coordinates" : "Write Metadata"}
</Button>



  {updatedImageUrl && (
    <Button
      variant="contained"
      color="secondary"
      fullWidth
      sx={{ maxWidth: { xs: "100%", sm: "200px" } }}
      onClick={downloadImage}
    >
      Download Updated Image
    </Button>
  )}
</Box>

  
      {isError && (
        <Typography color="error" sx={{ marginTop: 2, textAlign: "center" }}>
          Please clear out all errors
        </Typography>
      )}
  
  {isProcessed && (
  <Alert severity="success" sx={{ marginTop: 2, textAlign: "center" }}>
    Image has been successfully processed and is ready for download!
    <br />
    👉 You can <a href="/pic2map" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline" }}>go to Pic2Map</a> to test the inserted coordinates.
  </Alert>
)}

    </Box>
  );
}

export default ImageMetadataEditor;
