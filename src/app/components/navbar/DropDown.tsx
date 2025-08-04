import React from "react";
import { Box, Menu, MenuItem, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

interface LinkItem {
  name: string;
  path: string;
}

interface DropdownMenuProps {
  title: string;
  menuItems: LinkItem[];
  onMenuClose: () => void;
  anchorEl: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  menuItems,
  onMenuClose,
  anchorEl,
  onMenuOpen,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "none",
        alignItems: "center",
        gap: 2,
        padding: 0,
        [theme.breakpoints.up("sm")]: {
          display: "flex",
        },
      }}
    >
      <Button color="inherit" onClick={onMenuOpen}>
        {title}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        PaperProps={{
          sx: {
            maxHeight: 48 * 4.5,
            width: "20ch",
            bgcolor: theme.palette.background.default, // solid background color
            color: theme.palette.text.primary,       // text color
            boxShadow: theme.shadows[5],             // subtle shadow
            borderRadius: 2,
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
          },
        }}
      >
        {menuItems.map((linkItem) => (
          <MenuItem
            key={linkItem.name}
            onClick={onMenuClose}
            sx={{
              padding: 0,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <Link
              href={linkItem.path}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 16px",
                color: theme.palette.text.primary,
                textDecoration: "none",
              }}
            >
              {linkItem.name}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
