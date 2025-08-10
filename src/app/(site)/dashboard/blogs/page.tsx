"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow } from "../../../../utils/themeUtils";
import { useEffect, useState } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

export default function ManageBlogsPage() {
  const theme = useTheme();
  const router = useRouter();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending Review";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const canEdit = (blog: any) => {
    return blog.status === "pending";
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Manage Blog Posts
        </Typography>
        <Button
          component={Link}
          href="/dashboard/submission/blog"
          variant="contained"
          color="primary"
        >
          Write New Blog
        </Button>
      </Box>

      {blogs.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No blogs yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start writing your first blog post to share your knowledge with the community.
          </Typography>
          <Button
            component={Link}
            href="/dashboard/submission/blog"
            variant="contained"
            color="primary"
          >
            Write Your First Blog
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} md={6} key={blog._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: getShadow(theme, "elegant"),
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ flex: 1, mr: 2 }}>
                    {blog.title}
                  </Typography>
                  <Chip
                    label={getStatusLabel(blog.status)}
                    color={getStatusColor(blog.status) as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, flex: 1 }}
                >
                  {blog.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </Typography>

                <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                  {(blog.tags || []).map((tag: string, i: number) => (
                    <Chip key={i} size="small" label={tag} variant="outlined" />
                  ))}
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  <Stack direction="row" spacing={1}>
                    {canEdit(blog) && (
                      <Tooltip title="Edit Blog">
                        <IconButton
                          component={Link}
                          href={`/dashboard/blogs/edit/${blog._id}`}
                          size="small"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    <Tooltip title="View Blog">
                      <IconButton
                        component={Link}
                        href={`/blogs/${blog._id}`}
                        size="small"
                        color="info"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                {!canEdit(blog) && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {blog.status === "approved" 
                      ? "This blog has been approved and published. It cannot be edited."
                      : "This blog has been reviewed and cannot be edited."
                    }
                  </Alert>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
