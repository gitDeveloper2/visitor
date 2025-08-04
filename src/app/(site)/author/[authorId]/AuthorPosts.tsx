// components/AuthorPosts.tsx

import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";
import AuthorPostsCard from "./AuthorPostsCard";

interface AuthorPostsProps {
  posts: Post[];
  authorName: string;
}
// types.ts
export interface Post {
  slug: string;
  title: string;
  image:string;
  content:string;
 
}

const AuthorPosts: FC<AuthorPostsProps> = ({ posts, authorName }) => {
  return (
    <Box sx={{ paddingTop: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Posts by {authorName}
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.slug}>
            <AuthorPostsCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AuthorPosts;
