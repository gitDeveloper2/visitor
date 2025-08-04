import { Box, Typography, Card, CardContent, CardHeader, Button, Chip, Divider, Stack } from "@mui/material";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles } from "@/utils/themeUtils";

const relatedPosts = [
  {
    title: "Understanding Zod Enums: A Complete Guide",
    excerpt: "Explore how to use Zod enums for type-safe validation in TypeScript.",
    category: "TypeScript",
    readTime: "8 min read",
    date: "2024-01-15",
    author: "Dev Team",
  },
  {
    title: "Prisma Self Relations: Advanced Database Modeling",
    excerpt: "Master self-referential relationships in Prisma with practical examples.",
    category: "Database",
    readTime: "12 min read",
    date: "2024-01-12",
    author: "Dev Team",
  },
  {
    title: "GitHub Actions Workflow Dispatch: Complete Tutorial",
    excerpt: "Learn how to trigger GitHub Actions workflows manually using workflow_dispatch.",
    category: "DevOps",
    readTime: "10 min read",
    date: "2024-01-10",
    author: "Dev Team",
  },
];

const BlogSidebar = () => {
  const theme = useTheme();

  return (
    <Box sx={{ position: "sticky", top: 100 }}>
      {/* Related Posts */}
      <Card sx={{ ...commonStyles.glassCard(theme), mb: 4 }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Related Posts
            </Typography>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={3}>
            {relatedPosts.map((post, index) => (
              <Box key={post.title}>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      bgcolor: `${theme.palette.primary.main}20`,
                      color: theme.palette.primary.main,
                      borderColor: `${theme.palette.primary.main}30`,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 1,
                      cursor: "pointer",
                      transition: "color 0.2s",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <User style={{ width: 12, height: 12 }} />
                      {post.author}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Calendar style={{ width: 12, height: 12 }} />
                      {new Date(post.date).toLocaleDateString()}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Clock style={{ width: 12, height: 12 }} />
                      {post.readTime}
                    </Box>
                  </Stack>
                </Box>
                {index < relatedPosts.length - 1 && (
                  <Divider sx={{ borderColor: theme.custom.glass.border }} />
                )}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card sx={{ ...commonStyles.glassCard(theme) }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
            Stay Updated
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Get the latest articles and tutorials delivered to your inbox.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            endIcon={<ArrowRight style={{ width: 16, height: 16 }} />}
            sx={{
              ...commonStyles.gradientButton(theme),
            }}
          >
            Subscribe
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogSidebar;