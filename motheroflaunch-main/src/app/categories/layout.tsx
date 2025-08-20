// app/categories/layout.tsx
import { ReactNode } from 'react';
import { Grid, Container } from '@mui/material';

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
};

export default function CategoriesLayout({ sidebar, main }: Props) {
  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={5}>
        <Grid size={{xs:12,md:4}} >
          {sidebar}
        </Grid>
        <Grid size={{xs:12,md:4}} >
          {main}
        </Grid>
      </Grid>
    </Container>
  );
}
