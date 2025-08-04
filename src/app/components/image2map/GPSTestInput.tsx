import React, { useState, useEffect, useCallback } from "react";
import { TextField, FormControlLabel, Checkbox, Typography, Box } from "@mui/material";
import { decimalToGpsExif, parseExifGpsData } from "../../../utils/transformers/exifUtils";
import { validateAltitudeValue, validateGpsCoordinates } from "../../../utils/validators/gpsValidation";

interface GpsExifConverterProps {
  value: string; // The current value (either EXIF JSON or coordinates)
  onChange: (newValue: string) => void; // Function to call when the entire EXIF object changes
  onError: (error: boolean) => void;  // Make sure onError is included here
  label?: string; // Optional metadata info (can be used for validation, etc.)
}

const GpsExifConverter: React.FC<GpsExifConverterProps> = ({ value, onChange, onError, label }) => {
  const [coordinates, setCoordinates] = useState<string>(""); // Coordinates (Latitude, Longitude)
  const [altitude, setAltitude] = useState<string>(""); // Altitude
  const [exifData, setExifData] = useState<string>(""); // Raw EXIF data (no longer needed for the textarea)
  const [isBelowSeaLevel, setIsBelowSeaLevel] = useState<boolean>(false); // Toggle for BSL/ASL
  const [errors, setErrors] = useState<string[]>([]); // To store validation errors

  // Synchronize initial values from the `value` prop (parse the value into coordinates and altitude)
  useEffect(() => {
    try {
      const parsedExif = typeof value === "string" ? JSON.parse(value) : value; // Handle both string and object
      const parsedData = parseExifGpsData(parsedExif);

      if (parsedData) {
        if (parsedData.latitude !== undefined && parsedData.longitude !== undefined) {
          setCoordinates(`${parsedData.latitude}, ${parsedData.longitude}`);
        }
        if (parsedData.altitude !== undefined) {
          setAltitude(parsedData.altitude.toString());
        }
        if (parsedData.isBelowSeaLevel !== undefined) {
          setIsBelowSeaLevel(parsedData.isBelowSeaLevel); // Set the BSL flag
        }
      }
    } catch (error) {
      console.error("Invalid EXIF data format.");
    }
  }, [value]);

  // Update EXIF data and trigger parent `onChange` when coordinates or altitude change
  const updateExifData = useCallback(() => {
    const [latitudeStr, longitudeStr] = coordinates.split(",").map((value) => value.trim());
    const alt = altitude ? parseFloat(altitude) * (isBelowSeaLevel ? -1 : 1) : undefined;

    // Validate Latitude, Longitude, and Altitude before updating EXIF data
    const validationErrors: string[] = [
      ...validateGpsCoordinates(latitudeStr, longitudeStr),
      ...validateAltitudeValue(altitude)
    ];

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      onError(true); // Trigger error state only if validation fails
      return; // Stop processing if validation fails
    }

    // If there are no errors, process the EXIF data
    const updatedExif = decimalToGpsExif(parseFloat(latitudeStr), parseFloat(longitudeStr), alt);
    const updatedExifStr = JSON.stringify(updatedExif, null, 2);

    // Update EXIF data only if it has changed
    if (updatedExifStr !== exifData) {
      setExifData(updatedExifStr);
      onChange(updatedExifStr); // Notify parent
      setErrors([]); // Clear any previous errors
      onError(false); // Trigger success state when validation passes
    }
  }, [coordinates, altitude, isBelowSeaLevel, exifData, onChange]);

  // Trigger EXIF data updates when coordinates or altitude change
  useEffect(() => {
    updateExifData();
  }, [coordinates, altitude, isBelowSeaLevel, updateExifData]);

  // Input handlers
  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates(e.target.value);
  };

  const handleAltitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAltitude(e.target.value);
  };

  const handleToggleBSL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsBelowSeaLevel(e.target.checked);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* <Typography variant="h6" gutterBottom>
        {label || "GPS EXIF Converter"}
      </Typography> */}
<p style={{color:"blue"}}>*Paste the GPS values rather than typing</p>
      <TextField
        label="Coordinates (Latitude, Longitude)"
        variant="outlined"
        fullWidth
        value={coordinates}
        onChange={handleCoordinatesChange}
        placeholder="e.g., 37.7749, -122.4194"
        error={!!errors.find((error) => error.includes("Latitude") || error.includes("Longitude"))}
        helperText={errors.find((error) => error.includes("Latitude") || error.includes("Longitude"))}
        sx={{ marginBottom: 2 }}
      />
      

      <TextField
        label="Altitude (Meters)"
        variant="outlined"
        fullWidth
        value={altitude}
        onChange={handleAltitudeChange}
        placeholder="e.g., 30"
        error={!!errors.find((error) => error.includes("Altitude"))}
        helperText={errors.find((error) => error.includes("Altitude"))}
        sx={{ marginBottom: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isBelowSeaLevel}
            onChange={handleToggleBSL}
            color="primary"
          />
        }
        label={isBelowSeaLevel ? "Altitude is below sea level" : "Altitude is above sea level"}
        sx={{ marginBottom: 2 }}
      />
    </Box>
  );
};

export default GpsExifConverter;
