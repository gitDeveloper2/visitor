"use client";

import { Box, Typography, Button, Container, Paper, Alert } from "@mui/material";
import { useState } from "react";
import Link from "next/link";

export default function TestBlogEditPage() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testBlogEdit = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // First, create a test blog
      const createRes = await fetch("/api/user-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Blog for Editing",
          content: "<p>This is a test blog post to verify editing functionality.</p>",
          tags: ["test", "editing"],
          isInternal: false,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create test blog");
      }

      const createData = await createRes.json();
      const blogId = createData.blog._id;

      // Wait a moment for the database to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Now try to edit the blog
      const editRes = await fetch(`/api/user-blogs/${blogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Updated Test Blog",
          content: "<p>This blog has been successfully edited!</p>",
          tags: ["test", "editing", "updated"],
          isInternal: false,
        }),
      });

      if (!editRes.ok) {
        throw new Error("Failed to edit test blog");
      }

      setTestResult("✅ Blog editing functionality is working correctly!");
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Test Blog Editing Functionality
      </Typography>
      
      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          What this test does:
        </Typography>
        <Typography variant="body2" paragraph>
          1. Creates a test blog post
        </Typography>
        <Typography variant="body2" paragraph>
          2. Attempts to edit the blog post using the PATCH API
        </Typography>
        <Typography variant="body2" paragraph>
          3. Reports success or failure
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={testBlogEdit}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? "Testing..." : "Run Test"}
          </Button>
          
          <Button
            component={Link}
            href="/dashboard/blogs"
            variant="outlined"
          >
            Back to Blogs
          </Button>
        </Box>
      </Paper>

      {testResult && (
        <Alert severity={testResult.includes("✅") ? "success" : "error"} sx={{ mb: 3 }}>
          {testResult}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Blog Editing Features Implemented:
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
          <li>✅ PATCH API endpoint for editing blogs</li>
          <li>✅ User authentication and authorization</li>
          <li>✅ Edit page with 3-step form</li>
          <li>✅ Dashboard with edit buttons</li>
          <li>✅ Status-based editing restrictions</li>
          <li>✅ Proper error handling and validation</li>
        </Typography>
      </Paper>
    </Container>
  );
} 