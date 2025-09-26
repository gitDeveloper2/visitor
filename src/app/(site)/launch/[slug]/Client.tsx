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
    CardContent,
    Avatar,
    Divider,
    Grid,
    IconButton,
    Tooltip,
    Paper,
  } from "@mui/material";
  import LaunchIcon from "@mui/icons-material/Launch";
  import ShareIcon from "@mui/icons-material/Share";
  import VerifiedIcon from "@mui/icons-material/CheckCircleOutline";
  import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  import ChevronRightIcon from "@mui/icons-material/ChevronRight";
  import { useTheme } from "@mui/material/styles";

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

                <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 1, flexWrap: 'wrap' }}>
                  {externalUrl && (
                    <Button variant="contained" startIcon={<LaunchIcon />} component="a" href={externalUrl} target="_blank" rel="noopener">
                      Visit site
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

                  {/* Removed VoteButton from detail page */}

                  <Tooltip title="Share">
                    <IconButton aria-label="Share">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {/* tags + category/pricing */}
                {(tags.length > 0 || category || pricing) && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    {tags.map((t) => (
                      <Chip key={t} label={t} size="small" variant="outlined" />
                    ))}
                    {category && (
                      <Chip key="category" label={category} size="small" variant="outlined" color="primary" />
                    )}
                    {pricing && (
                      <Chip key="pricing" label={pricing} size="small" variant="outlined" color={pricing === 'Free' ? 'success' : 'warning'} />
                    )}
                  </Stack>
                )}
              </Stack>
            </Grid>

            {/* hero image / screenshot */}
            {gallery[0] && (
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
                    {/* next/image is optional; if you're not using Next image optimization, swap to <img> */}
                    <img src={gallery[0]} alt={`${name} cover`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* GALLERY CAROUSEL */}
        {gallery.length > 0 && (
          <Card sx={{ mb: 4, boxShadow }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Gallery
              </Typography>
              <Carousel images={gallery} name={name} boxShadow={boxShadow} />
            </CardContent>
          </Card>
        )}

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
                {features.length > 0 && (
                  <Box sx={{ mt: 3 }}>
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

            {/* App Details & Features card removed; details integrated into hero/tags/story */}

            {/* Gallery removed from here; moved to top as a carousel */}

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

              {/* Action buttons moved to hero to avoid duplication */}
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

// Lightweight Carousel Component (no external CSS dependencies)
function Carousel({ images, name, boxShadow }: { images: string[]; name: string; boxShadow: string }) {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);

  const hasMultiple = images.length > 1;
  const goPrev = React.useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const goNext = React.useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  // Basic swipe support for touch devices
  const startX = React.useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) goPrev(); else goNext();
    }
    startX.current = null;
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          height: { xs: 200, sm: 260, md: 360 },
          background: theme.palette.background.paper,
          boxShadow,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        {images.map((src, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              inset: 0,
              transition: 'opacity 300ms ease',
              opacity: i === index ? 1 : 0,
            }}
          >
            <img
              src={src}
              alt={`${name} screenshot ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </Box>
        ))}

        {/* Controls */}
        {hasMultiple && (
          <>
            <IconButton
              aria-label="Previous image"
              onClick={goPrev}
              sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.35)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
              size="small"
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              aria-label="Next image"
              onClick={goNext}
              sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.35)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
              size="small"
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Dots / Thumbnails */}
      {hasMultiple && (
        <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {images.map((src, i) => (
            <Box
              key={i}
              onClick={() => setIndex(i)}
              sx={{
                width: 56,
                height: 40,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                outline: i === index ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                opacity: i === index ? 1 : 0.7,
              }}
            >
              <img src={src} alt={`thumb ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
