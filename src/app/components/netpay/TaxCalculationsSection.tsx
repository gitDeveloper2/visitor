import { Box, Grid, Typography } from "@mui/material";
import { NetPayResult } from "../../../utils/calculators/netpay";
// import { NetPayResult } from "@/utils/calculators/netpay";

interface TaxCalculationsSectionProps {
  result: NetPayResult;
}

const TaxCalculationsSection: React.FC<TaxCalculationsSectionProps> = ({ result }) => {
  const safeFormat = (value: number | undefined) => {
    return value !== undefined ? value.toLocaleString() : "0";
  };

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Tax Calculations
      </Typography>
      
      {/* Taxable Pay and Reliefs */}
      <Grid container spacing={0.5}>
        <Grid item xs={6}>
          <Typography variant="body2">Taxable Pay:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.taxablePay)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">Personal Relief:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.personalRelief)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">Affordable Housing Relief:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.affordableHousingRelief)}</Typography>
        </Grid>
      </Grid>

      {/* Subtotal: Total Tax Reliefs */}
      <Grid item xs={12}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            marginTop: 1,
            textAlign: "right",
          }}
        >
          Subtotal (Total Tax Reliefs): KES{" "}
          {safeFormat(result.personalRelief + result.affordableHousingRelief)}
        </Typography>
      </Grid>

      {/* Deductions and PAYE Calculations */}
      <Grid container spacing={0.5}>
        <Grid item xs={6}>
          <Typography variant="body2">Total Allowable Deductions:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.totalAllowableDeductions)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">PAYE Before Reliefs:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.payeBeforeRelief)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">PAYE After Reliefs:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.paye)}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaxCalculationsSection;
