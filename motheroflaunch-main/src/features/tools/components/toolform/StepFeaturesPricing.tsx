"use client";

import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
  useFormContext,
} from "react-hook-form";

import { ToolFormData } from "@features/tools/schemas/Tools";
import { PricingPlanEditor } from "./PricingPlanEditor"; // 👈 we'll define this below



export default function StepFeaturesPricing() {
  const {
    register,
    control,
    getValues,
    setValue,
  } = useFormContext<ToolFormData>();


  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({
    control,
    name: "pricing",
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <Grid container spacing={3}>
      {/* Pricing Plans */}
      <Grid size={{xs:12}} >
        <Typography variant="h6">Pricing Plans</Typography>
        {pricingFields.map((field, index) => (
     <PricingPlanEditor index={index} key={index} removePlan={removePricing} />

        ))}

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() =>
            appendPricing({
              name: "",
              price: "",
              features: [""],
              isFree: false,
              highlight: false,
            })
          }
        >
          Add Plan
        </Button>
      </Grid>

      {/* General Features */}
      <Grid  size={{xs:12}}>
        <Typography variant="h6">General Features</Typography>
        {featureFields.map((field, index) => (
          <Box
            key={field.id}
            mb={2}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
          >
            <TextField
              fullWidth
              label="Feature Title"
              sx={{ mb: 1 }}
              {...register(`features.${index}.title`)}
            />
            <TextField
              fullWidth
              multiline
              label="Description"
              {...register(`features.${index}.description`)}
            />
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => removeFeature(index)}
            >
              Remove Feature
            </Button>
          </Box>
        ))}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => appendFeature({ title: "", description: "" })}
        >
          Add Feature
        </Button>
      </Grid>
    </Grid>
  );
}
