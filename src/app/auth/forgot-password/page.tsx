"use client";

import { useState } from "react";
import { authClient } from "@/app/auth-client";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: "/signin",
      });
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        py: 4,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
        <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
          Reset Password
        </Typography>

        {sent ? (
          <Alert severity="success" sx={{ textAlign: "center" }}>
            A reset link has been sent to your email.
          </Alert>
        ) : (
          <Box component="form" onSubmit={onSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Send Reset Link
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
