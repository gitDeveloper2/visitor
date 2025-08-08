"use client";

import { Box, Typography, Divider } from "@mui/material";

export default function StepReview({ metadata, content }: { metadata: any, content: string }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Blog Submission
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" fontWeight={600}>Title</Typography>
      <Typography>{metadata?.title}</Typography>

      <Typography variant="subtitle1" fontWeight={600} mt={2}>Tags</Typography>
      <Typography>{metadata?.tags}</Typography>

      <Typography variant="subtitle1" fontWeight={600} mt={2}>Author</Typography>
      <Typography>{metadata?.author}</Typography>
      // StepReview.tsx excerpt — after existing fields
{metadata?.isFounderStory && (
  <>
    <Typography variant="subtitle1" fontWeight={600} mt={2}>Founder Story</Typography>
    <Typography variant="body2">URL: {metadata?.founderUrl}</Typography>
    <Typography variant="caption" color="text.secondary">
      Status: {metadata?.founderDomainCheck?.status} — {metadata?.founderDomainCheck?.message}
    </Typography>
  </>
)}

      <Divider sx={{ my: 4 }} />

      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Blog Content Preview:
      </Typography>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          backgroundColor: "background.paper",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Box>
  );
}
