import { Box, Grid, Typography, Divider } from "@mui/material";
import { NetPayResult } from "../../../utils/calculators/netpay";
// import { NetPayResult } from "@/utils/calculators/netpay";

interface SummarySectionProps {
  result: NetPayResult;
}

const SummarySection: React.FC<SummarySectionProps> = ({ result }) => {
  const safeFormat = (value: number | undefined) => {
    return value !== undefined ? value.toLocaleString() : "0";
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Summary
      </Typography>
      <Grid container spacing={0.5}>
        <Grid item xs={6}>
          <Typography variant="body2">Total Deductions:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">
            KES {safeFormat(result.totalDeductions)}
          </Typography>
        </Grid>

        

        <Grid item xs={6}>
          <Typography variant="body2">Net Taxable Income:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="body2">
            KES {safeFormat(result.taxablePay - result.totalDeductions)}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: "bold",
              marginTop: 2,
              textAlign: "center",
              fontSize: "1.1rem",
            }}
          >
            Net Pay: KES {safeFormat(result.netPay)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummarySection;
