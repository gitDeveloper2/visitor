'use client';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { authClient } from '@/app/auth-client';

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (!isPending && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isPending, isAdmin, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleUpdate = async (email: string, updates: { role?: string; suspended?: boolean }) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...updates }),
    });
    fetchUsers();
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    fetchUsers();
  };

  if (isPending || !isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700} display="flex" alignItems="center" gap={1}>
          <ManageAccountsIcon /> User Management
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            size="small"
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="contained" onClick={fetchUsers}>Search</Button>
        </Box>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id || u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={u.role || 'user'}
                    onChange={(e) => handleUpdate(u.email, { role: String(e.target.value) })}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="moderator">Moderator</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {u.suspended ? (
                    <Chip color="error" size="small" label="Suspended" />
                  ) : (
                    <Chip color="success" size="small" label="Active" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color={u.suspended ? 'success' : 'error'}
                    onClick={() => handleUpdate(u.email, { suspended: !u.suspended })}
                    title={u.suspended ? 'Unsuspend' : 'Suspend'}
                  >
                    {u.suspended ? <CheckCircleIcon /> : <BlockIcon />}
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(u.email)} title="Delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">Total: {total}</Typography>
      </Box>
    </Box>
  );
}