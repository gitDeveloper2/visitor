"use client";

import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: { email: string; password: string; name?: string }) => Promise<void>;
  error?: string;
  loading?: boolean;
}

export function AuthForm({ mode, onSubmit, error, loading }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = mode === "signup" ? { email, password, name } : { email, password };
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              "& .MuiAlert-icon": { fontSize: "1.5rem" }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Name Field - Only for signup */}
        {mode === "signup" && (
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="name-input">Full Name</InputLabel>
            <OutlinedInput
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Full Name"
              required
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                },
              }}
            />
          </FormControl>
        )}

        {/* Email Field */}
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="email-input">Email Address</InputLabel>
          <OutlinedInput
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            required
            startAdornment={
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "primary.main" }} />
              </InputAdornment>
            }
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
              },
            }}
          />
        </FormControl>

        {/* Password Field */}
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <OutlinedInput
            id="password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            required
            startAdornment={
              <InputAdornment position="start">
                <LockIcon sx={{ color: "primary.main" }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: "primary.main" }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
              },
            }}
          />
          {mode === "signup" && (
            <FormHelperText>
              Password must be at least 8 characters long
            </FormHelperText>
          )}
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{
            py: 2,
            borderRadius: 2,
            fontSize: "1.1rem",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: 2,
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  border: "2px solid #fff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
              {mode === "signin" ? "Signing In..." : "Creating Account..."}
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {mode === "signin" ? "Sign In" : "Create Account"}
              {mode === "signin" ? (
                <ArrowForwardIcon sx={{ fontSize: "1.2rem" }} />
              ) : (
                <CheckCircleIcon sx={{ fontSize: "1.2rem" }} />
              )}
            </Box>
          )}
        </Button>
      </Stack>
    </Box>
  );
} 