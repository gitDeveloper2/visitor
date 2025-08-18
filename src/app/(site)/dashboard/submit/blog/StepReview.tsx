"use client";

import { Box, Typography, Divider, Chip, Tooltip } from "@mui/material";

export default function StepReview({ metadata, content, qualityBreakdown }: { metadata: any, content: string, qualityBreakdown?: { wordCount: number; headingsScore: number; linksScore: number; imagesScore: number; tagsScore: number; total: number } }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Blog Submission
      </Typography>

      <Divider sx={{ my: 3 }} />

      {qualityBreakdown && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>Quality Preview</Typography>
          <Typography variant="body2" color="text.secondary">Score: {qualityBreakdown.total.toFixed(2)}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Tooltip title={`Words: ${qualityBreakdown.wordCount}`}>
              <Chip size="small" label={`Words ${qualityBreakdown.wordCount}`} />
            </Tooltip>
            <Tooltip title={`Headings: ${qualityBreakdown.headingsScore.toFixed(2)}`}>
              <Chip size="small" label={`Headings ${qualityBreakdown.headingsScore.toFixed(2)}`} />
            </Tooltip>
            <Tooltip title={`Links: ${qualityBreakdown.linksScore.toFixed(2)}`}>
              <Chip size="small" label={`Links ${qualityBreakdown.linksScore.toFixed(2)}`} />
            </Tooltip>
            <Tooltip title={`Images: ${qualityBreakdown.imagesScore.toFixed(2)}`}>
              <Chip size="small" label={`Images ${qualityBreakdown.imagesScore.toFixed(2)}`} />
            </Tooltip>
            <Tooltip title={`Tags: ${qualityBreakdown.tagsScore.toFixed(2)}`}>
              <Chip size="small" label={`Tags ${qualityBreakdown.tagsScore.toFixed(2)}`} />
            </Tooltip>
          </Box>
        </Box>
      )}

      <Typography variant="subtitle1" fontWeight={600}>Title</Typography>
      <Typography>{metadata?.title}</Typography>

      <Typography variant="subtitle1" fontWeight={600} mt={2}>Tags</Typography>
      <Typography>{metadata?.tags}</Typography>

      <Typography variant="subtitle1" fontWeight={600} mt={2}>Author</Typography>
      <Typography>{metadata?.author}</Typography>
      
      {/* Founder Story section */}
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
