'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { navItemSx } from './Navbar';

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function MenuDropdown({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'inline-block' }}>
    <Button
  onClick={handleClick}
  endIcon={<ExpandMoreIcon fontSize="small" />}
  sx={{
    ...navItemSx,
    display: 'flex',
    alignItems: 'center',
  }}
>
  {label}
</Button>


      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: (theme) =>
              `0px 4px 12px ${alpha(theme.palette.grey[900], 0.08)}`,
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {items.map((item) => (
          <MenuItem
          key={item.href}
          component={Link}
          href={item.href}
          onClick={handleClose}
          sx={navItemSx}
        >
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.label} />
        </MenuItem>
        
        ))}
      </Menu>
    </Box>
  );
}
