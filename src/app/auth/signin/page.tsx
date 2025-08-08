"use client";

import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { LoginForm } from "@/features/auth/components/loginform";
import { authClient } from "../../auth-client";

export default function SignInPage() {
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
        <Stack spacing={3}>
          <LoginForm mode="signin" />

          <Divider>or</Divider>

          <Button
            onClick={() => authClient.signIn.social({ provider: "github" })}
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
          >
            Continue with GitHub
          </Button>

          <Button
            onClick={() => authClient.signIn.social({ provider: "google" })}
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Don’t have an account?{" "}
            <Link href="/auth/signup" passHref>
              <Typography
                component="span"
                sx={{ color: "primary.main", textDecoration: "underline", cursor: "pointer" }}
              >
                Sign up
              </Typography>
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
