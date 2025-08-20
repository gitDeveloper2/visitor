"use client";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type Feature = {
  title: string;
  description?: string;
};

type Props = {
  features?: Feature[];
};

export default function FeaturesTab({ features }: Props) {
  if (!features || features.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No features have been added for this tool yet.
      </Typography>
    );
  }

  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card variant="outlined" sx={{ display: "flex", gap: 2 }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  <CheckCircleOutlineIcon
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 1, verticalAlign: "middle" }}
                  />
                  {feature.title}
                </Typography>

                {feature.description && (
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
