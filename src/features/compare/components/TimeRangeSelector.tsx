import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { TIME_RANGE_OPTIONS } from "../constants";
import { TimeRange } from "../compare.types";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <FormControl
      size="small"
      fullWidth
      sx={{
        minWidth: { xs: "100%", sm: 180 },
      }}
    >
      <InputLabel id="time-range-label">Time Range</InputLabel>
      <Select
        labelId="time-range-label"
        value={value}
        label="Time Range"
        onChange={(e) => onChange(e.target.value as TimeRange)}
      >
        {TIME_RANGE_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
