"use client";

import { useForm, useFieldArray , Controller, Control, UseFormRegister, FieldErrors,useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { authClient } from "../../../../auth-client";

const socialPlatforms = [
  "GitHub",
  "Twitter",
  "LinkedIn",
  "Facebook",
  "Instagram",
  "Website",
  "Other",
] as const;

const socialAccountSchema = z
  .object({
    type: z.enum([
      'GitHub',
      'Twitter',
      'LinkedIn',
      'Facebook',
      'Instagram',
      'Website',
      'Other',
    ]),
    username: z.string().min(1, 'Username is required'),
    url: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { type, url } = data;

    const requiresUrl = ['Website', 'Other'].includes(type);
    const isEmpty = !url?.trim();
    const isValidUrl = /^https?:\/\/.+\..+/.test(url || '');

    if (requiresUrl && isEmpty) {
      ctx.addIssue({
        path: ['url'],
        code: z.ZodIssueCode.custom,
        message: 'URL is required for this platform',
      });
    }

    if (!isEmpty && !isValidUrl) {
      ctx.addIssue({
        path: ['url'],
        code: z.ZodIssueCode.custom,
        message: 'Invalid url',
      });
    }
  });


const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(160).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  role: z.enum(["user", "creator", "admin"]),
  socialAccounts: z.array(socialAccountSchema).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  fields: any[];
  control: Control<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  append: (value: any) => void;
  remove: (index: number) => void;
}


const platformsRequiringUrl = ['Website', 'Other'];


function SocialAccountsFieldArray({ fields, control, register, errors, append, remove }) {
  // ✅ Single hook call — safe
  const watchedAccounts = useWatch({
    control,
    name: 'socialAccounts',
  });

  return (
    <Box>
      <Typography variant="h6" mb={1}>
        Social Accounts
      </Typography>

      <Stack spacing={2}>
        {fields.map((field, i) => {
          const currentType = watchedAccounts?.[i]?.type ?? 'GitHub';

          return (
            <Grid container spacing={1} alignItems="center" key={field.id}>
              <Grid size={{xs:12,sm:3}} >
                <Controller
                  name={`socialAccounts.${i}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      fullWidth
                      {...field}
                      error={!!errors.socialAccounts?.[i]?.type}
                    >
                      {socialPlatforms.map((platform) => (
                        <MenuItem key={platform} value={platform}>
                          {platform}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Grid>

              <Grid size={{xs:12,sm:4}} >
                <TextField
                  label="Username / Handle"
                  fullWidth
                  {...register(`socialAccounts.${i}.username`)}
                  error={!!errors.socialAccounts?.[i]?.username}
                  helperText={errors.socialAccounts?.[i]?.username?.message}
                />
              </Grid>

              {platformsRequiringUrl.includes(currentType) && (
                <Grid size={{xs:12,sm:4}}>
                  <TextField
                    label="URL"
                    fullWidth
                    {...register(`socialAccounts.${i}.url`)}
                    error={!!errors.socialAccounts?.[i]?.url}
                    helperText={errors.socialAccounts?.[i]?.url?.message}
                  />
                </Grid>
              )}

              <Grid size={{xs:12,sm:1}} >
                <IconButton
                  aria-label="Remove"
                  color="error"
                  onClick={() => remove(i)}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}

        <Button
          startIcon={<Add />}
          onClick={() => append({ type: "GitHub", username: "", url: "" }
          )}
          variant="outlined"
        >
          Add Social Account
        </Button>
      </Stack>
    </Box>
  );
}

export default function ProfilePage() {
  const { data: session} = authClient.useSession();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [serverMessage, setServerMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { socialAccounts: [{ type: "GitHub", username: "", url: "" }] }

  
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialAccounts",
  });

  useEffect(() => {
    async function loadProfile() {
      setLoadingProfile(true);
      setServerMessage(null);
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          // Reset the entire form state at once here
          reset({
            name: data.name || "",
            email: data.email || "",
            avatarUrl: data.avatarUrl || "",
            bio: data.bio || "",
            websiteUrl: data.websiteUrl || "",
            role: data.role || "user",
            socialAccounts: (data.socialAccounts?.map((acc: any) => ({
              type: acc.type || 'GitHub',  // fallback default type
              username: acc.username || '',
              url: acc.url || '',
            })) ?? [{ type: 'GitHub', username: '', url: '' }]),
          });
        } else {
          setServerMessage({ type: "error", text: data.error || "Failed to load profile" });
        }
      } catch {
        setServerMessage({ type: "error", text: "Network error" });
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSnackbar({ open: false, message: "", severity: "success" });
    
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
    } else {
      const errorData = await res.json();
      setSnackbar({ open: true, message: errorData.error || "Something went wrong", severity: "error" });
    }
  };

  if (!session) return <Typography>Loading session...</Typography>;

  return (

    <Container maxWidth="sm">
      <Typography variant="h4" mb={3}>
        Profile
      </Typography>
 

      {loadingProfile && <Typography>Loading profile...</Typography>}

      {serverMessage && (
        <Alert severity={serverMessage.type === "error" ? "error" : "success"} sx={{ mb: 2 }}>
          {serverMessage.text}
        </Alert>
      )}

      {!loadingProfile && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="center">
              <Avatar src={session.user?.image ?? undefined} sx={{ width: 56, height: 56 }} />
            </Box>

            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={3}
              {...register("bio")}
              error={!!errors.bio}
              helperText={errors.bio?.message}
            />

            <TextField
              label="Website"
              fullWidth
              {...register("websiteUrl")}
              error={!!errors.websiteUrl}
              helperText={errors.websiteUrl?.message}
            />

            <TextField
              label="Role"
              fullWidth
              {...register("role")}
              InputProps={{ readOnly: true }}
            />

<SocialAccountsFieldArray {...{ fields, control, register, errors, append, remove }} />


            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </form>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    
  );
}
