'use client';

import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Box, Typography
} from '@mui/material';
import ToolActionsMenu from './ToolActionsMenu';
import { useAdminTools } from './hooks';

interface ToolTableProps {
  searchQuery?: string;
  status?: string;
}

export default function ToolTable({ searchQuery, status }: ToolTableProps) {
  const [cursor, setCursor] = useState<string | null>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [refetchFlag, setRefetchFlag] = useState(0);
  const limit = 1;

  const { data, isLoading, isError, isFetching } = useAdminTools({
    cursor: cursor ?? undefined,
    limit,
    searchQuery,
    status,
    refetchFlag,
  });

  // Reset on filter/search changes
  useEffect(() => {
    setCursor(null);
    setTools([]);
  }, [searchQuery, status]);

  // Merge new tools into list
  useEffect(() => {
    if (data?.tools) {
      setTools((prev) =>
        cursor ? [...prev, ...data.tools] : [...data.tools]
      );
    }
  }, [data,cursor]);

  const handleLoadMore = () => {
    if (data?.nextCursor) setCursor(data.nextCursor);
  };

  const handleRefetch = () => {
    setCursor(null);         // Reset pagination
    setTools([]);            // Clear current list
    setRefetchFlag((f) => f + 1); // Trigger query reload
  };

  if (isLoading && tools.length === 0) return <Typography>Loading...</Typography>;
  if (isError) return <Typography color="error">Error loading tools.</Typography>;

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool._id}>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.status}</TableCell>
                <TableCell>{tool.isFeatured ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <ToolActionsMenu
                    toolId={tool._id}
                    status={tool.status}
                    isFeatured={tool.isFeatured}
                    onAction={handleRefetch}
                  />
                </TableCell>
              </TableRow>
            ))}
            {tools.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography>No tools found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {data?.nextCursor && (
        <Button
          onClick={handleLoadMore}
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isFetching}
        >
          {isFetching ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </Box>
  );
}
