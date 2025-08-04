import { ArrowForward } from '@mui/icons-material';
import { Box, Button, Chip, Container, Grid, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';
import { getRandomColor } from './utils';
import Link from "next/link";

export interface ArticleCardProps{
    title:string;
    meta_description:string;
    keywords:string[];
    canonical_url:string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, meta_description, canonical_url, keywords }) => {
    return (
      <Grid item xs={12} md={5}>
        <Paper
          sx={{
            py: 3,
            px: 2,
            boxShadow: 3, // Add subtle shadow
            '&:hover': { boxShadow: 6, transform: 'scale(1.02)', transition: '0.3s ease-in-out' }, // Hover effect
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}> {/* Added font weight */}
              {title}
            </Typography>
            <Typography variant="body2" color={'text.secondary'} paragraph>
              {meta_description}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            {/* Keywords with color */}
            {keywords.map((kw) => (
              <Chip sx={{ mr: 2, borderRadius: '16px' }} label={kw} size="small" variant="outlined" color={getRandomColor()} />

            ))}
          </Box>
          <Box>
          <Link href={canonical_url}>
        <Button color="primary" endIcon={<ArrowForward />} >
          Read Article
        </Button>
        </Link>
           
          </Box>
        </Paper>
      </Grid>
    );
  };
  

export default ArticleCard;
