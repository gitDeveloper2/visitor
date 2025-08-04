"use client";

import { Box, Card, CardContent, CardMedia, Typography, Divider, Link as MuiLink } from "@mui/material";
import { FC } from "react";
import { Facebook, Twitter, LinkedIn } from "@mui/icons-material";
import Link from "next/link"; // Next.js Link
import { Post } from "./AuthorPosts";

interface AuthorPostsCardProps {
  post: Post;
}

const AuthorPostsCard: FC<AuthorPostsCardProps> = ({ post }) => {
  const truncateText = (text: string, length: number) => {
    if (text.length > length) {
      return text.slice(0, length) + "...";
    }
    return text;
  };

  const handleShare = (platform: string, title: string, url: string) => {
    const message = encodeURIComponent(title);
    const shareUrl =
      platform === "twitter"
        ? `https://twitter.com/intent/tweet?text=${message}&url=${url}`
        : platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${url}`
        : platform === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : "";

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2, boxShadow: 3 }}>
      {post.image && (
        <CardMedia
          component="img"
          height="140"
          image={post.image}
          alt={post.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" component="h5" noWrap>
          {post.title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {truncateText(post.content, 150)}
        </Typography>
      </CardContent>

      <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}>
        <MuiLink
          component={Link}
          href={`https://basicutils.com${post.slug}`}
          underline="none"
          color="primary"
          sx={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          Read More
        </MuiLink>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MuiLink onClick={() => handleShare("twitter", post.title, window.location.href)}>
            <Twitter />
          </MuiLink>
          <MuiLink onClick={() => handleShare("facebook", post.title, window.location.href)}>
            <Facebook />
          </MuiLink>
          <MuiLink onClick={() => handleShare("linkedin", post.title, window.location.href)}>
            <LinkedIn />
          </MuiLink>
        </Box>
      </Box>
    </Card>
  );
};

export default AuthorPostsCard;
