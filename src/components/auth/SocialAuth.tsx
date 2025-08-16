"use client";

import {
  Button,
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import {
  GitHub as GitHubIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";

interface SocialAuthProps {
  onSocialAuth: (provider: "github" | "google") => Promise<void>;
}

export function SocialAuth({ onSocialAuth }: SocialAuthProps) {
  return (
    <>
      {/* Divider */}
      <Divider sx={{ my: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
          or continue with
        </Typography>
      </Divider>

      {/* Social Sign In Buttons */}
      <Stack spacing={2}>
        <Button
          onClick={() => onSocialAuth("github")}
          fullWidth
          variant="outlined"
          startIcon={<GitHubIcon />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "primary.main",
              color: "white",
            },
          }}
        >
          Continue with GitHub
        </Button>

        <Button
          onClick={() => onSocialAuth("google")}
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "primary.main",
              color: "white",
            },
          }}
        >
          Continue with Google
        </Button>
      </Stack>
    </>
  );
} 