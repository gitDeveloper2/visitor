"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BadgeCheck, DollarSign, UploadCloud } from "lucide-react";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "../../../../utils/themeUtils";

export default function SubmitAppPage() {
  const theme = useTheme();

  const reviewSteps = ["Initial Review", "Quality Check", "Publication"];

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="md">
        {/* Page Title */}
        <Typography variant="h2" sx={typographyVariants.sectionTitle} textAlign="center">
          Submit Your <Box component="span" sx={commonStyles.textGradient}>App</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" mt={2} mb={6}>
          Share your innovation with thousands of tech enthusiasts and get the visibility you deserve.
        </Typography>

        {/* Form */}
        <Paper sx={{ ...getGlassStyles(theme), p: 4, borderRadius: "1.5rem", boxShadow: getShadow(theme, "elegant") }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="App Name" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="App URL" placeholder="https://yourapp.com" required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={4}
                required
                fullWidth
                helperText="Minimum 100 characters. Be detailed about your app’s features and benefits."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tags"
                fullWidth
                required
                placeholder="e.g. React, Mobile, Productivity"
                helperText="Add 3-5 relevant tags"
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: "12px",
                  textAlign: "center",
                  p: 4,
                  color: "text.secondary",
                  cursor: "pointer",
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <UploadCloud size={28} />
                <Typography mt={1}>Drag and drop your screenshots here</Typography>
                <Typography variant="caption">Upload 3-5 high-quality images (PNG/JPG)</Typography>
                <Button sx={{ mt: 2 }} variant="outlined" size="small">Choose Files</Button>
              </Box>
            </Grid>
          </Grid>

          {/* Premium Section */}
          <Box
            sx={{
              mt: 5,
              p: 3,
              borderRadius: "1rem",
              ...getGlassStyles(theme),
              border: `1px solid ${theme.palette.warning.main}`,
              boxShadow: getShadow(theme, "elegant"),
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <DollarSign size={20} color={theme.palette.warning.main} />
              <Typography variant="h6" fontWeight={700}>
                Upgrade to Premium – <Box component="span" color="warning.main">$19</Box>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Get a verified badge, priority placement, and analytics insights for your app.
            </Typography>
            <Button
              sx={{ mt: 2, borderRadius: "999px" }}
              variant="outlined"
              color="warning"
              startIcon={<BadgeCheck />}
            >
              Upgrade to Premium
            </Button>
          </Box>

          {/* Review Process */}
          <Box mt={6}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Review Process
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5}>
              {reviewSteps.map((step) => (
                <Chip
                  key={step}
                  label={step}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: "999px",
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                  }}
                
                />
              ))}
            </Box>
          </Box>

          {/* Submit Button */}
          <Box mt={6} textAlign="center">
            <Button variant="contained" color="primary" size="large" sx={{ borderRadius: "999px", px: 4 }}>
              Submit App for Review
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
