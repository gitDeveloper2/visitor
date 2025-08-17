"use client";

import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getShadow, getGlassStyles, typographyVariants, commonStyles } from "../../../../../utils/themeUtils";
import { useTheme } from "@mui/material/styles";
import { Edit, Visibility, CheckCircle, Cancel, Schedule } from "@mui/icons-material";
import Link from "next/link";
import Badge from "@/app/components/badges/Badge";

interface BlogPost {
  _id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  isFounderStory?: boolean;
  category?: string;
  subcategories?: string[];
  content?: string;
}

// Status chips with improved styling
const getStatusChip = (status: string, theme: any) => {
  const statusConfig = {
    pending: {
      color: 'warning' as const,
      icon: <Schedule fontSize="small" />,
      label: 'Pending Review'
    },
    approved: {
      color: 'success' as const,
      icon: <CheckCircle fontSize="small" />,
      label: 'Approved'
    },
    rejected: {
      color: 'error' as const,
      icon: <Cancel fontSize="small" />,
      label: 'Rejected'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      variant="filled"
      sx={{
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: 'inherit'
        }
      }}
    />
  );
};

export default function BlogTable() {
  const theme = useTheme();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/blogs");
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

  const handleStatusUpdate = async (blogId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update blog status");

      // Update the local state
      setBlogs(prev => prev.map(blog => 
        blog._id === blogId ? { ...blog, status: newStatus } : blog
      ));
    } catch (err: any) {
      console.error("Error updating blog status:", err);
      setError(err.message || "Failed to update blog status");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {params.value}
          </Typography>
          {params.row.isFounderStory && (
            <Badge variant="founder" label="Founder Story" />
          )}
        </Box>
      ),
    },
    {
      field: "authorName",
      headerName: "Author",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.authorEmail}
          </Typography>
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          {/* Main Category */}
          <Chip
            label={params.row.category || 'Uncategorized'}
            color="primary"
            variant="filled"
            size="small"
            sx={{ mb: 0.5 }}
          />
          {/* Subcategories */}
          {params.row.subcategories && params.row.subcategories.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {params.row.subcategories.slice(0, 3).map((subcat: string, index: number) => (
                <Chip
                  key={index}
                  label={subcat}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              ))}
              {params.row.subcategories.length > 3 && (
                <Chip
                  label={`+${params.row.subcategories.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Stack>
          )}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => getStatusChip(params.value, theme),
    },
    {
      field: "createdAt",
      headerName: "Submitted",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Blog">
            <IconButton
              component={Link}
              href={`/blogs/${params.row.slug || params.row._id}`}
              size="small"
              color="primary"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          
          {params.row.status === 'pending' && (
            <>
              <Tooltip title="Approve Blog">
                <IconButton
                  onClick={() => handleStatusUpdate(params.row._id, 'approved')}
                  size="small"
                  color="success"
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Reject Blog">
                <IconButton
                  onClick={() => handleStatusUpdate(params.row._id, 'rejected')}
                  size="small"
                  color="error"
                >
                  <Cancel />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {params.row.status === 'rejected' && (
            <Tooltip title="Re-review Blog">
              <IconButton
                onClick={() => handleStatusUpdate(params.row._id, 'pending')}
                size="small"
                color="warning"
              >
                <Schedule />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

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
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={typographyVariants.sectionTitle} gutterBottom>
            Admin{" "}
            <Box component="span" sx={commonStyles.textGradient(theme)}>
              Blog Management
            </Box>
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Review and manage user blog submissions
          </Typography>
        </Box>

        {/* Stats Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {blogs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Submissions
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                {blogs.filter(b => b.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                {blogs.filter(b => b.status === 'approved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                ...getGlassStyles(theme),
                boxShadow: getShadow(theme, "elegant"),
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                {blogs.filter(b => b.status === 'rejected').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Blog Table */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <DataGrid
            rows={blogs}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight
            getRowId={(row) => row._id}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.paper,
                borderBottom: `2px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
}
