'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { authClient } from '../../../../auth-client';
import { useTools } from '@features/tools/hooks/useTools';
import AdminToolsTable from '@features/tools/components/AdminToolsTable';
import type { InfiniteData } from '@tanstack/react-query';

interface Tool {
  _id: string;
  name: string;
  tagline?: string;
  votes: number;
  createdAt: string;
  status: 'launched' | 'upcoming';
}

interface ApiResponse {
  success: boolean;
  data: Tool[];
  size: number;
  nextCursor: string | null;
  hasNextPage: boolean;
  error?: string;
}
export default function UserToolsDashboard() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const role = session?.user?.role === 'admin' ? 'admin' : 'user';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useTools(role);

 

  const tools =
    (data as InfiniteData<ApiResponse> | undefined)?.pages.flatMap((page) => page.data) ?? [];
  
  const launchedTools = tools.filter((t) => t.status === 'launched');
  const upcomingTools = tools.filter((t) => t.status === 'upcoming');

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          My Tools
        </Typography>
        <Button variant="contained" onClick={() => router.push('/dashboard/tools/new')}>
          + New Tool
        </Button>
      </Box>

      {isError && (
        <Typography color="error" gutterBottom>
          {error?.message || 'Something went wrong'}
        </Typography>
      )}

      {role === 'admin' ? (
        <AdminToolsTable tools={tools} />
      ) : (
        <>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Launched" />
            <Tab label="Upcoming" />
          </Tabs>

          {tab === 0 && <ToolsGrid tools={launchedTools} />}
          {tab === 1 && (
            <>
              {upcomingTools.length >= 3 && (
                <Typography color="warning.main" sx={{ mb: 2 }}>
                  You’ve reached the upcoming tool limit (3). Delete or launch one to add more.
                </Typography>
              )}
              <ToolsGrid tools={upcomingTools} showDraftActions />
            </>
          )}

          {isFetchingNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {!isFetchingNextPage && hasNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" onClick={() => fetchNextPage()}>
                Load More
              </Button>
            </Box>
          )}

          {!isLoading && tools.length === 0 && (
            <Typography align="center" sx={{ mt: 3 }} color="text.secondary">
              You have no tools yet.
            </Typography>
          )}
        </>
      )}
    </Container>
  );
}



function ToolsGrid({
  tools,
  showDraftActions = false,
}: {
  
  tools: Tool[];
  showDraftActions?: boolean;
}) {
  const router = useRouter(); // ⬅️ add this
  const [localTools, setLocalTools] = useState<Tool[]>(tools);

  useEffect(() => {
    setLocalTools(tools);
  }, [tools]);
  
  const handleEdit = (id: string) => {
    router.push(`/dashboard/tools/new?toolId=${id}`);
  };
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this tool?");
    if (!confirm) return;
  
    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Failed to delete');
  
      // Optimistically update UI
      setLocalTools((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Could not delete the tool. Please try again.');
      console.error(err);
    }
  };
  
  if (tools.length === 0) {
    return (
      <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
        No tools in this category.
      </Typography>
    );
  }

  // ✅ Handle single tool specially
  if (tools.length === 1) {
    const tool = tools[0];
    return (
      <Box display="flex" justifyContent="center">
        <Box maxWidth={400} width="100%">
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">{tool.name}</Typography>
                {tool.tagline && (
                  <Typography variant="body2" color="text.secondary">
                    {tool.tagline}
                  </Typography>
                )}
                <Typography variant="body2">
                  Votes: <strong>{tool.votes}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(tool.createdAt).toLocaleDateString()}
                </Typography>
                {showDraftActions && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                   <Button size="small" variant="outlined" onClick={() => handleEdit(tool._id)}>
  Edit
</Button>

<Button
  size="small"
  color="error"
  onClick={() => handleDelete(tool._id)} // ✅ add this
>
  Delete
</Button>

                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  // ✅ Normal multi-tool grid
  return (
    <Grid container spacing={3}>
    {localTools.map((tool) => (
      <Grid size={{xs:12,sm:6,md:4}} key={tool._id}>
        <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h6" fontWeight="bold">
                {tool.name}
              </Typography>
              {tool.tagline && (
                <Typography variant="body2" color="text.secondary">
                  {tool.tagline}
                </Typography>
              )}
              <Typography variant="body2">
                Votes: <strong>{tool.votes}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(tool.createdAt).toLocaleDateString()}
              </Typography>
  
              {showDraftActions && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => handleEdit(tool._id)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(tool._id)}>
                    Delete
                  </Button>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
  
  );
}

