"use client";
import CustomDayPicker from "@features/booking/components/LaunchCalenda.";
import { ToolFormData } from "@features/tools/schemas/Tools";
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, UseFormRegister, FieldErrors, Control } from "react-hook-form";

type Props = {
  register: UseFormRegister<ToolFormData>;
  errors: FieldErrors<ToolFormData>;
  touchedFields: Partial<Record<keyof ToolFormData, boolean>>;
  control:  Control<ToolFormData>;
};

export default function StepLinksSubmit({ register, errors, touchedFields, control }: Props) {
  // Somewhere at the top
const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    const res = await fetch("/api/categories"); // adjust as needed
    const data = await res.json();
    if (res.ok) {
      setCategories(data);
    } else {
      console.error("Failed to fetch categories");
    }
  };
  fetchCategories();
}, []);
  const allPlatforms = ["web", "ios", "android", "mac", "windows", "linux"];

  return (
    <>
      <Grid size={{ xs: 12 }}>
  <TextField
    label="Website URL"
    fullWidth
    {...register("websiteUrl")}
    error={!!errors.websiteUrl && touchedFields.websiteUrl}
    helperText={
      touchedFields.websiteUrl
        ? errors.websiteUrl?.message
        : "Enter the full link to the website"
    }
  />
</Grid>


      {/* <Grid size={{ xs: 12 }}>
      <Controller
  name="launchDate"
  control={control}
  render={({ field }) => (
    <CustomDayPicker
      value={field.value}
      onChange={field.onChange}
      productId={'shjsdfi'} // <-- pass it from context or form step
    />
  )}
/>


      </Grid> */}

      <Grid size={{ xs: 12 }}>
      <Controller
  name="category"
  control={control}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.category}>
      <InputLabel id="category-label">Category</InputLabel>
      <Select
        labelId="category-label"
        label="Category"
        value={field.value || ""}
        onChange={field.onChange}
      >
     {categories.map((cat) => (
  <MenuItem key={cat._id} value={cat._id}>
    {cat.name}
  </MenuItem>
))}

      </Select>
      <FormHelperText>{errors.category?.message}</FormHelperText>
    </FormControl>
  )}
/>

      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Tags (comma-separated)"
          fullWidth
          {...register("tags")}
          helperText="Optional. e.g., productivity, ai"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          name="platforms"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.platforms}>
              <InputLabel>Platforms</InputLabel>
              <Select
                multiple
                value={field.value || []}
                onChange={field.onChange}
                input={<OutlinedInput label="Platforms" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                
              >
                {allPlatforms.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.platforms?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
    </>
  );
}
