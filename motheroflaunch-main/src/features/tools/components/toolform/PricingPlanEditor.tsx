"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ToolFormData } from "@features/tools/schemas/Tools";

type Props = {
  index: number;
  removePlan: (index: number) => void;
};

export function PricingPlanEditor({ index, removePlan }: Props) {
  const {
    register,
    control,
    getValues,
    setValue,
  } = useFormContext<ToolFormData>();
  const watchedIsFree = useWatch({ name: `pricing.${index}.isFree`, control });
  const watchedHighlight = useWatch({ name: `pricing.${index}.highlight`, control });
  
  const features = useWatch({
    control,
    name: `pricing.${index}.features`,
  }) || [];

  const addFeature = () => {
    const current = getValues(`pricing.${index}.features`) || [];
    setValue(`pricing.${index}.features`, [...current, ""]);
  };

  const removeFeature = (fIndex: number) => {
    const current = getValues(`pricing.${index}.features`) || [];
    const updated = [...current.slice(0, fIndex), ...current.slice(fIndex + 1)];
    setValue(`pricing.${index}.features`, updated);
  };

  return (
    <Box mb={4} p={2} border="1px solid #ccc" borderRadius={2}>
      <TextField
        fullWidth
        label="Plan Name"
        sx={{ mb: 2 }}
        {...register(`pricing.${index}.name`)}
      />
      <TextField
        fullWidth
        label="Price"
        sx={{ mb: 2 }}
        {...register(`pricing.${index}.price`)}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <FormControlLabel
  control={
    <Checkbox
      {...register(`pricing.${index}.isFree`)}
      checked={!!watchedIsFree}
    />
  }
  label="Is Free"
/>
<FormControlLabel
  control={
    <Checkbox
      {...register(`pricing.${index}.highlight`)}
      checked={!!watchedHighlight}
    />
  }
  label="Highlight Plan"
/>

      </Stack>

      <Typography variant="subtitle1">Features</Typography>
      <Stack spacing={1} mb={1}>
        {features.map((_, fIndex) => (
          <Box key={fIndex} display="flex" gap={1}>
            <TextField
              fullWidth
              label={`Feature ${fIndex + 1}`}
              {...register(`pricing.${index}.features.${fIndex}`)}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeFeature(fIndex)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Stack>

      <Button variant="outlined" onClick={addFeature}>
        Add Feature
      </Button>

      <Box mt={2}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => removePlan(index)}
        >
          Remove Plan
        </Button>
      </Box>
    </Box>
  );
}
