"use client";

// import { calculateNetPay, NetPayResult } from "@/utils/ ";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import NetPayResults from "./NetPayResult";
import { calculateNetPay, NetPayResult } from "../../../utils/calculators/netpay";

const NetPayForm = () => {
  const [salary, setSalary] = useState<number>(0);
  const [nonCashBenefits, setNonCashBenefits] = useState<number>(0);
  const [pensionContribution, setPensionContribution] = useState<number>(0);
  const [otherAllowableDeductions, setOtherAllowableDeductions] =
    useState<number>(0);
  const [result, setResult] = useState<NetPayResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a delay to show the loading state
    setTimeout(() => {
      const options = {
        nonCashBenefits,
        pensionContribution,
        otherAllowableDeductions,
      };
      const calculation = calculateNetPay(salary, options);
      setResult(calculation);
      setLoading(false);
    }, 500); // Replace with actual calculation time if necessary
  };

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <Typography component={'h1'} variant="h5" gutterBottom align="center">
        Kenya Net Pay Calculator
      </Typography>

      <Paper sx={{ padding: 2, width: "100%", boxShadow: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Base Salary (KES)"
                type="number"
                size="small"
                fullWidth
                variant="outlined"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Non-Cash Benefits (KES)"
                type="number"
                size="small"
                fullWidth
                variant="outlined"
                value={nonCashBenefits}
                onChange={(e) => setNonCashBenefits(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Other Deductions (KES)"
                type="number"
                size="small"
                fullWidth
                variant="outlined"
                value={otherAllowableDeductions}
                onChange={(e) =>
                  setOtherAllowableDeductions(Number(e.target.value))
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                sx={{
                  width: "auto",
                  padding: "10px",
                  margin: "8px",
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : "Calculate NetPay"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {loading ? (
        <Paper
          sx={{
            padding: 2,
            width: "100%",
            boxShadow: 2,
            marginTop: 2,
          }}
        >
          <Typography component={'h2'} variant="h6" gutterBottom align="center">
            Calculating Results...
          </Typography>
          <Skeleton variant="rectangular" height={40} sx={{ marginBottom: 1 }} />
          <Skeleton variant="rectangular" height={40} sx={{ marginBottom: 1 }} />
          <Skeleton variant="rectangular" height={40} sx={{ marginBottom: 1 }} />
        </Paper>
      ) : (
        result && <NetPayResults result={result} />
      )}
    </Box>
  );
};

export default NetPayForm;
