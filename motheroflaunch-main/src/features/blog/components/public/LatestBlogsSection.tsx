import { usePaginatedLatestBlogs } from '@features/blog/hooks/usePublicBlogs';
import { LoadingButton } from '@mui/lab'; // Optional nice button
import { Box, Typography } from '@mui/material';
import { BlogListItem } from './BlogListItem';

export function LatestBlogsSection() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePaginatedLatestBlogs();

  if (isLoading) return <Typography>Loading latest blogs...</Typography>;
  if (error) return <Typography color="error">Error loading latest blogs</Typography>;
  if (!data) return null; // or a fallback

  const allBlogs = data.pages.flatMap((page) => page.blogs);

  return (
    <Box mb={6}>
      <Typography
        variant="overline"
        fontWeight={600}
        color="text.secondary"
        sx={{
          mb: 3,
          borderLeft: '4px solid #1976d2',
          pl: 1.5,
          lineHeight: 1.5,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontSize: 13,
        }}
      >
        Latest Blogs
      </Typography>

      <Box>
        {allBlogs.map((blog) => (
          <BlogListItem key={blog._id} blog={blog} />
        ))}
      </Box>

      {hasNextPage && (
        <Box textAlign="center" mt={3}>
          <LoadingButton
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
            variant="outlined"
          >
            Load More
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
}
