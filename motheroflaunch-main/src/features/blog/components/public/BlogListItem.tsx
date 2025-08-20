'use client';

import {
  Box,
  Typography,
  Avatar,
  Grid,
  Link as MuiLink,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import Link from 'next/link';
import { GitHub, Twitter, Language } from '@mui/icons-material';
import { getSocialInfo } from '@features/blog/utils/getSocialInfo';


function SocialIcon({ type }: { type: string }) {
  switch (type) {
    case 'github':
      return <GitHub fontSize="small" />;
    case 'twitter':
      return <Twitter fontSize="small" />;
    case 'website':
    case 'linkedin':
    case 'facebook':
    default:
      return <Language fontSize="small" />;
  }
}

export function BlogListItem({ blog }: { blog: any }) {
  const {
    title,
    slug,
    excerpt,
    createdAt,
    author,
    coverImage,
    tags,
    featured,
    paidFeature,
  } = blog;

  return (
<Box
  py={4}
  sx={{
    borderBottom: '1px solid #eee',
   
    mx: 'auto', // centers it
    px: 2,      // small padding on mobile
  }}
>

      <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: coverImage ? 9 : 12 }}>
      <Box>
      {(featured || paidFeature) && (
    <Stack direction="row" spacing={1} mt={0.5}>
      {featured && <Chip label="Featured" color="warning" size="small" />}
      {paidFeature && <Chip label="Sponsored" color="secondary" size="small" />}
    </Stack>
  )}
  <Link href={`/blog/${slug}`} passHref legacyBehavior>
    <MuiLink underline="hover" color="inherit">
      <Typography variant="h5" fontWeight={700}   sx={{ maxWidth: '600px', wordBreak: 'break-word' }}>
        {title}
      </Typography>
    </MuiLink>
  </Link>

 
</Box>


          <Typography variant="body2" color="text.secondary" mt={1}   sx={{ maxWidth: '600px', wordBreak: 'break-word' }}>
            {excerpt?.slice(0, 160)}...
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mt={2}>
            {author?.avatarUrl && (
              <Tooltip title={author.bio || ''}>
                <Avatar
                  src={author.avatarUrl}
                  alt={author.name}
                  sx={{ width: 28, height: 28 }}
                />
              </Tooltip>
            )}
            <Box>
              <Typography variant="caption" fontWeight={600}>
                {author?.name}
                {author?.pro && ' · 🟢 Pro'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {new Date(createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} ml={2}>
  {author?.socialAccounts?.map((account: any, idx: number) => {
    const { href, Icon, label } = getSocialInfo(account);
    return (
      <Tooltip key={idx} title={label}>
        <IconButton
  component="a"
  href={href || '#'}
  target="_blank"
  rel="noopener noreferrer"
  size="small"
>
  <Icon fontSize="small" />
</IconButton>

      </Tooltip>
    );
  })}
</Stack>
          </Box>

          {tags?.length > 0 && (
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
              {tags.map((tag: string) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Grid>

        {coverImage && (
          <Grid size={{xs:12,sm:3}} >
            <Box
              component="img"
              src={coverImage.url}
              alt={title}
              sx={{
                width: '100%',
                height: 140,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
