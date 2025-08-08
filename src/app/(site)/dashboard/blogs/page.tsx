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
import { useEffect, useState } from "react";

export default function ManageBlogsPage() {
  const theme = useTheme();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user-blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Blog Posts
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3} mt={2}>
        {blogs.map((blog) => (
          <Grid item xs={12} md={6} key={blog._id}>
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
                {blog.content?.slice(0, 100)}
              </Typography>
              <Stack direction="row" spacing={1} mb={1}>
                {(blog.tags || []).map((tag: string, i: number) => (
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
