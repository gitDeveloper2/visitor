'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useAdminBlogs, useBlogs } from '@features/blog/hooks/useBlogs';
import BlogTable from '@features/blog/components/BlogTable';
import { authClient } from '../../../../auth-client';

export default function AdminBlogsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
const{data:session}=authClient.useSession()
  const rawQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(rawQuery);
  const [debouncedQuery] = useDebounce(query, 400);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    router.push(`/dashboard/blogs?${params.toString()}`);
  }, [debouncedQuery, router]);

  const blogsQuery = useBlogs({ searchQuery: debouncedQuery,authorId:session?.user.id,});

  return (
    <div>
      
      <TextField
        label="Search blogs"
        variant="outlined"
        size="small"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <BlogTable {...blogsQuery} />
    </div>
  );
}
