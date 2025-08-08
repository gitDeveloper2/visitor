"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import { authClient } from "../../../app/auth-client";

export function LoginForm({ mode }: { mode: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await authClient.signIn.email(
          { email, password },
          {
            onError: (ctx) => {
              if (ctx.error.status === 403) {
                alert("Please verify your email address");
              }
              alert(ctx.error.message);
            },
          }
        );
      } else {
        await authClient.signUp.email({ email, password, name });
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2}>
        <Typography variant="h5" align="center" fontWeight={600}>
          {mode === "signin" ? "Welcome back" : "Create an account"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ textAlign: "center" }}>
            {error}
          </Alert>
        )}

        {mode === "signup" && (
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
            required
            fullWidth
          />
        )}

        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          required
          fullWidth
        />

        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : mode === "signin" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </Button>

        {mode === "signin" && (
          <Typography variant="body2" align="center">
            <MuiLink component={Link} href="/auth/forgot-password" underline="hover">
              Forgot your password?
            </MuiLink>
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
