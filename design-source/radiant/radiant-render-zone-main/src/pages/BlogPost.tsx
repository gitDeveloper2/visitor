import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSidebar from "@/components/BlogSidebar";
import TableOfContents from "@/components/TableOfContents";
import DonateButton from "@/components/DonateButton";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  Stack,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import { ArrowLeft, Share2, Bookmark, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();
  
  // Sample blog posts data (in a real app, this would come from an API/database)
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2024",
      content: `
        <p>The web development landscape is constantly evolving, and 2024 promises to bring exciting new trends and technologies that will shape how we build digital experiences. As we stand at the forefront of technological innovation, it's crucial to understand the emerging patterns that will define the next era of web development.</p>

        <h2>AI Integration: The Game Changer</h2>
        <p>Artificial Intelligence is no longer a buzzword—it's becoming an integral part of web development. From AI-powered code completion tools like GitHub Copilot to intelligent chatbots and personalized user experiences, AI is transforming how we approach development.</p>

        <p>Modern frameworks are beginning to incorporate AI capabilities natively, allowing developers to create more intuitive and responsive applications. Machine learning models are being integrated directly into web applications, enabling real-time data analysis and predictive user interfaces.</p>

        <h2>The Rise of Edge Computing</h2>
        <p>Edge computing is revolutionizing web performance by bringing computation closer to users. This trend is particularly important for applications that require low latency and real-time processing.</p>

        <p>Technologies like Cloudflare Workers, Vercel Edge Functions, and AWS Lambda@Edge are making it easier than ever to deploy code at the edge, resulting in faster load times and improved user experiences globally.</p>

        <h2>WebAssembly (WASM) Mainstream Adoption</h2>
        <p>WebAssembly is finally reaching mainstream adoption, enabling developers to run high-performance applications in the browser. This technology opens up new possibilities for web applications, including:</p>
        
        <ul>
          <li>Complex data visualization and scientific computing</li>
          <li>Real-time image and video processing</li>
          <li>Gaming and interactive 3D experiences</li>
          <li>Legacy code migration to the web</li>
        </ul>

        <h2>Progressive Web Apps (PWAs) Evolution</h2>
        <p>PWAs continue to evolve, bridging the gap between web and native applications. With improved offline capabilities, better performance, and enhanced device integration, PWAs are becoming a preferred choice for many businesses.</p>

        <p>The introduction of new APIs like the File System Access API, Web Bluetooth, and WebHID is expanding what's possible with web applications, making them more competitive with native apps.</p>

        <h2>Conclusion</h2>
        <p>The future of web development is bright and full of possibilities. By staying informed about these trends and continuously learning new technologies, developers can create more powerful, efficient, and user-friendly web applications.</p>

        <p>As we move forward, the key is to embrace these changes while maintaining focus on core principles: performance, accessibility, and user experience. The technologies may evolve, but these fundamentals remain constant.</p>
      `,
      excerpt: "Explore the latest trends shaping the web development landscape, from AI integration to new frameworks.",
      category: "Web Development",
      readTime: "8 min read",
      date: "Dec 15, 2023",
      author: {
        name: "Alex Johnson",
        bio: "Senior Full-Stack Developer with 8+ years of experience in modern web technologies. Passionate about creating efficient, scalable solutions.",
        avatar: "/placeholder.svg",
        role: "Senior Developer"
      },
      image: "/placeholder.svg",
      trending: true,
      tags: ["Web Development", "AI", "Edge Computing", "WebAssembly", "PWA", "Frontend", "Technology Trends"]
    },
    {
      id: 2,
      title: "Building Scalable APIs with Node.js and Express",
      content: `
        <p>Building scalable APIs is crucial for modern web applications. As your application grows, your API needs to handle increased traffic, maintain performance, and ensure reliability. In this comprehensive guide, we'll explore best practices for creating robust and scalable APIs using Node.js and Express.</p>

        <h2>Architecture Patterns for Scalability</h2>
        <p>When designing scalable APIs, choosing the right architecture pattern is fundamental. Here are some proven approaches:</p>

        <h3>Microservices Architecture</h3>
        <p>Breaking down your API into smaller, independent services allows for better scalability and maintainability. Each microservice can be developed, deployed, and scaled independently.</p>

        <h3>Layered Architecture</h3>
        <p>Organizing your code into distinct layers (controller, service, repository) promotes separation of concerns and makes your codebase more maintainable and testable.</p>

        <h2>Performance Optimization Techniques</h2>
        <p>Performance is critical for scalable APIs. Here are key optimization strategies:</p>

        <ul>
          <li><strong>Caching:</strong> Implement multiple layers of caching (Redis, in-memory, CDN)</li>
          <li><strong>Database Optimization:</strong> Use indexes, query optimization, and connection pooling</li>
          <li><strong>Compression:</strong> Enable gzip compression for responses</li>
          <li><strong>Rate Limiting:</strong> Protect your API from abuse and ensure fair usage</li>
        </ul>

        <h2>Error Handling and Monitoring</h2>
        <p>Robust error handling and comprehensive monitoring are essential for production APIs:</p>

        <h3>Structured Error Responses</h3>
        <p>Implement consistent error response formats with proper HTTP status codes. This helps clients handle errors gracefully and aids in debugging.</p>

        <h3>Logging and Monitoring</h3>
        <p>Use tools like Winston for logging and implement health checks. Monitor key metrics like response time, error rates, and throughput.</p>

        <h2>Security Best Practices</h2>
        <p>Security should never be an afterthought. Implement these security measures:</p>

        <ul>
          <li>Input validation and sanitization</li>
          <li>Authentication and authorization (JWT, OAuth)</li>
          <li>HTTPS enforcement</li>
          <li>CORS configuration</li>
          <li>SQL injection prevention</li>
        </ul>

        <h2>Testing Strategies</h2>
        <p>Comprehensive testing ensures your API remains reliable as it scales:</p>

        <ul>
          <li><strong>Unit Tests:</strong> Test individual functions and modules</li>
          <li><strong>Integration Tests:</strong> Test API endpoints and database interactions</li>
          <li><strong>Load Testing:</strong> Verify performance under expected traffic</li>
          <li><strong>Contract Testing:</strong> Ensure API contracts remain stable</li>
        </ul>

        <h2>Deployment and DevOps</h2>
        <p>Scalable deployment strategies are crucial for maintaining uptime and handling traffic spikes:</p>

        <h3>Containerization</h3>
        <p>Use Docker containers for consistent deployments across environments. This enables easier scaling and maintenance.</p>

        <h3>Load Balancing</h3>
        <p>Implement load balancing to distribute traffic across multiple instances of your API.</p>

        <h2>Conclusion</h2>
        <p>Building scalable APIs requires careful planning, proper architecture, and adherence to best practices. By following these guidelines and continuously monitoring and optimizing your API, you can create robust systems that grow with your business needs.</p>

        <p>Remember that scalability is not just about handling more requests—it's about maintaining performance, reliability, and maintainability as your system grows.</p>
      `,
      excerpt: "Learn best practices for creating robust and scalable APIs that can handle millions of requests.",
      category: "Backend",
      readTime: "12 min read",
      date: "Dec 12, 2023",
      author: {
        name: "Sarah Chen",
        bio: "Backend Architecture Specialist with expertise in Node.js, microservices, and cloud infrastructure. Loves solving complex scalability challenges.",
        avatar: "/placeholder.svg",
        role: "Backend Architect"
      },
      image: "/placeholder.svg",
      trending: true,
      tags: ["Node.js", "Express", "API", "Backend", "Scalability", "Performance", "Architecture"]
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to Use Which",
      content: `
        <p>CSS Grid and Flexbox are two powerful layout systems that have revolutionized how we approach web design. While both can create responsive layouts, they excel in different scenarios. Understanding when to use each one will make you a more effective developer and help you create better user interfaces.</p>

        <h2>Understanding CSS Grid</h2>
        <p>CSS Grid is a two-dimensional layout system that allows you to work with both rows and columns simultaneously. It's perfect for creating complex layouts with precise control over element positioning.</p>

        <h3>When to Use CSS Grid</h3>
        <ul>
          <li><strong>Complex Layouts:</strong> When you need to create sophisticated page layouts with multiple rows and columns</li>
          <li><strong>Precise Positioning:</strong> When you need exact control over where elements are placed</li>
          <li><strong>Overlapping Elements:</strong> When elements need to overlap or layer on top of each other</li>
          <li><strong>Different Sized Items:</strong> When grid items have varying sizes and need to fit together like a puzzle</li>
        </ul>

        <h2>Understanding Flexbox</h2>
        <p>Flexbox is a one-dimensional layout method that works either in a row or column direction. It's excellent for distributing space and aligning items within a container.</p>

        <h3>When to Use Flexbox</h3>
        <ul>
          <li><strong>Component Layouts:</strong> For laying out items within a component</li>
          <li><strong>Navigation Bars:</strong> For horizontal or vertical navigation menus</li>
          <li><strong>Content Alignment:</strong> When you need to center content or distribute items evenly</li>
          <li><strong>Dynamic Content:</strong> When content size varies and you need flexible spacing</li>
        </ul>

        <h2>Practical Examples</h2>

        <h3>CSS Grid Example: Card Layout</h3>
        <p>CSS Grid excels at creating card-based layouts where items can span different numbers of rows and columns:</p>

        <pre><code>.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.featured-card {
  grid-column: span 2;
  grid-row: span 2;
}</code></pre>

        <h3>Flexbox Example: Navigation Bar</h3>
        <p>Flexbox is perfect for creating responsive navigation bars:</p>

        <pre><code>.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}</code></pre>

        <h2>Combining Grid and Flexbox</h2>
        <p>The real power comes from using Grid and Flexbox together. Use Grid for the overall page layout and Flexbox for component-level layouts:</p>

        <pre><code>.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}</code></pre>

        <h2>Performance Considerations</h2>
        <p>Both Grid and Flexbox are highly optimized by modern browsers. However, there are some performance considerations:</p>

        <ul>
          <li>Grid calculations can be more complex for very large layouts</li>
          <li>Flexbox can cause performance issues with deeply nested containers</li>
          <li>Use the simplest solution that meets your needs</li>
        </ul>

        <h2>Browser Support and Fallbacks</h2>
        <p>Both CSS Grid and Flexbox have excellent browser support in modern browsers. For older browsers, you can provide fallbacks:</p>

        <pre><code>/* Fallback for older browsers */
.container {
  display: table;
}

/* Modern browsers */
@supports (display: grid) {
  .container {
    display: grid;
  }
}</code></pre>

        <h2>Best Practices</h2>
        <ul>
          <li>Start with Flexbox for simple layouts, use Grid when you need two-dimensional control</li>
          <li>Use Grid for page-level layouts, Flexbox for component layouts</li>
          <li>Don't be afraid to mix both in the same project</li>
          <li>Test across different screen sizes and devices</li>
          <li>Use logical properties for better internationalization support</li>
        </ul>

        <h2>Conclusion</h2>
        <p>CSS Grid and Flexbox are complementary technologies that solve different layout challenges. Grid excels at two-dimensional layouts with precise control, while Flexbox is perfect for one-dimensional layouts with flexible spacing and alignment.</p>

        <p>The key is understanding the strengths of each and choosing the right tool for the job. As you practice with both, you'll develop an intuition for when to use which approach, leading to cleaner, more maintainable CSS and better user experiences.</p>
      `,
      excerpt: "A comprehensive guide to understanding the differences and use cases for CSS Grid and Flexbox.",
      category: "CSS",
      readTime: "6 min read",
      date: "Dec 10, 2023",
      author: {
        name: "Michael Brown",
        bio: "Frontend Developer and CSS enthusiast. Specializes in modern layout techniques and responsive design patterns.",
        avatar: "/placeholder.svg",
        role: "Frontend Developer"
      },
      image: "/placeholder.svg",
      tags: ["CSS", "Grid", "Flexbox", "Layout", "Frontend", "Responsive Design", "Web Design"]
    }
  ];

  const post = blogPosts.find(p => p.id === parseInt(id || ""));
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: p.title,
      readTime: p.readTime,
      trending: p.trending
    }));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <DonateButton />
      
      <Box component="main" sx={{ pt: 12 }}>
        {/* Article Header */}
        <Box
          component="section"
          sx={{
            py: 6,
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
              opacity: 0.2,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, maxWidth: "xl" }}>
            <Box sx={{ maxWidth: "lg", mx: "auto" }}>
              <Button
                variant="text"
                size="small"
                component={Link}
                to="/blog"
                startIcon={<ArrowLeft style={{ width: 16, height: 16 }} />}
                sx={{ mb: 3 }}
              >
                Back to Blog
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
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
                  {post.trending && (
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

                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    lineHeight: 1.2,
                    fontSize: { xs: "2.5rem", md: "3.75rem" }
                  }}
                >
                  {post.title}
                </Typography>

                {/* Tags */}
                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      size="small"
                      sx={{
                        bgcolor: "hsl(var(--primary) / 0.05)",
                        borderColor: "hsl(var(--primary) / 0.2)",
                        "&:hover": {
                          bgcolor: "hsl(var(--primary) / 0.1)",
                        },
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                    />
                  ))}
                </Stack>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                  <Stack direction="row" spacing={2} sx={{ color: "text.secondary" }}>
                    <Typography variant="body2">By {post.author.name}</Typography>
                    <Typography variant="body2">•</Typography>
                    <Typography variant="body2">{post.date}</Typography>
                    <Typography variant="body2">•</Typography>
                    <Typography variant="body2">{post.readTime}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" startIcon={<Share2 style={{ width: 16, height: 16 }} />}>
                      Share
                    </Button>
                    <Button variant="outlined" size="small" startIcon={<Bookmark style={{ width: 16, height: 16 }} />}>
                      Save
                    </Button>
                  </Stack>
                </Box>

                <Box
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{
                    width: "100%",
                    height: { xs: 256, md: 384 },
                    objectFit: "cover",
                    borderRadius: 2,
                    boxShadow: "var(--shadow-elegant)",
                    mb: 4,
                  }}
                />
              </motion.div>
            </Box>
          </Container>
        </Box>

        {/* Article Content */}
        <Box component="section" sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: "xl", mx: "auto" }}>
              <Grid container spacing={6}>
                {/* Main Content */}
                <Grid size={{ xs: 12, lg: 9 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {/* Table of Contents */}
                    <TableOfContents content={post.content} />
                    
                    <Box component="article" sx={{ maxWidth: "none" }}>
                      <Box
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className="blog-content"
                      />
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Author Bio */}
                    <Paper
                      sx={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        backdropFilter: "blur(8px)",
                        p: 3,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" component="h3" sx={{ fontWeight: "semibold", mb: 2 }}>
                        About the Author
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Avatar
                          src={post.author.avatar}
                          alt={post.author.name}
                          sx={{
                            width: 64,
                            height: 64,
                            border: "2px solid hsl(var(--primary) / 0.2)",
                          }}
                        />
                        <Box>
                          <Typography variant="h6" component="h4" sx={{ fontWeight: "semibold" }}>
                            {post.author.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "primary.main", mb: 1 }}>
                            {post.author.role}
                          </Typography>
                          <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {post.author.bio}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>

                {/* Sidebar */}
                <Grid size={{ xs: 12, lg: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Box sx={{ position: "sticky", top: 96 }}>
                      <BlogSidebar relatedPosts={relatedPosts} />
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default BlogPost;