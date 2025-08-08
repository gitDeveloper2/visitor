"use client";

import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
} from "lucide-react";
import Badge from "@components/badges/Badge";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getGlassStyles,
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../utils/themeUtils";

// --- Static Filters ---
const filters = [
  "All", "React", "Architecture", "Scalability", "AI",
  "Web Development", "Trends", "TypeScript", "Design Patterns",
  "Enterprise", "WebSockets", "Real-time", "Backend", "CSS", "Layout",
  "Zero-Trust", "Security"
];

// --- Featured Blog ---
const featuredArticles = [
  {
    id: "1",
    type: "blog",
    author: "Sarah Chen",
    role: "Senior Frontend Engineer",
    title: "Building Scalable React Applications with Modern Architecture Patterns",
    excerpt: "Explore the latest architectural patterns and best practices for building React applications that scale with your growing user base.",
    tags: ["React", "Architecture", "Scalability"],
    date: "Jan 15, 2024",
    readTime: "8 min read",
    views: 2400,
    likes: 156,
  },
  {
    id: "2",
    type: "founder",
    author: "Liam Patel",
    role: "Founder, DevFlow",
    title: "From Side Project to Startup: The DevFlow Journey",
    excerpt: "How I turned my weekend project into a thriving dev tool used by thousands of developers worldwide.",
    tags: ["Startup", "Founder", "SaaS"],
    date: "Feb 12, 2024",
    readTime: "6 min read",
    views: 1800,
    likes: 120,
  },
  {
    id: "3",
    type: "blog",
    author: "Nia Roberts",
    role: "UI/UX Designer",
    title: "Crafting Intuitive Interfaces for B2B Platforms",
    excerpt: "Design strategies that enhance usability and user satisfaction in business-focused applications.",
    tags: ["Design", "UX", "B2B"],
    date: "Mar 10, 2024",
    readTime: "7 min read",
    views: 1950,
    likes: 140,
  }
];

// --- Additional Blogs ---
const articles = [
  {
    id: 1,
    author: "James Okello",
    role: "AI Researcher",
    title: "How LLMs Are Shaping Enterprise Search",
    excerpt: "A breakdown of how large language models like GPT-4 are transforming how organizations retrieve and interact with internal knowledge.",
    tags: ["AI", "Enterprise", "LLMs"],
    date: "Jul 18, 2024",
    readTime: "7 min read",
    views: 870,
    likes: 62,
  },
  {
    id: 2,
    author: "Grace Njeri",
    role: "DevOps Engineer",
    title: "Zero-Trust Security in Modern Cloud Architecture",
    excerpt: "Implementing zero-trust principles across distributed cloud environments for enhanced security posture.",
    tags: ["Security", "Cloud", "Zero-Trust"],
    date: "Jul 15, 2024",
    readTime: "9 min read",
    views: 1200,
    likes: 89,
  },
  {
    id: 3,
    author: "Marcus Rodriguez",
    role: "Backend Developer",
    title: "Real-time Data Synchronization with WebSockets",
    excerpt: "Building responsive applications that maintain data consistency across multiple client connections.",
    tags: ["WebSockets", "Real-time", "Backend"],
    date: "Jul 12, 2024",
    readTime: "6 min read",
    views: 950,
    likes: 73,
  },
  {
    id: 4,
    author: "Elena Petrov",
    role: "Frontend Architect",
    title: "TypeScript Design Patterns for Large Applications",
    excerpt: "Advanced TypeScript patterns that help maintain code quality and developer experience at scale.",
    tags: ["TypeScript", "Design Patterns", "Frontend"],
    date: "Jul 10, 2024",
    readTime: "8 min read",
    views: 1100,
    likes: 95,
  },
  {
    id: 5,
    author: "David Kim",
    role: "CSS Specialist",
    title: "Modern CSS Layout Techniques",
    excerpt: "Exploring CSS Grid, Flexbox, and other modern layout techniques for responsive web design.",
    tags: ["CSS", "Layout", "Frontend"],
    date: "Jul 8, 2024",
    readTime: "5 min read",
    views: 800,
    likes: 58,
  },
  {
    id: 6,
    author: "Sophie Anderson",
    role: "Product Manager",
    title: "Trends in Developer Tooling for 2024",
    excerpt: "An overview of emerging tools and technologies that are reshaping the developer experience.",
    tags: ["Trends", "Developer Tools", "Productivity"],
    date: "Jul 5, 2024",
    readTime: "7 min read",
    views: 1300,
    likes: 112,
  }
];

// Founder stories mock data
const founderStoriesMock = [
  {
    id: "fs-1",
    author: "Alex Chen",
    title: "Building a Developer-First SaaS",
    excerpt: "How I built a tool that developers actually want to use, not just tolerate.",
    avatarUrl: "https://picsum.photos/200/200?random=1",
    date: "Jul 20, 2024",
    readTime: "5 min read",
  },
  {
    id: "fs-2",
    author: "Maria Santos",
    title: "From Freelancer to Product Owner",
    excerpt: "The journey from taking on client work to building products that serve thousands.",
    avatarUrl: "https://picsum.photos/200/200?random=2",
    date: "Jul 18, 2024",
    readTime: "6 min read",
  },
  {
    id: "fs-3",
    author: "Raj Patel",
    title: "Scaling a Bootstrapped Startup",
    excerpt: "How we grew from 0 to 10,000 users without external funding.",
    avatarUrl: "https://picsum.photos/200/200?random=3",
    date: "Jul 15, 2024",
    readTime: "7 min read",
  }
];

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface FeaturedBlogCardProps {
  author: string;
  role: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
  views?: number;
  likes: number;
}

function FeaturedBlogCard({
  author,
  role,
  title,
  excerpt,
  tags,
  date,
  readTime,
  views,
  likes,
}: FeaturedBlogCardProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: "1rem",
        overflow: "hidden",
        background: theme.palette.background.paper,
        boxShadow: getShadow(theme, "elegant"),
        display: "flex",
        flexDirection: "column",
      }}
    >
   <Box
  sx={{
    height: 200,
    backgroundImage: `url('https://picsum.photos/800/400')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
  }}
/>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Avatar alt={author} sx={{ width: 36, height: 36 }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>{author}</Typography>
            <Typography variant="caption" color="text.secondary">{role}</Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {excerpt}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={14} />
              {date}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={14} />
              {readTime}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {views && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Eye size={14} />
                {views}
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={14} />
              {likes}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

type FounderStoryCardProps = {
  author: string;
  title: string;
  excerpt: string;
  avatarUrl: string;
  date: string;
  readTime: string;
  showBadge?: boolean; // <- optional badge toggle
};

export function FounderStoryCard({
  author,
  title,
  excerpt,
  avatarUrl,
  date,
  readTime,
  showBadge = true, // <- default is true
}: FounderStoryCardProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: "1rem",
        overflow: "hidden",
        background: theme.palette.background.paper,
        boxShadow: getShadow(theme, "elegant"),
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            height: 160,
            backgroundImage: `url('${avatarUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {showBadge && (
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <Badge variant="founder" />
          </Box>
        )}
      </Box>

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, flex: 1 }}>
          {excerpt}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Avatar alt={author} sx={{ width: 24, height: 24 }} />
            <Typography variant="caption" fontWeight={600}>
              {author}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, color: "text.secondary", fontSize: "0.75rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={12} />
              {date}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={12} />
              {readTime}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default function BlogMainPage() {
  const theme = useTheme();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('approved', 'true');
        if (selectedFilter !== 'All') {
          params.append('tag', selectedFilter);
        }
        
        const res = await fetch(`/api/user-blogs?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [selectedFilter]);

  const renderTags = (tags: string[]) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        />
      ))}
    </Box>
  );

  const renderMetaInfo = (date: string, readTime: string, views: number, likes: number) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "text.secondary",
        fontSize: "0.75rem",
        mt: "auto",
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Calendar size={14} />
          {date}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Clock size={14} />
          {readTime}
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Eye size={14} />
          {views}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ThumbsUp size={14} />
          {likes}
        </Box>
      </Box>
    </Box>
  );

  const renderBlogCard = (blog: BlogPost) => {
    const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...';
    const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <Paper
        key={blog._id}
        sx={{
          borderRadius: "1rem",
          overflow: "hidden",
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: theme.palette.background.paper,
          boxShadow: getShadow(theme, "elegant"),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Avatar alt={blog.authorName} sx={{ width: 36, height: 36 }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>{blog.authorName}</Typography>
            <Typography variant="caption" color="text.secondary">Author</Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {excerpt}
        </Typography>

        {renderTags(blog.tags)}
        {renderMetaInfo(date, "5 min read", 0, 0)}

        <Button
          component={Link}
          href={`/blogs/${blog._id}`}
          variant="outlined"
          size="small"
          sx={{
            mt: "auto",
            borderRadius: "999px",
            alignSelf: "start",
          }}
        >
          Read
        </Button>
      </Paper>
    );
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="lg">
        {/* Hero */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" sx={typographyVariants.sectionTitle}>
            Tech{" "}
            <Box component="span" sx={commonStyles.textGradient}>
              Insights
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mt: 2,
              maxWidth: 720,
              mx: "auto",
            }}
          >
            Stay ahead with expert insights, tutorials, and thought leadership from industry professionals.
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filters.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onClick={() => setSelectedFilter(filter)}
                variant={selectedFilter === filter ? "filled" : "outlined"}
                sx={{
                  fontWeight: 500,
                  color: selectedFilter === filter ? "white" : theme.palette.text.primary,
                  backgroundColor: selectedFilter === filter ? theme.palette.primary.main : "transparent",
                  borderColor: theme.palette.divider,
                  "&:hover": {
                    backgroundColor: selectedFilter === filter ? theme.palette.primary.dark : theme.palette.action.hover,
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Featured Articles */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              Featured
            </Box>{" "}
            Articles
          </Typography>

          <Grid container spacing={3}>
    {featuredArticles.map((fa, i) => (
      <Grid item xs={12} md={6} key={i}>
        <FeaturedBlogCard {...fa} />
      </Grid>
    ))}
  </Grid>
          <Typography
  variant="subtitle2"
  sx={{
    fontWeight: 600,
    mt: 4,
    mb: 2,
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    fontSize: 13,
    letterSpacing: 1,
  }}
>
  Founder Stories
</Typography>

<Grid container spacing={3}>
    {founderStoriesMock.map((story) => (
      <Grid item xs={12} sm={6} md={4} key={story.id}>
        <FounderStoryCard {...story} />
      </Grid>
    ))}
  </Grid>
</Box>
<Box sx={{ mt: 6, mb: 3 }}>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 700,
      color: theme.palette.text.primary,
    }}
  >
    All Articles
  </Typography>
</Box>
        {/* Other Articles */}
        <Grid container spacing={4}>
          {filteredBlogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              {renderBlogCard(blog)}
            </Grid>
          ))}
        </Grid>

        {filteredBlogs.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No blogs found matching your criteria.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
