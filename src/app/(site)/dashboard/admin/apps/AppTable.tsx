"use client";

import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// Dummy data — replace this with actual data later
const rows = [
  {
    id: 1,
    name: "My Cool App",
    url: "https://coolapp.com",
    status: "pending",
    submitter: "johndoe@example.com",
    date: "2025-08-01",
  },
  {
    id: 2,
    name: "ProductiveTool",
    url: "https://productive.io",
    status: "approved",
    submitter: "alice@example.com",
    date: "2025-07-30",
  },
  {
    id: 3,
    name: "Time Tracker",
    url: "https://track.io",
    status: "rejected",
    submitter: "bob@example.com",
    date: "2025-07-29",
  },
];

// Helper to display status chip
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

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "App Name",
    flex: 1,
    renderCell: (params) => (
      <Stack>
        <Typography fontWeight={600}>{params.row.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {params.row.url}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => getStatusChip(params.row.status),
  },
  {
    field: "submitter",
    headerName: "Submitter",
    width: 220,
  },
  {
    field: "date",
    headerName: "Submitted On",
    width: 140,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 220,
    sortable: false,
    renderCell: (params) => {
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" color="success">
            Approve
          </Button>
          <Button size="small" variant="outlined" color="error">
            Reject
          </Button>
        </Stack>
      );
    },
  },
];

export default function AppTable() {
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
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
