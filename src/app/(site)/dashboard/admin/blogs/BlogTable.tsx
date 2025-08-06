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

// Dummy blog data
const rows = [
  {
    id: 1,
    title: "Understanding React Context",
    status: "pending",
    author: "jane@example.com",
    date: "2025-08-01",
  },
  {
    id: 2,
    title: "Modern JavaScript Patterns",
    status: "approved",
    author: "john@example.com",
    date: "2025-07-30",
  },
  {
    id: 3,
    title: "CSS Tricks for Responsive Layouts",
    status: "rejected",
    author: "emma@example.com",
    date: "2025-07-29",
  },
];

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
    field: "author",
    headerName: "Author",
    width: 200,
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
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" color="success">
          Approve
        </Button>
        <Button size="small" variant="outlined" color="error">
          Reject
        </Button>
      </Stack>
    ),
  },
];

export default function BlogTable() {
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
