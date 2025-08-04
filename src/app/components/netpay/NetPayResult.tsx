import { Box, Typography, Divider, Button } from "@mui/material";

import DeductionsSection from "./DeductionsSection";
import TaxCalculationsSection from "./TaxCalculationsSection";
import SummarySection from "./SummarySection";
import { NetPayResult } from "../../../utils/calculators/netpay";
import { printContent } from "../../../utils/exporters/print";

interface NetPayResultsProps {
  result: NetPayResult;
}

const NetPayResults: React.FC<NetPayResultsProps> = ({ result }) => {
  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Results Overview
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Button
      
        variant="contained"
        color="primary"
        onClick={() => printContent("printable-section")}
        sx={{

          marginBottom: 2,
          display: "none",
          margin: "0 auto",
        }}
      >
        Print Results
      </Button>

      <Box id="printable-section" sx={{ marginTop: 2 }}>
        <DeductionsSection result={result} />
        <Divider sx={{ marginBottom: 2 }} />
        <TaxCalculationsSection result={result} />
        <Divider sx={{ marginBottom: 2 }} />
        <SummarySection result={result} />
      </Box>
    </Box>
  );
};

export default NetPayResults;
