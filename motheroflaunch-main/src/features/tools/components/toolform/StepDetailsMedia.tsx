"use client";

import {
  Grid,
  TextField,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { useRef } from "react";
import { ToolFormData } from "@features/tools/schemas/Tools";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  register: UseFormRegister<ToolFormData>;
  errors: FieldErrors<ToolFormData>;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  screenshotFiles: File[];
  setScreenshotFiles: (files: File[]) => void;
  existingScreenshots: { url: string; public_id?: string }[];
  setExistingScreenshots: (screenshots: { url: string; public_id?: string }[]) => void;
  setRemovedPublicIds: (fn: (prev: string[]) => string[]) => void; // ✅ Add this
};



const MAX_SCREENSHOTS = 2;

export default function StepDetailsMedia({
  register,
  errors,
  logoFile,
  setLogoFile,
  screenshotFiles,
  setScreenshotFiles,
  existingScreenshots,
  setExistingScreenshots,
  setRemovedPublicIds, // ✅ include this!
}: Props)


{
  const { control, watch, setValue } = useFormContext<ToolFormData>();
  const watchedLogo = watch("logo");
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const handleAddScreenshot = (file: File) => {
    if (screenshotFiles.length < MAX_SCREENSHOTS) {
      setScreenshotFiles([...screenshotFiles, file]);
    }
  };
  const handleRemoveScreenshot = (index: number) => {
    const updated = [...screenshotFiles];
    updated.splice(index, 1);
    setScreenshotFiles(updated);
  };

  const handleRemoveExistingScreenshot = (index: number) => {
    console.log("removing image")
    const updated = [...existingScreenshots];
    const [removed] = updated.splice(index, 1);
  
    if (removed?.public_id) {
      setRemovedPublicIds((prev) => [...prev, removed.public_id!]);
    }
  
    setExistingScreenshots(updated);
  };
  
  
  
 const allPreviews = [
    ...existingScreenshots.map((s) => ({
      src: s.url,
      isFile: false,
    })),
    ...screenshotFiles.map((file) => ({
      src: URL.createObjectURL(file),
      isFile: true,
    })),
  ].slice(0, MAX_SCREENSHOTS);
  
  
  
  


  return (
    <>
      <Grid size={{ xs: 12 }}>
     
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Descriptions"
          fullWidth
          multiline
          minRows={4}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Grid>

      {/* Logo Upload */}
      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Upload Logo
        </Typography>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setLogoFile(file);
          }}
        />
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => logoInputRef.current?.click()}
        >
          {logoFile ? "Change Logo" : "Choose Logo"}
        </Button>
      </Grid>

      {(logoFile || watchedLogo?.url) && (
  <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
    <Typography variant="subtitle2" gutterBottom>
      Logo Preview
    </Typography>
    <Box position="relative" display="inline-block">
      <img
        src={
          logoFile
            ? URL.createObjectURL(logoFile)
            : watchedLogo?.url // use watched value
        }
        alt="Logo preview"
        style={{
          maxWidth: "100%",
          maxHeight: 150,
          objectFit: "contain",
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />
      <IconButton
        size="small"
        onClick={() => {
          console.log("removing1")
          if (watchedLogo?.public_id) {
            console.log("removing2")

            setRemovedPublicIds((prev) => [...prev, watchedLogo.public_id!]);
          }
          console.log("removing3")

          setLogoFile(null);
          setValue("logo", undefined);
        }}
        
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          background: "rgba(255,255,255,0.8)",
          "&:hover": {
            background: "rgba(255,255,255,1)",
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  </Grid>
)}



      {/* Screenshot Upload */}
      <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Upload Screenshots (max {MAX_SCREENSHOTS})
        </Typography>
        <input
          ref={screenshotInputRef}
          type="file"
          accept="image/*"
          hidden
          disabled={screenshotFiles.length >= MAX_SCREENSHOTS}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAddScreenshot(file);
            if (screenshotInputRef.current) {
              screenshotInputRef.current.value = "";
            }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => screenshotInputRef.current?.click()}
          disabled={screenshotFiles.length >= MAX_SCREENSHOTS}
        >
          {screenshotFiles.length >= MAX_SCREENSHOTS
            ? "Max Screenshots Reached"
            : "Add Screenshot"}
        </Button>
      </Grid>

      {allPreviews.length > 0 && (
  <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
    <Typography variant="subtitle2" gutterBottom>
      Screenshot Previews
    </Typography>
    <Grid container spacing={2}>
      {allPreviews.map((preview, i) => (
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i} position="relative">
          <Box position="relative">
            <img
              src={preview.src}
              alt={`Screenshot ${i + 1}`}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
           <IconButton
  size="small"
  onClick={() => {
    if (preview.isFile) {
      handleRemoveScreenshot(i - existingScreenshots.length);
    } else {
      handleRemoveExistingScreenshot(i);
    }
  }}
  sx={{
    position: "absolute",
    top: 4,
    right: 4,
    background: "rgba(255,255,255,0.8)",
    "&:hover": {
      background: "rgba(255,255,255,1)",
    },
  }}
>
  <DeleteIcon fontSize="small" />
</IconButton>

          </Box>
        </Grid>
      ))}
    </Grid>
  </Grid>
)}

    </>
  );
}
