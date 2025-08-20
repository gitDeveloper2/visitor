"use client";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type PricingPlan = {
  name: string;
  price: string;
  features: string[];
  isFree?: boolean;
  highlight?: boolean;
};

type Props = {
  pricing?: PricingPlan[];
};

export default function PricingTab({ pricing }: Props) {
  if (!pricing || pricing.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No pricing plans available.
      </Typography>
    );
  }
  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {pricing.map((plan, idx) => (
          <Grid size={{xs:12,md:4}} key={idx}>
            <Card
              elevation={plan.highlight ? 6 : 1}
              sx={{
                border:
                  plan.highlight && !plan.isFree
                    ? "2px solid #1976d2"
                    : undefined,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">{plan.name}</Typography>
                  {plan.isFree && <Chip label="Free" color="success" size="small" />}
                  {plan.highlight && !plan.isFree && (
                    <Chip label="Most Popular" color="primary" size="small" />
                  )}
                </Box>

                <Typography variant="h4" my={2}>
                  {plan.price}
                </Typography>

                <List dense>
                {plan.features.flatMap(f =>
  typeof f === "string" ? f.split(",").map(s => s.trim()) : []
).map((feature, i) => (
  <ListItem key={i}>
    <ListItemIcon>
      <CheckCircleOutlineIcon fontSize="small" color="primary" />
    </ListItemIcon>
    <ListItemText primary={feature} />
  </ListItem>
))}

                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
