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
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Status chips
const getStatusChip = (status: string) => {
  const colors = {
    pending: "warning",
    approved: "success",
    rejected: "error",
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={colors[status as keyof typeof colors] as any}
      variant="outlined"
      size="small"
    />
  );
};

export default function BlogTable() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
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

  const handleStatusUpdate = async (blogId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/user-blogs/${blogId}`, {
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
      headerName: "Blog Title",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.row.title}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => getStatusChip(params.row.status),
    },
    {
      field: "authorName",
      headerName: "Author",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Submitted On",
      width: 140,
      valueGetter: (params) => {
        return new Date(params.row.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.status === 'pending' && (
            <>
              <Button 
                size="small" 
                variant="outlined" 
                color="success"
                onClick={() => handleStatusUpdate(params.row._id, 'approved')}
              >
                Approve
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleStatusUpdate(params.row._id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
          {params.row.status === 'approved' && (
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={() => handleStatusUpdate(params.row._id, 'rejected')}
            >
              Reject
            </Button>
          )}
          {params.row.status === 'rejected' && (
            <Button 
              size="small" 
              variant="outlined" 
              color="success"
              onClick={() => handleStatusUpdate(params.row._id, 'approved')}
            >
              Approve
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={blogs}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={5}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.default",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
}
