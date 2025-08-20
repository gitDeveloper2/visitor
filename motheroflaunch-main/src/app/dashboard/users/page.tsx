'use client';

import UserFilter from '@features/users/components/userFilter';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useRequireRole } from '@features/auth/components/useRequireRole';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  suspended?: boolean;
  avatarUrl?: string;
  createdAt: string;
};

type FetchUsersResult = {
  users: User[];
  nextCursor: string | null;
};

async function fetchUsers({ pageParam = '', searchQuery = '', roleFilter = 'all' }): Promise<FetchUsersResult> {
  const res = await fetch(`/api/admin/users?cursor=${pageParam}&limit=20&searchQuery=${searchQuery}&role=${roleFilter}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default function AdminUsersPage() {
  const { session, isPending, isAuthorized } = useRequireRole('admin');

  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | 'all'>('all');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

 


  const {
    data,
    status: userStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FetchUsersResult, Error, InfiniteData<FetchUsersResult>, ['admin-users', string, string], string>({
    queryKey: ['admin-users', debouncedSearchQuery, roleFilter],
    queryFn: ({ pageParam = '' }) => fetchUsers({ pageParam, searchQuery: debouncedSearchQuery, roleFilter }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
  });

  const mutateWithFetch = async (url: string, method: 'POST' | 'PATCH' | 'DELETE') => {
    const res = await fetch(url, { method });
    if (!res.ok) throw new Error(`Failed to ${method} ${url}`);
    return res.json();
  };

  const suspendMutation = useMutation({
    mutationFn: ({ userId, suspend }: { userId: string; suspend: boolean }) =>
      mutateWithFetch(`/api/admin/users/${userId}/${suspend ? 'suspend' : 'unsuspend'}`, 'PATCH'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const promoteMutation = useMutation({
    mutationFn: ({ userId, promote }: { userId: string; promote: boolean }) =>
      mutateWithFetch(`/api/admin/users/${userId}/${promote ? 'promote' : 'demote'}`, 'PATCH'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => mutateWithFetch(`/api/admin/users/${userId}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
  if (isPending) {
    return <CircularProgress />;
  }

  if (!isAuthorized) {
    return <Typography>You are not authorized.</Typography>;
  }

  return (
    <Box p={4} maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <UserFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
      {userStatus === 'pending' && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      {userStatus === 'error' && (
        <Typography color="error" my={4}>
          Error loading users.
        </Typography>
      )}
      {data?.pages.map((page) =>
        page.users.map((user) => (
          <Card key={user._id} sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={user.avatarUrl} />
                <Box>
                  <Typography variant="subtitle1">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label={user.role} color={user.role === 'admin' ? 'secondary' : 'default'} />
                    {user.suspended && <Chip label="Suspended" color="error" />}
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => suspendMutation.mutate({ userId: user._id, suspend: !user.suspended })}
                  disabled={suspendMutation.isPending}
                >
                  {user.suspended ? 'Unsuspend' : 'Suspend'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => promoteMutation.mutate({ userId: user._id, promote: user.role !== 'admin' })}
                  disabled={promoteMutation.isPending}
                >
                  {user.role === 'admin' ? 'Demote' : 'Promote'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteMutation.mutate(user._id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
      {hasNextPage && (
        <Box mt={4}>
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="contained"
            fullWidth
          >
            {isFetchingNextPage ? 'Loading more…' : 'Load more'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
