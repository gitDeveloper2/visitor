// app/dashboard/categories/page.tsx
'use client';

import CategoryTable from '@features/categories/components/CategoriesTable';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AdminCategoryListPage() {
  const router = useRouter();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Manage Categories</Typography>
        <Button variant="contained" onClick={() => router.push('/dashboard/categories/create')}>
          + New Category
        </Button>
      </Box>

      <CategoryTable />
    </Box>
  );
}
