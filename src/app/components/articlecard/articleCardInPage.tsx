import { ArrowForward } from '@mui/icons-material';
import { Box, Chip, Typography, Paper } from '@mui/material';
import React from 'react';
import { getRandomColor } from './utils';
import Link from 'next/link';

export interface ArticleCardProps {
  title: string;
  meta_description: string;
  keywords: string[];
  canonical_url: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  meta_description,
  canonical_url,
  keywords,
}) => {
  const maxKeywords = 3;
  const truncatedKeywords = keywords.slice(0, maxKeywords);
  const truncatedDescription =
    meta_description.length > 100 ? meta_description.slice(0, 100) + '...' : meta_description;

  return (
    <Link href={canonical_url} passHref legacyBehavior>
      <a style={{ textDecoration: 'none' }}>
        <Paper
          sx={{
            py: 2,
            px: 2,
            boxShadow: 3,
            mb: 2,
            cursor: 'pointer',
            '&:hover': {
              boxShadow: 6,
              transform: 'scale(1)',
              transition: '0.3s ease-in-out',
            },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: 'text.primary' }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontSize: '0.875rem' }}
            >
              {truncatedDescription}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
            {truncatedKeywords.map((kw, idx) => (
              <Chip
                key={idx}
                sx={{
                  mr: 1,
                  mb: 1,
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  maxWidth: '120px',
                }}
                label={kw}
                size="small"
                variant="outlined"
                color={getRandomColor()}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontSize: '0.875rem' }}>
            Read Article <ArrowForward sx={{ ml: 0.5 }} fontSize="small" />
          </Box>
        </Paper>
      </a>
    </Link>
  );
};

export default ArticleCard;
