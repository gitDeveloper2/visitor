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

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    setError("");
    setLoading(true);

    try {
      await authClient.signUp.email({ 
        email: data.email, 
        password: data.password, 
        name: data.name || "" 
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: "github" | "google") => {
    try {
      await authClient.signIn.social({ provider });
    } catch (err: any) {
      setError(`Failed to sign up with ${provider}`);
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
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                Join us and start your journey today
              </Typography>
            </Box>

            {/* Auth Form */}
            <AuthForm
              mode="signup"
              onSubmit={handleSubmit}
              error={error}
              loading={loading}
            />

            {/* Social Auth */}
            <SocialAuth onSocialAuth={handleSocialSignUp} />

            {/* Terms and Privacy */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                By creating an account, you agree to our{" "}
                <Link 
                  href="/terms" 
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link 
                  href="/policy" 
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            </Box>

            {/* Sign In Link */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Already have an account?{" "}
                <Link 
                  href="/auth/signin" 
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
