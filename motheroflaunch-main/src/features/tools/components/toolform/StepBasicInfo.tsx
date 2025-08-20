// StepBasicInfo.tsx
"use client";
import { ToolFormData } from "@features/tools/schemas/Tools";
import { Grid, TextField } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type Props = {
  register: UseFormRegister<ToolFormData>;
  errors: FieldErrors<ToolFormData>;
};

export default function StepBasicInfo({ register, errors }: Props) {
  return (
    <>
       <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Name"
                      fullWidth
                      {...register("name")}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Slug"
                      fullWidth
                      {...register("slug")}
                      error={!!errors.slug}
                      helperText={errors.slug?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Tagline"
                      fullWidth
                      {...register("tagline")}
                      error={!!errors.tagline}
                      helperText={errors.tagline?.message}
                    />
                  </Grid>
    </>
  );
}
