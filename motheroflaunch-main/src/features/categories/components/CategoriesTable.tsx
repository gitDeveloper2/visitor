  'use client';

  import {
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Box, Typography, Chip, Tooltip
  } from '@mui/material';
  import { Edit, Delete } from '@mui/icons-material';
  import { useState } from 'react';
  import { useCategories, useDeleteCategory } from '../hooks/useToolsByCategory';
  import { useRouter } from 'next/navigation';

  export default function CategoryTable() {
    const { data = [], isLoading } = useCategories();
    const deleteMutation = useDeleteCategory();
    const router = useRouter();
    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
      <Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  {cat.color ? (
                    <Chip
                      label={cat.color}
                      sx={{ backgroundColor: cat.color, color: '#fff' }}
                      size="small"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">None</Typography>
                  )}
                </TableCell>
                <TableCell>{cat.description || '-'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                  <IconButton onClick={() => router.push(`/dashboard/categories/create?id=${cat._id}`)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => deleteMutation.mutate(cat._id)}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

    
      </Box>
    );
  }
