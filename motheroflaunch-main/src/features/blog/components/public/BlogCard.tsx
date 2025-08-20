import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

export function BlogCard({ blog }: { blog: any }) {
  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column' }}>
      {blog.coverImage?.url && (
        <CardMedia
          component="img"
          image={blog.coverImage.url}
          alt={blog.title}
          height="180"
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {blog.excerpt || blog.content?.slice(0, 120)}...
        </Typography>
        <Box mt={1} display="flex" gap={1}>
          <Typography variant="caption">@{blog.author?.name}</Typography>
          {blog.tool?.name && (
            <Typography variant="caption" color="primary">
              • {blog.tool.name}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
