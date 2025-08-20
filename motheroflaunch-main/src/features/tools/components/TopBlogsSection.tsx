import NextLink from "next/link"; // for full-card links
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Link,
} from "@mui/material";

export function TopBlogsSection({ blogs }: { blogs: any[] }) {
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Creator Stories
      </Typography>
      <Stack spacing={2}>
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            component={NextLink}
            href={`/blog/${blog.slug}`}
            underline="none"
            color="inherit"
            sx={{ display: 'block' }}
          >
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "action.hover",
                  cursor: "pointer",
                  transform: "scale(1.01)",
                },
              }}
            >
              <CardContent sx={{ padding: 2 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: "8px",
                    px: 1.2,
                    py: 0.4,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {blog.stats?.rating
                    ? `${blog.stats.rating.toFixed(1)}/10`
                    : "9.0/10"}
                </Box>

                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  mb={0.5}
                  sx={{ textDecoration: "underline" }}
                >
                  {blog.title}
                </Typography>

                {blog.excerpt && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {blog.excerpt.slice(0, 100)}
                    {blog.excerpt.length > 100 && "..."}
                  </Typography>
                )}

                <Stack direction="row" spacing={1.5} alignItems="center" mt={2}>
                  <Avatar
                    src={blog.author?.avatarUrl || ""}
                    alt={blog.author?.name || "Author"}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box>
                    <Typography variant="body2">
                      {blog.author?.name || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {blog.author?.company || ""}
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
