"use client";

import { LoginForm } from "@/features/auth/components/loginform";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import Link from "next/link";

export default function SignUpPage() {
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
          <LoginForm mode="signup" />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Link href="/auth/signin" passHref>
              <Typography
                component="span"
                sx={{ color: "primary.main", textDecoration: "underline", cursor: "pointer" }}
              >
                Sign in
              </Typography>
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
