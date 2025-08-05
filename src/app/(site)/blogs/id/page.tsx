"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Calendar, Clock, Github, Linkedin, ThumbsUp, Twitter } from "lucide-react";

import {
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../../utils/themeUtils";
const sampleContent = (
    <>
      <Typography paragraph>
        React has revolutionized frontend development by enabling developers to build
        scalable and maintainable applications efficiently. With its component-based architecture,
        it allows developers to break down complex user interfaces into smaller, reusable pieces.
      </Typography>
  
      <Typography paragraph>
        In this article, we'll explore modern architectural patterns and best practices that help
        you build scalable React applications ready for real-world demands.
      </Typography>
  
      <Typography variant="h3" gutterBottom>
        1. Component Composition
      </Typography>
      <Typography paragraph>
        Component composition involves building complex UI from simpler components, enabling
        modular and maintainable codebases.
      </Typography>
      <ul>
        <li>Encourages reusability of UI elements</li>
        <li>Makes testing individual parts easier</li>
        <li>Improves separation of concerns</li>
      </ul>
  
      <Typography variant="h3" gutterBottom>
        2. Using Hooks Effectively
      </Typography>
      <Typography paragraph>
        React hooks allow you to use state and side effects in functional components.
        Common hooks include <code>useState</code>, <code>useEffect</code>, and <code>useContext</code>.
        They help manage component lifecycle and logic more cleanly than classes.
      </Typography>
  
      <Typography paragraph>
        Here's an example of a custom hook for fetching data:
      </Typography>
  
      <Box
        component="pre"
        sx={{
          p: 2,
          backgroundColor: '#f4f4f4',
          borderRadius: 1,
          overflowX: 'auto',
          mb: 3,
        }}
      >
        <code>
          {`function useFetch(url) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
      fetch(url)
        .then((res) => res.json())
        .then(setData);
    }, [url]);
    return data;
  }`}
        </code>
      </Box>
  
      <Typography variant="h3" gutterBottom>
        3. State Management Patterns
      </Typography>
      <Typography paragraph>
        For larger applications, consider using global state management solutions like Redux,
        Zustand, or React Context API to share state between components effectively.
      </Typography>
      <Typography paragraph>
        Choose the solution based on your app’s complexity and scalability needs.
      </Typography>
  
      <Typography variant="h3" gutterBottom>
        4. Performance Optimization
      </Typography>
      <Typography paragraph>
        React offers several ways to optimize performance:
      </Typography>
      <ul>
        <li>Code splitting with React.lazy and Suspense</li>
        <li>Memoizing components with React.memo</li>
        <li>Using useCallback and useMemo to avoid unnecessary re-renders</li>
      </ul>
  
      <Typography paragraph>
        These techniques help keep your app responsive and improve user experience.
      </Typography>
  
      <Typography variant="h3" gutterBottom>
        Conclusion
      </Typography>
      <Typography paragraph>
        By leveraging component composition, hooks, effective state management, and performance
        optimization, you can build React applications that scale gracefully and remain maintainable
        as they grow.
      </Typography>
      <Typography paragraph>
        Keep exploring the React ecosystem to discover new tools and patterns that fit your project's
        needs.
      </Typography>
    </>
  );

const authorBioText = `Sarah Chen is a Senior Frontend Engineer with over 8 years of experience
specializing in building scalable and maintainable React applications. She enjoys sharing
knowledge and exploring new frontend architecture patterns.`;
type SocialHandles = {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  
  type BlogArticleProps = {
    author: string;
    role: string;
    authorBio?: string;
    socialHandles?: SocialHandles;  // new prop
    title: string;
    date: string;
    readTime: string;
    views: number;
    likes: number;
    tags: string[];
    content: React.ReactNode;
  };

export default function BlogPageWrapper() {
    return (
        <BlogArticlePage
        author="Sarah Chen"
        role="Senior Frontend Engineer"
        authorBio={authorBioText}
        socialHandles={{
          twitter: "sarah_chen",
          linkedin: "sarah-chen",
          github: "sarahchen"
        }}
        title="Building Scalable React Apps"
        date="August 5, 2025"
        readTime="8 min read"
        views={1500}
        likes={300}
        tags={["React", "Frontend", "Architecture"]}
        content={sampleContent}
      />
      
    );
}

 function BlogArticlePage({
    author,
    role,
    authorBio,
    socialHandles,
    title,
    date,
    readTime,
    views,
    likes,
    tags,
    content,
}: BlogArticleProps) {
  const theme = useTheme();

  return (
    <Box component="main" sx={{ bgcolor: theme.palette.background.default, py: 10 }}>
      <Container maxWidth="md">
        {/* Article Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h2" sx={typographyVariants.sectionTitle}>
            {title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 1,
            }}
          >
            <Avatar alt={author} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {author}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {role}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 2,
              color: "text.secondary",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={16} />
              <Typography variant="caption">{date}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={16} />
              <Typography variant="caption">{readTime}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={16} />
              <Typography variant="caption">{likes}</Typography>
            </Box>
          </Box>
          {/* Tags */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
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
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Article Content */}
        <Box
          sx={{
            typography: "body1",
            color: theme.palette.text.primary,
            lineHeight: 1.7,
            "& p": { mb: 2 },
            "& h2, & h3": { mt: 4, mb: 2 },
            "& ul": { pl: 4, mb: 2 },
          }}
        >
          {content}
        </Box>

        {/* Author Bio */}
        {authorBio && (
          <Box
            component="section"
            aria-label={`About the author ${author}`}
            sx={{
              mt: 8,
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              boxShadow: getShadow(theme, "elegant"),
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <Avatar
              alt={author}
              sx={{ width: 64, height: 64, flexShrink: 0 }}
            >
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Avatar>
            <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                {author}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {role}
              </Typography>
              <Divider sx={{ mb: 1, mx: { xs: "auto", sm: 0 }, maxWidth: 200 }} />
              <Typography variant="body2" color="text.primary" sx={{ maxWidth: 600, mx: "auto", mx: { sm: 0 } }}>
                {authorBio}
              </Typography>

              {/* Social Handles */}
              {socialHandles && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: { xs: "center", sm: "flex-start" },
                    gap: 2,
                  }}
                >
                  {socialHandles.twitter && (
                    <Button
                      component="a"
                      href={`https://twitter.com/${socialHandles.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      size="small"
                      sx={{ minWidth: 0, p: 1,color: theme.palette.common.white }}
                    >
                      <Twitter size={20} />
                    </Button>
                  )}
                  {socialHandles.linkedin && (
                    <Button
                      component="a"
                      href={`https://linkedin.com/in/${socialHandles.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      size="small"
                      sx={{ minWidth: 0, p: 1,color: theme.palette.common.white }}
                    >
                      <Linkedin size={20} />
                    </Button>
                  )}
                  {socialHandles.github && (
                    <Button
                      component="a"
                      href={`https://github.com/${socialHandles.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      size="small"
                      sx={{ color: theme.palette.common.white,minWidth: 0, p: 1 }}
                    >
                      <Github size={20} />
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}


        {/* Back to Blog List Button */}
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Button variant="outlined" href="/blog" size="large">
            Back to Blog List
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Example usage (replace with your actual data when rendering):


