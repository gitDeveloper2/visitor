import BlogViewer from '@features/blog/components/BlogViewer';
import { getBlogBySlug } from '@features/blog/services/blogService';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import "./blog.css"
import {
  Box,
  Chip,
  Container,
  Divider,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import { ISocialAccount } from '@features/users/schemas/Use';
import { Facebook, GitHub, Language, LinkedIn, Twitter } from '@mui/icons-material';
import { getSocialInfo } from '@features/blog/utils/getSocialInfo';
import { CommentsWithAuth } from '@features/comments/components/commentsWithAuth';
interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  
  let blog = await getBlogBySlug(slug);
  console.log(blog)

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold text-red-500">Blog not found</h1>
      </div>
    );
  }

  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
  const cleanHtml = DOMPurify.sanitize(blog.content as string);

  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      {/* Title */}
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        {blog.title}
      </Typography>

      {/* Author + Created At */}
    {/* Author Details */}




     

      {/* Featured badge */}
      {blog.featured && (
  <Box
    sx={{
      display: 'inline-block',
      px: 1.5,
      py: 0.5,
      mb: 2,
      borderRadius: 1,
      backgroundColor: 'secondary.light',
      color: 'white',
      fontWeight: 500,
      fontSize: '0.875rem',
    }}
  >
    🌟 Featured Post
  </Box>
)}


      {/* Blog Status */}
      <Stack direction="row" spacing={2} mb={1} flexWrap="wrap">
     
      
        {blog.suspended && (
          <Typography variant="body2" color="error.main">
            🚫 Suspended
          </Typography>
        )}
      </Stack>

      {/* Timestamps */}
      <Stack direction="column" spacing={0.5} mb={2}>
        {blog.updatedAt && (
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
          </Typography>
        )}
      </Stack>

      {/* Tags - on their own line */}
      {Array.isArray(blog.tags) && blog.tags.length > 0 && (

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          alignItems="center"
          mb={3}
        >
          {blog.tags.map((tag: string) => (
            <Chip key={tag} label={`#${tag}`} variant="outlined" size="small" />
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />
 {/* Optional Excerpt */}
 {blog.excerpt && (
  <Box
    sx={{
      backgroundColor: 'grey.100',
      borderLeft: '4px solid',
      borderColor: 'secondary.main',
      px: 2,
      py: 1.5,
      my: 2,
      borderRadius: 1,
    }}
  >
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
      📝 Summary
    </Typography>
    <Typography variant="body1" fontStyle="italic">
      {blog.excerpt}
    </Typography>
  </Box>
)}

      {/* Blog content */}
      <BlogViewer htmlContent={cleanHtml} />
      {/* About the Author */}
<Box
  sx={{
    mt: 6,
    px: { xs: 2, sm: 3 },
    py: { xs: 3, sm: 4 },
    borderRadius: 3,
    backgroundColor: 'grey.100',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    border: '1px solid',
    borderColor: 'grey.200',
  }}
>
  <Typography variant="h6" fontWeight={600} gutterBottom>
    👤 About the Author
  </Typography>

  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start">
    <Box
      component="img"
      src={blog.author.avatarUrl}
      alt={blog.author.name}
      sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: '2px solid',
        borderColor: 'primary.main',
      }}
    />

    <Box>
      <Typography variant="subtitle1" fontWeight={600}>
        {blog.author.name}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mt={0.5}>
        {blog.author.role && (
          <Chip
            size="small"
            label={blog.author.role === 'admin' ? '🛡️ Admin' : blog.author.role}
            color={blog.author.role === 'admin' ? 'error' : 'default'}
            variant="outlined"
          />
        )}
        {blog.createdAt && (
          <Typography variant="caption" color="text.secondary">
            Joined {new Date(blog.author.createdAt).toLocaleDateString()}
          </Typography>
        )}
      </Stack>

      {blog.author.bio && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {blog.author.bio}
        </Typography>
      )}

      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
        {blog.author.websiteUrl && (
          <Typography
            component="a"
            href={blog.author.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            color="primary.main"
            sx={{ textDecoration: 'none' }}
          >
            🌐 {new URL(blog.author.websiteUrl).hostname}
          </Typography>
        )}
        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
  {blog.author.socialAccounts?.map((acc: ISocialAccount, idx: number) => {
    const { href, Icon, label } = getSocialInfo(acc);
    return (
      href && (
        <Box
          key={idx}
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
            mr: 2,
          }}
        >
          <Icon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption">{label}</Typography>
        </Box>
      )
    );
  })}
</Stack>

      </Stack>
    </Box>
  </Stack>
</Box>
<CommentsWithAuth page={"blog"+blog.slug} />
    </Container>
  );
}



