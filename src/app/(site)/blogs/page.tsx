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
    role: "Senior Software Engineer",
    title: "Zero-Trust Architecture for Modern Web Apps",
    excerpt: "Secure by design: How to implement zero-trust principles in your frontend and backend layers.",
    tags: ["Security", "Zero-Trust", "Backend"],
    date: "Aug 01, 2024",
    readTime: "5 min read",
    views: 1430,
    likes: 89,
  },
];
const founderStoriesMock = [
  {
    id: "fs-1",
    title: "How I built Snippet Saver — the tiny tool that saved our team's time",
    author: "Jane Doe",
    excerpt:
      "I started Snippet Saver after repeatedly losing useful code fragments between projects. In this story I walk through the early tradeoffs, the first 100 users, and how we designed the tagging model.",
    url: "https://janedoe.dev/founder-story-snippet-saver",
    domain: "janedoe.dev",
    date: "Mar 12, 2024",
    readTime: "6 min read",
    avatarUrl: "/images/authors/jane.png",
  },
  {
    id: "fs-2",
    title: "How I built Snippet Saver — the tiny tool that saved our team's time",
    author: "Jane Doe",
    excerpt:
      "I started Snippet Saver after repeatedly losing useful code fragments between projects. In this story I walk through the early tradeoffs, the first 100 users, and how we designed the tagging model.",
    url: "https://janedoe.dev/founder-story-snippet-saver",
    domain: "janedoe.dev",
    date: "Mar 12, 2024",
    readTime: "6 min read",
    avatarUrl: "/images/authors/jane.png",
  },
  // ... more stories
];


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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "text.secondary", mb: 3 }}>
          <Calendar size={16} />
          <Typography variant="caption">{date}</Typography>
          <Clock size={16} />
          <Typography variant="caption">{readTime}</Typography>
          <ThumbsUp size={16} />
          <Typography variant="caption">{likes}</Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            borderRadius: "999px",
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            ":hover": {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Read Article
        </Button>
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
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.paper,
        boxShadow: getShadow(theme, "elegant"),
      }}
    >
      {showBadge && (
        <Badge variant="founder" label="Founder Story" />
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, mt: 1 }}>
        <Avatar src={avatarUrl} alt={author} sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography variant="body2" fontWeight={600}>{author}</Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        {excerpt}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "text.secondary", mb: 3 }}>
        <Calendar size={16} />
        <Typography variant="caption">{date}</Typography>
        <Clock size={16} />
        <Typography variant="caption">{readTime}</Typography>
      </Box>

      <Button
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
}




export default function BlogMainPage() {
  const theme = useTheme();

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
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "text.secondary", mb: 3 }}>
      <Calendar size={16} />
      <Typography variant="caption">{date}</Typography>
      <Clock size={16} />
      <Typography variant="caption">{readTime}</Typography>
      {/* <Eye size={16} />
      <Typography variant="caption">{views}</Typography> */}
      <ThumbsUp size={16} />
      <Typography variant="caption">{likes}</Typography>
    </Box>
  );

  const renderBlogCard = (article: typeof articles[number]) => (
    <Paper
      key={article.id}
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
        <Avatar alt={article.author} sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography variant="body2" fontWeight={600}>{article.author}</Typography>
          <Typography variant="caption" color="text.secondary">{article.role}</Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
        {article.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        {article.excerpt}
      </Typography>

      {renderTags(article.tags)}
      {renderMetaInfo(article.date, article.readTime, article.views, article.likes)}

      <Button
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
        <Paper
          elevation={0}
          sx={{
            mb: 6,
            px: 2,
            py: 3,
            borderRadius: "1rem",
            ...getGlassStyles(theme),
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "center",
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <TextField
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 240 }}
          />
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              clickable
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
        </Paper>

        {/* Featured Article */}
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
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              {renderBlogCard(article)}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
