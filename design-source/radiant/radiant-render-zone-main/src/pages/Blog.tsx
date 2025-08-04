import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonateButton from "@/components/DonateButton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Grid,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Calendar, Clock, User, TrendingUp, Search, Filter } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2024",
      excerpt: "Explore the latest trends shaping the web development landscape, from AI integration to new frameworks.",
      category: "Web Development",
      readTime: "8 min read",
      date: "Dec 15, 2023",
      author: "Alex Johnson",
      image: "/placeholder.svg",
      trending: true,
      featured: true
    },
    {
      id: 2,
      title: "Building Scalable APIs with Node.js and Express",
      excerpt: "Learn best practices for creating robust and scalable APIs that can handle millions of requests.",
      category: "Backend",
      readTime: "12 min read",
      date: "Dec 12, 2023",
      author: "Sarah Chen",
      image: "/placeholder.svg",
      trending: true
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to Use Which",
      excerpt: "A comprehensive guide to understanding the differences and use cases for CSS Grid and Flexbox.",
      category: "CSS",
      readTime: "6 min read",
      date: "Dec 10, 2023",
      author: "Michael Brown",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Introduction to TypeScript for JavaScript Developers",
      excerpt: "Make the transition from JavaScript to TypeScript with this beginner-friendly guide.",
      category: "TypeScript",
      readTime: "10 min read",
      date: "Dec 8, 2023",
      author: "Emma Davis",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Optimizing React Performance: Tips and Tricks",
      excerpt: "Discover proven techniques to make your React applications faster and more efficient.",
      category: "React",
      readTime: "9 min read",
      date: "Dec 5, 2023",
      author: "Alex Johnson",
      image: "/placeholder.svg",
      trending: true
    },
    {
      id: 6,
      title: "DevOps Best Practices for Small Teams",
      excerpt: "Implement DevOps practices effectively even with limited resources and team size.",
      category: "DevOps",
      readTime: "7 min read",
      date: "Dec 3, 2023",
      author: "Sarah Chen",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["All", "Web Development", "Backend", "Frontend", "CSS", "TypeScript", "React", "DevOps"];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <DonateButton />
      <Box component="main" sx={{ pt: 12 }}>
        {/* Hero Section */}
        <Box
          component="section"
          sx={{
            py: 10,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)",
              opacity: 0.3,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", maxWidth: "lg", margin: "0 auto" }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2.5rem", md: "3.75rem" }
                }}
              >
                Our Blog
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Insights, tutorials, and stories to help you{" "}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  simplify and inspire technology
                </Box>{" "}
                in your projects.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Search and Filter */}
        <Box component="section" sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ maxWidth: "lg", margin: "0 auto" }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }}>
                <TextField
                  placeholder="Search articles..."
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search style={{ width: 20, height: 20, color: "hsl(var(--muted-foreground))" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    backdropFilter: "blur(8px)",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--glass-border)",
                      },
                      "&:hover fieldset": {
                        borderColor: "hsl(var(--primary) / 0.5)",
                      },
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Filter style={{ width: 16, height: 16 }} />}
                  sx={{ minWidth: "fit-content" }}
                >
                  Filter
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === "All" ? "contained" : "outlined"}
                    size="small"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {category}
                  </Button>
                ))}
              </Stack>
            </motion.div>
          </Container>
        </Box>

        {/* Featured Post */}
        {featuredPost && (
          <Box component="section" sx={{ py: 4 }}>
            <Container maxWidth="lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ maxWidth: "xl", margin: "0 auto" }}
              >
                <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", mb: 3 }}>
                  Featured Article
                </Typography>
                <Card
                  sx={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    backdropFilter: "blur(8px)",
                    overflow: "hidden",
                    transition: "all 0.5s",
                    "&:hover": {
                      borderColor: "hsl(var(--primary) / 0.5)",
                      boxShadow: "var(--shadow-elegant)",
                    },
                  }}
                >
                  <Grid container>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        component="img"
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        sx={{
                          width: "100%",
                          height: { xs: 256, md: "100%" },
                          objectFit: "cover",
                          transition: "transform 0.5s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 4, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <Chip
                            label={featuredPost.category}
                            size="small"
                            sx={{
                              bgcolor: "hsl(var(--primary) / 0.2)",
                              color: "hsl(var(--primary))",
                              borderColor: "hsl(var(--primary) / 0.3)",
                            }}
                          />
                          {featuredPost.trending && (
                            <Chip
                              label="Trending"
                              size="small"
                              icon={<TrendingUp style={{ width: 12, height: 12 }} />}
                              sx={{
                                background: "var(--gradient-primary)",
                                color: "white",
                                border: "none",
                              }}
                            />
                          )}
                        </Stack>
                        <Link to={`/blog/${featuredPost.id}`} style={{ textDecoration: "none" }}>
                          <Typography
                            variant="h4"
                            component="h3"
                            sx={{
                              fontWeight: "bold",
                              mb: 2,
                              cursor: "pointer",
                              transition: "color 0.2s",
                              "&:hover": { color: "hsl(var(--primary))" },
                            }}
                          >
                            {featuredPost.title}
                          </Typography>
                        </Link>
                        <Typography
                          color="text.secondary"
                          sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                          {featuredPost.excerpt}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Stack direction="row" spacing={2} sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <User style={{ width: 16, height: 16 }} />
                              {featuredPost.author}
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Calendar style={{ width: 16, height: 16 }} />
                              {featuredPost.date}
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Clock style={{ width: 16, height: 16 }} />
                              {featuredPost.readTime}
                            </Box>
                          </Stack>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </motion.div>
            </Container>
          </Box>
        )}

        {/* Blog Grid */}
        <Box component="section" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: "xl", mx: "auto" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: "2rem" }}
              >
                <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
                  Latest Articles
                </Typography>
              </motion.div>

              <Grid container spacing={4}>
                {regularPosts.map((post, index) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          background: "var(--glass-bg)",
                          border: "1px solid var(--glass-border)",
                          backdropFilter: "blur(8px)",
                          overflow: "hidden",
                          transition: "all 0.5s",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover": {
                            borderColor: "hsl(var(--primary) / 0.5)",
                            boxShadow: "var(--shadow-elegant)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            src={post.image}
                            alt={post.title}
                            sx={{
                              width: "100%",
                              height: 192,
                              objectFit: "cover",
                              transition: "transform 0.5s",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                          {post.trending && (
                            <Chip
                              label="Trending"
                              size="small"
                              icon={<TrendingUp style={{ width: 12, height: 12 }} />}
                              sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                background: "hsl(var(--primary) / 0.9)",
                                color: "white",
                              }}
                            />
                          )}
                        </Box>
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1 }}>
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{
                                bgcolor: "hsl(var(--primary) / 0.2)",
                                color: "hsl(var(--primary))",
                                borderColor: "hsl(var(--primary) / 0.3)",
                              }}
                            />
                          </Stack>
                          <Link to={`/blog/${post.id}`} style={{ textDecoration: "none" }}>
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                fontWeight: "bold",
                                mb: 2,
                                cursor: "pointer",
                                transition: "color 0.2s",
                                "&:hover": { color: "hsl(var(--primary))" },
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {post.title}
                            </Typography>
                          </Link>
                          <Typography
                            color="text.secondary"
                            sx={{
                              mb: 3,
                              lineHeight: 1.6,
                              flex: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.excerpt}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 2, borderTop: "1px solid var(--glass-border)" }}>
                            <Stack direction="row" spacing={1} sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <User style={{ width: 12, height: 12 }} />
                                {post.author}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Clock style={{ width: 12, height: 12 }} />
                                {post.readTime}
                              </Box>
                            </Stack>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Load More */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: "center", marginTop: "3rem" }}
              >
                <Button variant="outlined" size="large">
                  Load More Articles
                </Button>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Blog;