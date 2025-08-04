import { Box, Grid, Typography } from "@mui/material";
import { NetPayResult } from "../../../utils/calculators/netpay";
// import { NetPayResult } from "@/utils/calculators/netpay";

interface DeductionsSectionProps {
  result: NetPayResult;
}

const DeductionsSection: React.FC<DeductionsSectionProps> = ({ result }) => {
  const safeFormat = (value: number | undefined) => {
    return value !== undefined ? value.toLocaleString() : "0";
  };

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Deductions
      </Typography>
      <Grid container spacing={0.5}>
        <Grid item xs={6}>
          <Typography variant="body2">NSSF Tier 1:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.nssfTier1)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">NSSF Tier 2:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.nssfTier2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">SHIF Contribution:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.shif)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2">Housing Levy:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">KES {safeFormat(result.housingLevy)}</Typography>
        </Grid>

        {/* Add other deductions if needed */}
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            marginTop: 1,
            textAlign: "right",
          }}
        >
          Subtotal (Total Deductions): KES {safeFormat(result.totalDeductions)}
        </Typography>
      </Grid>
    </Box>
  );
};

export default DeductionsSection;
