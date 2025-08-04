import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

interface FractionalInputProps {
  value: [number, number]; // The value prop is now a tuple
  onChange: (val: [number, number]) => void; // onChange expects a tuple
}

const FractionalInput: React.FC<FractionalInputProps> = ({ value, onChange }) => {
  const [numerator, setNumerator] = useState<number>(value[0]);
  const [denominator, setDenominator] = useState<number>(value[1]);

  // Effect to update local state when `value` prop changes
  useEffect(() => {
    setNumerator(value[0]);
    setDenominator(value[1]);
  }, [value]);

  const handleNumeratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumerator = parseInt(e.target.value, 10);
    setNumerator(isNaN(newNumerator) ? 0 : newNumerator);

    // Update parent component with the updated tuple
    onChange([isNaN(newNumerator) ? 0 : newNumerator, denominator]);
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDenominator = parseInt(e.target.value, 10);
    setDenominator(isNaN(newDenominator) ? 1 : Math.max(1, newDenominator));

    // Update parent component with the updated tuple
    onChange([numerator, newDenominator]);
  };

  return (
    <div>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <TextField
            type="number"
            value={numerator}
            onChange={handleNumeratorChange}
            label="Numerator"
            variant="outlined"
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: "80px" }}
          />
        </Grid>
        <Grid item>
          <span>/</span>
        </Grid>
        <Grid item>
          <TextField
            type="number"
            value={denominator}
            onChange={handleDenominatorChange}
            label="Denominator"
            variant="outlined"
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: "80px" }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default FractionalInput;
