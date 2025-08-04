import { useState } from "react";
import { usePackageSuggestions } from "../hooks/usePackageSuggestions";
import { Autocomplete, Chip, TextField } from "@mui/material";

interface PackageSelectorProps {
  selectedPackages: string[];
  onChange: (newPackages: string[]) => void;
}

export function PackageSelector({ selectedPackages, onChange }: PackageSelectorProps) {
  const [inputValue, setInputValue] = useState<string>("");  // Ensure the type of inputValue is string
  const suggestions = usePackageSuggestions(inputValue);

  return (
    <Autocomplete
   
    
    size="small"
      multiple
      freeSolo
      options={suggestions}
      value={selectedPackages}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);  // No trimming here, keep input value as-is
      }}
      onChange={(_, newValue) => {
        onChange(newValue as string[]);  // Ensure that the newValue is typed as a string array
      }}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              size="small"
              variant="outlined"
              color="secondary"
              label={option}
              {...tagProps}
            />
          );
        })
      }
      
      renderInput={(params) => (
        <TextField
          {...params}
          label="Compare NPM Packages"
          placeholder="e.g., react, lodash, @tanstack/react-query"
        />
      )}
      filterSelectedOptions
    />
  );
}
