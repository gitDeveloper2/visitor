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

interface AppItem {
  _id: string;
  name: string;
  description: string;
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

export default function AppTable() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user-apps");
       
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        console.log(data)
        setApps(data.apps || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const handleStatusUpdate = async (appId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/user-apps/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update app status");

      // Update the local state
      setApps(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err: any) {
      console.error("Error updating app status:", err);
      setError(err.message || "Failed to update app status");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "App Name",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.row.name}</Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 300 
        }}>
          {params.row.description}
        </Typography>
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
      valueGetter: (value: string) => {
        if (!value) return '';
        return new Date(value).toLocaleDateString('en-US', {
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
        rows={apps}
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