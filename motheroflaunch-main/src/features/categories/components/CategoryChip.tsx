'use client';

import { Chip } from '@mui/material';

interface CategoryChipProps {
  name: string;
  slug: string;
  color?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function CategoryChip({
  name,
  slug,
  color = '#ccc',
  onClick,
  selected,
}: CategoryChipProps) {
  return (
    <Chip
      label={name}
      onClick={onClick}
      clickable
      sx={{
        backgroundColor: selected ? color : 'transparent',
        color: selected ? '#fff' : 'inherit',
        border: `1px solid ${color}`,
        textTransform: 'capitalize',
        '&:hover': {
          backgroundColor: selected ? color : `${color}22`,
        },
      }}
    />
  );
}
