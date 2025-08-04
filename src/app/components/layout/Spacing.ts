import { Grid, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";

interface StyledSectionGridProps {
  theme: Theme;
  color?: "primary" | "secondary" | string;
  y32?: boolean;
  y16?: boolean;
}

export const StyledSectionGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "y32" && prop !== "y16",
})<StyledSectionGridProps>(({ theme, color, y32, y16 }) => ({
  padding: "16px 16px 32px", // Default padding
  color: theme.palette.text.primary,
  backgroundColor:
    color === "primary"
      ? theme.palette.primary.main
      : color === "secondary"
      ? theme.palette.secondary.main
      : color,

  [theme.breakpoints.up("sm")]: {
    padding: y32 ? "32px 32px 32px" : y16 ? "16px 32px 32px" : "64px 32px 64px",
  },
  [theme.breakpoints.up("md")]: {
    padding: y32
      ? "32px 120px 32px"
      : y16
      ? "16px 120px 32px"
      : "64px 120px 64px",
  },
}));
