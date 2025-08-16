"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { authClient } from "../../auth-client";
import { AuthForm } from "../../../components/auth/AuthForm";
import { SocialAuth } from "../../../components/auth/SocialAuth";
import { useState } from "react";

export default function SignInPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (data: { email: string; password: string }) => {
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.email(
        { email: data.email, password: data.password },
        {
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              setError("Please verify your email address");
            } else {
              setError(ctx.error.message);
            }
          },
        }
      );
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    try {
      await authClient.signIn.social({ provider });
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        p: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(103, 58, 183, 0.1) 0%, transparent 70%)",
          opacity: 0.25,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "visible",
            border: "1px solid",
            borderColor: "divider",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: theme.shadows[8],
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                Sign in to your account to continue
              </Typography>
            </Box>

            {/* Auth Form */}
            <AuthForm
              mode="signin"
              onSubmit={handleSubmit}
              error={error}
              loading={loading}
            />

            {/* Forgot Password Link */}
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              <Link 
                href="/auth/forgot-password" 
                style={{ 
                  color: theme.palette.primary.main, 
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot your password?
              </Link>
            </Typography>

            {/* Social Auth */}
            <SocialAuth onSocialAuth={handleSocialSignIn} />

            {/* Sign Up Link */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Don't have an account?{" "}
                <Link 
                  href="/auth/signup" 
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
