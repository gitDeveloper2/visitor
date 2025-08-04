import {styled} from  '@mui/material/styles';

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const StyledImagePreviewBox = styled("div")({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginTop: "20px",
});

export const StyledImagePreview = styled("img")({
  maxWidth: "100%",
  height: "auto",
  maxHeight: "80vh", /* Ensures image fits within viewport height */
  border: "1px solid #ddd",
  padding: "10px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

export const StyledImagePreviewContainer = styled("div")({
  // maxWidth: "45%",
  textAlign: "center",
  marginBottom: "20px",
});
