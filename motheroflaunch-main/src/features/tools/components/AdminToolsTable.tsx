'use client';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDeleteTool } from '@features/tools/hooks/useTools';

interface Tool {
  _id: string;
  name: string;
  tagline?: string;
  votes: number;
  createdAt: string;
  status: 'launched' | 'upcoming';
}

export default function AdminToolsTable({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const { mutateAsync: deleteTool } = useDeleteTool();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this tool?');
    if (!confirmed) return;
    try {
      await deleteTool(id);
    } catch (err) {
      alert('Could not delete. Please try again.');
      console.error(err);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/tools/new?toolId=${id}`);
  };

  if (!tools.length) {
    return (
      <Typography align="center" sx={{ mt: 3 }} color="text.secondary">
        No tools found.
      </Typography>
    );
  }

  return (
    <Box mt={3} overflow="auto">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Tagline</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Votes</strong></TableCell>
            <TableCell><strong>Created</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool._id}>
              <TableCell>{tool.name}</TableCell>
              <TableCell>{tool.tagline}</TableCell>
              <TableCell>{tool.status}</TableCell>
              <TableCell>{tool.votes}</TableCell>
              <TableCell>{new Date(tool.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" onClick={() => handleEdit(tool._id)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(tool._id)}>
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
