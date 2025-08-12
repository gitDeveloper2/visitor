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
  Tabs,
  Tab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow } from "../../../../utils/themeUtils";
import { useEffect, useState } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

export default function ManageBlogsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch both blogs and drafts
        const [blogsRes, draftsRes] = await Promise.all([
          fetch("/api/user-blogs"),
          fetch("/api/user-blogs/drafts")
        ]);

        if (!blogsRes.ok) throw new Error("Failed to fetch blogs");
        if (!draftsRes.ok) throw new Error("Failed to fetch drafts");

        const blogsData = await blogsRes.json();
        const draftsData = await draftsRes.json();

        setBlogs(blogsData.blogs || []);
        setDrafts(draftsData.drafts || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/user-blogs/draft/${draftId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setDrafts(prev => prev.filter(draft => draft._id !== draftId));
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={`Published Blogs (${blogs.length})`} />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Drafts ({drafts.length})</span>
              {drafts.filter(d => d.premiumReady).length > 0 && (
                <Chip
                  label={`${drafts.filter(d => d.premiumReady).length} Premium`}
                  color="success"
                  size="small"
                  variant="filled"
                  icon={<span style={{ fontSize: '12px' }}>💎</span>}
                  sx={{ height: '20px', fontSize: '0.7rem' }}
                />
              )}
            </Box>
          } 
        />
      </Tabs>

      {activeTab === 0 && (
        // Published Blogs Tab
        blogs.length === 0 ? (
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
                          href={`/blogs/${blog.slug}`}
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
        )
      )}

      {activeTab === 1 && (
        // Drafts Tab
        <>
          {/* Drafts Summary */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="text.primary">
                  📝 Drafts Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {drafts.length} total draft{drafts.length !== 1 ? 's' : ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      label={`${drafts.filter(d => d.premiumReady).length} Premium Ready`}
                      color="success"
                      variant="filled"
                      icon={<span style={{ fontSize: '14px' }}>💎</span>}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      label={`${drafts.filter(d => !d.premiumReady).length} Regular Drafts`}
                      color="default"
                      variant="outlined"
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {drafts.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No drafts yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start writing a blog post and save it as a draft to continue later.
              </Typography>
              <Button
                component={Link}
                href="/dashboard/submission/blog"
                variant="contained"
                color="primary"
              >
                Start Writing
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {drafts.map((draft) => (
                <Grid item xs={12} md={6} key={draft._id}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: getShadow(theme, "elegant"),
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: draft.premiumReady ? `3px solid ${theme.palette.success.main}` : '1px solid',
                      borderColor: draft.premiumReady ? theme.palette.success.main : theme.palette.divider,
                      background: draft.premiumReady 
                        ? `linear-gradient(135deg, ${theme.palette.success.main}08, ${theme.palette.success.main}15)` 
                        : 'inherit',
                      position: 'relative',
                    }}
                  >
                    {/* Premium Badge */}
                    {draft.premiumReady && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 16,
                          backgroundColor: theme.palette.success.main,
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          zIndex: 1,
                          boxShadow: theme.shadows[2],
                        }}
                      >
                        💎 PREMIUM READY
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ flex: 1, mr: 2 }}>
                        {draft.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {draft.premiumReady && (
                          <Chip
                            label="Premium Ready"
                            color="success"
                            size="small"
                            variant="filled"
                            icon={<span style={{ fontSize: '16px' }}>💎</span>}
                          />
                        )}
                        <Chip
                          label="Draft"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, flex: 1 }}
                    >
                      {draft.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                    </Typography>

                    <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                      {(Array.isArray(draft.tags) ? draft.tags : [])
                        .map((tag: string, i: number) => (
                          <Chip key={i} size="small" label={tag} variant="outlined" />
                        ))}
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                      </Typography>
                      
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={draft.premiumReady ? "Complete and Submit Premium Blog" : "Continue Writing Draft"}>
                          <IconButton
                            component={Link}
                            href={`/dashboard/submission/blog?draftId=${draft._id}`}
                            size="small"
                            color={draft.premiumReady ? "success" : "primary"}
                            sx={{
                              backgroundColor: draft.premiumReady ? theme.palette.success.main : 'transparent',
                              color: draft.premiumReady ? 'white' : 'inherit',
                              '&:hover': {
                                backgroundColor: draft.premiumReady ? theme.palette.success.dark : 'inherit',
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Draft">
                          <IconButton
                            onClick={() => handleDeleteDraft(draft._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>

                    {draft.premiumReady && (
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mt: 2,
                          backgroundColor: theme.palette.success.light,
                          color: theme.palette.success.contrastText,
                          '& .MuiAlert-icon': {
                            color: theme.palette.success.contrastText,
                          }
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          🎉 Premium Access Confirmed!
                        </Typography>
                        <Typography variant="body2">
                          This draft is ready to be completed and submitted with your premium access. 
                          Click the green edit button above to finish your blog.
                        </Typography>
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
