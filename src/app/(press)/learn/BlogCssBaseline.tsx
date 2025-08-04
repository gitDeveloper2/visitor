"use client";
import { GlobalStyles } from "@mui/material";
import { blogTheme } from "../../theme";

export default function BlogCss() {
  return (
    <GlobalStyles
      styles={{
        "#learn-wrapper h1": blogTheme.typography.h1,
        "#learn-wrapper h2": blogTheme.typography.h2,
        "#learn-wrapper h3": blogTheme.typography.h3,
        "#learn-wrapper h4": blogTheme.typography.h4,
        "#learn-wrapper h5": blogTheme.typography.h5,
        "#learn-wrapper h6": blogTheme.typography.h6,
        "#learn-wrapper p": blogTheme.typography.body1,
        "#learn-wrapper ul": { paddingLeft: "1.25rem", marginBottom: "1.5rem" },
        "#learn-wrapper li": { marginBottom: "0.5rem" },
        "#toc-header": {
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "1rem",
          color:'red'
        },
        "#toc": {
          listStyle: "decimal inside",
          paddingLeft: "1rem",
          margin: 0,
    
          
        },
        "#toc li": {
          margin: "0.5rem 0",
        },
        "#toc a": {
          color: "#1976d2",
          textDecoration: "none",
          transition: "color 0.2s ease",
          "&:hover": {
            color: "#1565c0",
            textDecoration: "underline",
          },
        },
        "@media (max-width: 600px)": {
          "#toc-header": {
            fontSize: "1.25rem",
          },
          "#toc": {
            fontSize: "0.95rem",
          },
        },
      }}
    />
  );
}
