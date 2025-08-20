'use client';

import { Container, Box, Typography, Divider } from '@mui/material';
import { usePublicBlogFeed } from '@features/blog/hooks/usePublicBlogs';
import { BlogListItem } from '@features/blog/components/public/BlogListItem';
import { LatestBlogsSection } from '@features/blog/components/public/LatestBlogsSection';

export default function BlogsPage() {
  const { data, isLoading, error } = usePublicBlogFeed();

  if (isLoading) return <Box px={3} py={5}>Loading blogs...</Box>;
  if (error) return <Box px={3} py={5}>Error loading blogs.</Box>;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, sm: 8 } }}>
      <Box mb={6}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Blog Feed
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" maxWidth="sm">
          Discover featured, trending, and the latest blogs from our creative and technical community. Fresh perspectives published regularly.
        </Typography>
      </Box>

      <Section title="Featured Blogs" blogs={data.featured} />
      <Divider sx={{ my: { xs: 4, sm: 6 } }} />

      <Section title="Trending This Week" blogs={data.trending} />
      <Divider sx={{ my: { xs: 4, sm: 6 } }} />

      <LatestBlogsSection />

    </Container>
  );
}

function Section({ title, blogs }: { title: string; blogs: any[] }) {
  if (!blogs?.length) return null;

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
        {title}
      </Typography>

      <Box>
        {blogs.map((blog) => (
          <BlogListItem key={blog._id} blog={blog} />
        ))}
      </Box>
    </Box>
  );
}


  