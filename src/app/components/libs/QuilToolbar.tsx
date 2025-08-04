import React from "react";
import { Button, Stack, Checkbox, FormControlLabel } from "@mui/material";
import Quill from "quill";

export const QuilToolbar = ({
  isHtmlMode,
  toggleHtmlMode,
  handleSave,
  isContentSaving,
  quillRef,
  generateToc,
  setGenerateToc,
}: {
  isHtmlMode: boolean;
  toggleHtmlMode: () => void;
  handleSave: () => void;
  isContentSaving: boolean;
  quillRef: React.MutableRefObject<Quill | null>;
  generateToc: boolean;
  setGenerateToc: React.Dispatch<React.SetStateAction<boolean>>;
  
}) =>
  {
    
    
    
    return(
    <Stack className="sticky-ql-stack" direction="row" spacing={2} sx={{ marginBottom: "10px" }}>
    <Button size="small"  variant="contained" onClick={toggleHtmlMode} >
      {isHtmlMode ? "Switch to Editor" : "Switch to HTML"}
    </Button>
   

    <Button  size="small"  variant="contained" onClick={handleSave}>
      {isContentSaving ? "Saving..." : "Save Content"}
    </Button>
    <FormControlLabel
control={
<Checkbox
checked={generateToc}
onChange={(e) => setGenerateToc(e.target.checked)}
color="primary"
/>
}
label="Generate Table of Contents"
sx={{
alignItems: "center", // Align checkbox and text vertically
margin: 0, // Remove extra margin
}}
/>
  </Stack>
);
  }