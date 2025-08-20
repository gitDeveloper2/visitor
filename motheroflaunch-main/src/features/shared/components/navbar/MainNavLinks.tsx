'use client';

import Link from 'next/link';
import { alpha, Box, Button } from '@mui/material';
import { usePathname } from 'next/navigation';
import MenuDropdown from './MenuDropdown';

// Icons
import TodayIcon from '@mui/icons-material/Today';
import StarIcon from '@mui/icons-material/Star';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { navItemSx } from './Navbar';

export default function MainNavLinks() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <Box display="flex" gap={1}>
      {/* Normal nav links */}

      {/* 🔽 Discover dropdown */}
    

      <MenuDropdown

        label="Discover"
        items={[
          {
            label: "Today's Launches",
            href: '/',
            icon: <TodayIcon fontSize="small" />,
          },
          {
            label: 'Categories',
            href: '/categories',
            icon: <StarIcon fontSize="small" />,
          },
        ]}
      />

      {/* 🚀 Launch dropdown */}
      <MenuDropdown

        label="Launch"
        items={[
          {
            label: 'New Tool',
            href: '/dashboard/tools/new',
            icon: <AddBoxIcon fontSize="small" />,
          },
          {
            label: 'New Blog',
            href: '/dashboard/blogs/create',
            icon: <PostAddIcon fontSize="small" />,
          },
        ]}
      />
      <Button
  component={Link}
  href="/dashboard"
  variant="text"
  sx={{
    ...navItemSx,
    ...(isActive('/dashboard') && {
      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
      fontWeight: 600,
    }),
  }}
>
  Dashboard
</Button>

<Button
  component={Link}
  href="/blog"
  variant="text"
  sx={{
    ...navItemSx,
    ...(isActive('/blogs') && {
      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
      fontWeight: 600,
    }),
  }}
>
Blog
</Button>


    </Box>
  );
}
