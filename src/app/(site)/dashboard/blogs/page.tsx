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

const mockBlogs = [
  {
    id: "blog-1",
    title: "10 VSCode Extensions You Must Try",
    status: "approved",
    summary: "A curated list of powerful VSCode extensions to boost productivity.",
    tags: ["VSCode", "tools", "productivity"],
  },
  {
    id: "blog-2",
    title: "How I Built a GPT-Powered CLI",
    status: "pending",
    summary: "Step-by-step breakdown of integrating OpenAI into a CLI tool.",
    tags: ["AI", "GPT", "CLI"],
  },
];

export default function ManageBlogsPage() {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Blog Posts
      </Typography>

      <Grid container spacing={3} mt={2}>
        {mockBlogs.map((blog) => (
          <Grid item xs={12} md={6} key={blog.id}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h6">{blog.title}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {blog.summary}
              </Typography>

              <Stack direction="row" spacing={1} mb={1}>
                {blog.tags.map((tag, i) => (
                  <Chip key={i} size="small" label={tag} />
                ))}
              </Stack>

              <Chip
                label={blog.status}
                color={
                  blog.status === "approved"
                    ? "success"
                    : blog.status === "pending"
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
