import { Suspense } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { appCategories } from '../../../../../utils/categories';
import LaunchCategoryPage from './LaunchCategoryPage';

export async function generateStaticParams() {
  return appCategories.map((category) => ({ category: category.toLowerCase() }));
}

export default function LaunchCategoryPageWrapper({ params, searchParams }: { params: { category: string }, searchParams: { page?: string, tag?: string } }) {
  const { category } = params;
  const page = parseInt(searchParams.page || '1');
  const tag = searchParams.tag;
  
  const validCategory = appCategories.find(c => c.toLowerCase() === category.toLowerCase());
  
  if (!validCategory) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">
          Category not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {validCategory} Apps
        </Typography>
      </Box>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      }>
        <LaunchCategoryPage category={validCategory} page={page} tag={tag} />
      </Suspense>
    </Container>
  );
} 