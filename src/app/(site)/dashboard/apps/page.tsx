"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow } from "../../../../utils/themeUtils";

const mockApps = [
  {
    id: "app-1",
    name: "Snippet Saver",
    status: "approved",
    description: "Save and manage your favorite code snippets with ease.",
    tags: ["productivity", "code", "tools"],
  },
  {
    id: "app-2",
    name: "Focus Timer",
    status: "pending",
    description: "Pomodoro-style timer to boost productivity and focus.",
    tags: ["timer", "focus", "AI"],
  },
];

export default function ManageAppsPage() {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Submitted Apps
      </Typography>

      <Grid container spacing={3} mt={2}>
        {mockApps.map((app) => (
          <Grid item xs={12} md={6} key={app.id}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h6">{app.name}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {app.description}
              </Typography>

              <Stack direction="row" spacing={1} mb={1}>
                {app.tags.map((tag, i) => (
                  <Chip key={i} size="small" label={tag} />
                ))}
              </Stack>

              <Chip
                label={app.status}
                color={
                  app.status === "approved"
                    ? "success"
                    : app.status === "pending"
                    ? "warning"
                    : "default"
                }
                sx={{ mt: 1 }}
              />

              <Box mt={2}>
                <Button size="small" variant="outlined">
                  Edit
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
