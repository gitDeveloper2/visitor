import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { Grouping } from "../compare.types";

interface GroupingSelectorProps {
  value: Grouping;
  onChange: (value: Grouping) => void;
}

export function GroupingSelector({ value, onChange }: GroupingSelectorProps) {
  const handleChange = (_: unknown, newValue: Grouping | null) => {
    if (newValue) onChange(newValue);
  };

  return (
    <Box sx={{ width: "100%", }}>
      {/* Ensure the container takes the full width */}
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
        color="primary"
        sx={{
          display: "flex",
          width: "100%",
          overflow: "hidden", // Hide overflowing content
        }}
      >
        <ToggleButton
          value="daily"
          sx={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0, // Prevent shrinking the button
            fontSize: {
              xs: "0.5rem",  // For extra small screens
              sm: "0.6rem",  // For small screens
              md: "0.8rem",  // For medium screens
            },
            minWidth: 0, // Remove minimum width to allow button to shrink
            height: "40px", // Set a consistent height for the button
            lineHeight: "36px", // Center the text vertically
          }}
        >
          Daily
        </ToggleButton>
        <ToggleButton
          value="weekly"
          sx={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0, // Prevent shrinking the button
            fontSize: {
              xs: "0.5rem",  // For extra small screens
              sm: "0.6rem",  // For small screens
              md: "0.8rem",  // For medium screens
            },
            minWidth: 0, // Remove minimum width to allow button to shrink
            height: "40px", // Set a consistent height for the button
            lineHeight: "36px", // Center the text vertically
          }}
        >
          Weekly
        </ToggleButton>
        <ToggleButton
          value="monthly"
          sx={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0, // Prevent shrinking the button
            fontSize: {
              xs: "0.5rem",  // For extra small screens
              sm: "0.6rem",  // For small screens
              md: "0.8rem",  // For medium screens
            },
            minWidth: 0, // Remove minimum width to allow button to shrink
            height: "40px", // Set a consistent height for the button
            lineHeight: "36px", // Center the text vertically
          }}
        >
          Monthly
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
