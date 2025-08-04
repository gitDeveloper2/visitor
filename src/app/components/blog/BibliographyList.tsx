import React from "react";
import { Typography, Box, Link } from "@mui/material";
import { Reference } from "../../../types/Bibliography";
import { formatAPAReference, formatMLAReference } from "../../../utils/generators/citation";

// List of References
export const BibliographyList: React.FC<{
  references: Reference[];
  formatReference: (ref: Reference) => string;
}> = ({ references, formatReference }) => {
  if (references.length === 0) return null; // Don't render if no references

  return (
    <Box component="ol" sx={{ paddingLeft: "20px", margin: "10px 0" }}>
      {references.map((reference) => {
        const formattedText = formatReference(reference);
        const kind = reference.kind || 'nofollow'; // Default to 'nofollow' if kind is not provided
        const relValue = kind === 'dofollow' ? 'noopener noreferrer' : 'noopener noreferrer nofollow'; // Set rel based on kind

        const hasURL = !!reference.url; // Check if the reference contains a URL

        return (
          <Typography
            key={reference.id}
            component="li"
            variant="body1"
            sx={{
              marginBottom: "8px",
              lineHeight: 1.6,
              wordWrap: "break-word", // Ensures long words/URLs wrap
              overflowWrap: "break-word", // Alternative for better browser compatibility
            }}
          >
            {hasURL ? (
              <Link 
              sx={{
                wordWrap: "break-word", // Ensures the link text wraps
                overflowWrap: "break-word", // Alternative for better browser compatibility
                whiteSpace: "normal", // Prevents single-line overflow
              }}
              href={reference.url} target="_blank"          
              rel={relValue}>

                {formattedText}
              </Link>
            ) : (
              formattedText
            )}
          </Typography>
        );
      })}
    </Box>
  );
};

// Main Bibliography Display
export const CitationDisplay: React.FC<{
  inlineReferences: Reference[];
  backgroundReferences: Reference[];
  displayAPA: boolean; // Boolean to determine citation style
}> = ({ inlineReferences, backgroundReferences, displayAPA }) => {
  // Choose the reference format function based on the boolean flag
  const formatReference = displayAPA ? formatAPAReference : formatMLAReference;

  // Check if both inline and background references are empty
  const hasInlineReferences = inlineReferences.length > 0;
  const hasBackgroundReferences = backgroundReferences.length > 0;

  if (!hasInlineReferences && !hasBackgroundReferences) return null; // Don't render if both are empty

  return (
    <Box component={'section'}>
      {(hasInlineReferences || hasBackgroundReferences) && (
        <Typography variant="h2" gutterBottom>
          References
        </Typography>
      )}

      {hasInlineReferences && (
        <>
          <Typography variant="h6" component={'h3'} gutterBottom>
            Inline References
          </Typography>
          <BibliographyList references={inlineReferences} formatReference={formatReference} />
        </>
      )}

      {hasBackgroundReferences && (
        <>
          <Typography variant="h6" component={'h3'} gutterBottom>
            Background References
          </Typography>
          <BibliographyList references={backgroundReferences} formatReference={formatReference} />
        </>
      )}
    </Box>
  );
};
