'use client';

import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import BlogActionsMenu from './BlogActionsMenu';
import { useAdminBlogs } from '../hooks/useBlogs';

export default function BlogTable({
  data,
  fetchNextPage,
  hasNextPage,
  isFetching,
}: ReturnType<typeof useAdminBlogs>) {
  const blogs = data?.pages.flatMap((page) => page.items) ?? [];

  if (!blogs.length) {
    return (
      <Typography align="center" sx={{ mt: 3 }} color="text.secondary">
        No blogs found.
      </Typography>
    );
  }

  return (
    <Box mt={3} overflow="auto">
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.author?.name ?? '—'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {blog.suspended && (
                      <Chip label="Suspended" color="warning" size="small" />
                    )}
                    <Chip
                      label={
                        blog.status === 'published'
                          ? 'Published'
                          : blog.originalBlogId
                          ? 'Editing'
                          : 'Draft'
                      }
                      color={
                        blog.status === 'published'
                          ? 'success'
                          : blog.originalBlogId
                          ? 'info'
                          : 'default'
                      }
                      size="small"
                    />
                  </Stack>
                </TableCell>
                <TableCell>{new Date(blog.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <BlogActionsMenu blog={blog} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {hasNextPage && (
        <Box mt={2} display="flex" justifyContent="center">
          <Button onClick={() => fetchNextPage()} disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
