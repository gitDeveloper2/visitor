"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedIcon from "@mui/icons-material/CheckCircleOutline";
import { Globe } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
// removed: import VoteButton from '@/features/tools/components/VoteButton';

// Optional small Markdown renderer (safe): use a lightweight renderer you sanitize server-side.
// Here we render plain text with paragraphs to avoid dangerous HTML.
function RenderDescription({ text }: { text: string }) {
  // If you store markdown server-side, convert to sanitized HTML there and pass safe HTML.
  // Here we split paragraphs to keep it simple and safe.
  return (
    <>
      {text.split(/\n{2,}/).map((p, i) => (
        <Typography key={i} variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
          {p}
        </Typography>
      ))}
    </>
  );
}

export default function AppClient({
  id,
  slug,
  name,
  tagline = "",
  fullDescription = "",
  features = [],
  gallery = [],
  tags = [],
  author = { name: "Unknown", avatarUrl: null, bio: "" },
  stats = { likes: 0, views: 0, installs: 0 },
  externalUrl = null,
  // Additional fields
  description = "",
  category = "",
  techStack = [],
  pricing = "",
  website = "",
  github = "",
  isVerified = false,
  verificationStatus,
  verificationScore,
  lastVerificationMethod,
}: {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  fullDescription?: string;
  features?: string[];
  gallery?: string[];
  tags?: string[];
  author?: { name: string; avatarUrl?: string | null; bio?: string };
  stats?: { likes?: number; views?: number; installs?: number };
  externalUrl?: string | null;
  // Additional fields
  description?: string;
  category?: string;
  techStack?: string[];
  pricing?: string;
  website?: string;
  github?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  verificationScore?: number;
  lastVerificationMethod?: string;
}) {
  const theme = useTheme();
  // const [liked, setLiked] = React.useState(false); // No longer needed, handled by VoteButton

  const surfaceBg =
    (typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--glass-bg")) ||
    (theme.palette.mode === "dark" ? "rgba(8,10,12,0.96)" : "rgba(255,255,255,0.96)");

  const surfaceBorder =
    (typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--glass-border")) ||
    `1px solid ${theme.palette.divider}`;

  const boxShadow = theme?.shadows?.[8] ?? "0 8px 30px rgba(2,6,23,0.08)";

  // Debug mode: show verification state when ?debug=1
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('debug') === '1') {
        // eslint-disable-next-line no-console
        console.log('[Launch Debug]', {
          isVerified,
          verificationStatus,
          verificationScore,
          lastVerificationMethod,
        });
      }
    }
  }, [isVerified, verificationStatus, verificationScore, lastVerificationMethod]);

  return (
    <Box component="main" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        {/* HERO */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 2,
            background: surfaceBg,
            border: surfaceBorder,
            boxShadow,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {name}
                  </Typography>
                  {tagline && (
                    <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                      {tagline}
                    </Typography>
                  )}
                  {/** Verified badge in hero */}
                  <Box sx={{ ml: 1 }}>
                    {isVerified && (
                      <Chip icon={<VerifiedIcon />} label="Verified" color="success" size="small" />
                    )}
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ pt: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={author.avatarUrl ?? undefined} alt={author.name} sx={{ width: 36, height: 36 }}>
                      {author.name?.charAt(0) ?? "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {author.name}
                      </Typography>
                      {author.bio && (
                        <Typography variant="caption" color="text.secondary">
                          {author.bio}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                    {externalUrl && (
                      <Button variant="contained" startIcon={<LaunchIcon />} component="a" href={externalUrl} target="_blank" rel="noopener">
                        Visit site
                      </Button>
                    )}

                    {/* Removed VoteButton from detail page */}

                    <Tooltip title="Share">
                      <IconButton aria-label="Share">
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                {/* tags */}
                {tags.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    {tags.map((t) => (
                      <Chip key={t} label={t} size="small" variant="outlined" />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Grid>

            {/* hero image / screenshot */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Box
                  sx={{
                    width: { xs: 160, md: 220 },
                    height: { xs: 120, md: 140 },
                    borderRadius: 2,
                    overflow: "hidden",
                    background: theme.palette.background.paper,
                    boxShadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {gallery[0] ? (
                    // next/image is optional; if you're not using Next image optimization, swap to <img>
                    <img src={gallery[0]} alt={`${name} cover`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Typography color="text.secondary">Preview</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* MAIN: two-column layout */}
        <Grid container spacing={3}>
          {/* Debug panel */}
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1' && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>Verification Debug</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Chip label={`isVerified: ${String(isVerified)}`} color={isVerified ? 'success' : 'default'} size="small" />
                  <Chip label={`status: ${verificationStatus ?? 'unknown'}`} size="small" />
                  <Chip label={`score: ${verificationScore ?? 0}`} size="small" />
                  {lastVerificationMethod && <Chip label={`method: ${lastVerificationMethod}`} size="small" />}
                </Stack>
              </Paper>
            </Grid>
          )}
          {/* Left: long-form content */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3, boxShadow }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  The story
                </Typography>
                {/* Makers should write a rich story here — it's the important high-value content */}
                {fullDescription ? (
                  <RenderDescription text={fullDescription} />
                ) : (
                  <Typography color="text.secondary">No long-form description provided yet.</Typography>
                )}
              </CardContent>
            </Card>

            {/* App Details & Features */}
            <Card sx={{ mb: 3, boxShadow }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  App Details & Features
                </Typography>
                
                {/* Category and Pricing */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  {category && (
                    <Chip 
                      label={category} 
                      color="primary" 
                      variant="outlined" 
                      size="small"
                    />
                  )}
                  {pricing && (
                    <Chip 
                      label={pricing} 
                      color={pricing === 'Free' ? 'success' : 'warning'} 
                      variant="outlined" 
                      size="small"
                    />
                  )}
                </Box>

                {/* Tech Stack */}
                {techStack.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Tech Stack
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {techStack.map((tech) => (
                        <Chip key={tech} label={tech} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}
                
                {/* External Links */}
                {(website || github) && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Links
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {website && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<Globe size={16} />} 
                          href={website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Website
                        </Button>
                      )}
                      {github && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<img src="/github-mark.svg" alt="GitHub" style={{ width: 16, height: 16 }} />} 
                          href={github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </Button>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Key Features
                    </Typography>
                    <Stack spacing={1}>
                      {features.map((feature, index) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          • {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            {gallery.length > 1 && (
              <Card sx={{ mb: 3, boxShadow }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {gallery.map((imgSrc, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 180,
                            borderRadius: 2,
                            overflow: "hidden",
                            background: theme.palette.background.paper,
                            boxShadow,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src={imgSrc} alt={`${name} screenshot ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Comments - Integrate your comment system here */}
            <Card sx={{ boxShadow }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Comments
                </Typography>
                <Typography color="text.secondary">
                  Your comment system goes here.
                </Typography>
                {/* Example: <CommentSection toolId={id} /> */}
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Social, etc. */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3, p: 2, boxShadow }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Quick stats
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={`❤ ${stats.likes ?? 0}`} size="small" />
                <Chip label={`👀 ${stats.views ?? 0}`} size="small" />
                <Chip label={`⬇️ ${stats.installs ?? 0}`} size="small" />
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* App Metadata */}
              <Box sx={{ mb: 2 }}>
                {category && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Category:</Typography>
                    <Typography variant="caption" fontWeight={600}>{category}</Typography>
                  </Box>
                )}
                {pricing && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Pricing:</Typography>
                    <Typography variant="caption" fontWeight={600}>{pricing}</Typography>
                  </Box>
                )}
                {techStack.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                      Tech Stack:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {techStack.slice(0, 3).map((tech, i) => (
                        <Chip key={i} label={tech} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 20 }} />
                      ))}
                      {techStack.length > 3 && (
                        <Chip label={`+${techStack.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 20 }} />
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                {externalUrl && (
                  <Button variant="contained" component="a" href={externalUrl} target="_blank" rel="noopener noreferrer" startIcon={<LaunchIcon />}>
                    Visit website
                  </Button>
                )}

                <Button variant="outlined" startIcon={<ShareIcon />}>
                  Share
                </Button>
              </Box>
            </Card>

            <Card sx={{ p: 2, boxShadow }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                About the maker
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={author.avatarUrl ?? undefined} alt={author.name} />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{author.name}</Typography>
                  {author.bio && <Typography variant="caption" color="text.secondary">{author.bio}</Typography>}
                </Box>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Typography variant="caption" color="text.secondary">
                Want to add more details? Makers can edit their app in the dashboard to include case studies, links, and long descriptions.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
