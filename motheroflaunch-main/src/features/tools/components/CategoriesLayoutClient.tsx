'use client';

import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ICategory } from '@features/tools/models/Category';

type Props = {
  categories: ICategory[];
};

export default function CategoriesLayoutClient({ categories }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<ICategory | null>(null);

  return (
    <Box>
      {/* Title */}
      <Typography variant="h6" mb={2}>
        Browse Categories
      </Typography>

      {/* 🔍 Autocomplete */}
      <Autocomplete
        options={categories}
        getOptionLabel={(cat) => cat.name}
        onChange={(event, value) => {
          if (value) router.push(`/categories/${value.slug}`);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Quick search"
            variant="outlined"
            size="small"
            fullWidth
          />
        )}
        sx={{ mb: 3 }}
      />

      {/* 📋 Vertical List of Categories */}
      <List disablePadding>
  {categories.map((cat) => (
    <ListItemButton
      key={cat.slug}
      onClick={() => router.push(`/categories/${cat.slug}`)}
      sx={{
        borderRadius: 1,
        px: 1.5,
        py: 1,
        mb: 0.25,
        minHeight: 42, // 👈 reduce height
      }}
    >
      {/* Color dot (not Avatar) */}
      {cat.color && (
        <ListItemIcon sx={{ minWidth: 28 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              bgcolor: cat.color,
              borderRadius: '50%',
            }}
          />
        </ListItemIcon>
      )}

      <ListItemText
        primary={cat.name}
        secondary={cat.description || ''}
        primaryTypographyProps={{
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
        secondaryTypographyProps={{
          fontSize: '0.75rem',
          color: 'text.secondary',
        }}
      />
    </ListItemButton>
  ))}
</List>

    </Box>
  );
}
