"use client";

import React from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Menu,
  MenuItem,
  Typography,
  Collapse,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTheme } from "@mui/material/styles";

import { useRef } from "react";

  const groupedLinks = [
    {
      group: "Main",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Apps", href: "/dashboard/apps" },
        { label: "Blogs", href: "/dashboard/blogs" },
      ],
    },
    {
      group: "Launchpad",
      links: [
        { label: "Public Blogs", href: "/blogs" },
        { label: "Launchpad", href: "/launch" },
        { label: "Launch Details", href: "/launch/snippet-saver" },
        { label: "How Launch Works", href: "/launch/how-it-works" },
      ],
    },
    {
      group: "Write",
      links: [
        { label: "Write Blog", href: "/dashboard/blogs/write" },
        { label: "Test Edit", href: "/dashboard/blogs/test-edit" },
      ],
    },
    {
      group: "Admin",
      links: [
        { label: "Admin Apps", href: "/dashboard/admin/apps" },
        { label: "Admin Blogs", href: "/dashboard/admin/blogs" },
      ],
    },
  ];

  const submitMenuItems = [
    { label: "Submit App", href: "/dashboard/submission/app" },
    { label: "Submit Blog", href: "/dashboard/submission/blog" },
  ];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const theme = useTheme();
  
  const [submitAnchorEl, setSubmitAnchorEl] = React.useState<null | HTMLElement>(null);
  const [groupMenuAnchor, setGroupMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [openGroup, setOpenGroup] = React.useState<string | null>(null);

  const handleGroupMenuOpen = (group: string) => (e: React.MouseEvent<HTMLElement>) => {
    setGroupMenuAnchor(e.currentTarget);
    setOpenGroup(group);
  };
  const handleGroupMenuClose = () => {
    setGroupMenuAnchor(null);
    setOpenGroup(null);
  };

  // ...existing groupedLinks and submitMenuItems...

  return (
    <Box>
      <Box
        component="nav"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          my: 3,
          px: { xs: 1, md: 2 },
          py: 0.5,
          display: "flex",
          alignItems: "center",
          backgroundColor: "background.paper",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          borderRadius: "0.5rem",
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
<Box sx={{ mx: "auto", }}>
  <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center" justifyContent="center">

          {groupedLinks.map(({ group, links }) => (
            <Box key={group}>
              <Button
                endIcon={openGroup === group ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                variant="text"
                size="small"
                onClick={handleGroupMenuOpen(group)}
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {group}
              </Button>
              <Menu
  anchorEl={groupMenuAnchor}
  open={openGroup === group}
  onClose={handleGroupMenuClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
  PaperProps={{
    sx: {
        bgcolor: theme.palette.background.default, // solid background color
            color: theme.palette.text.primary,  // or "#fff" for white
      // Optional: add a border or shadow if you want
      boxShadow: 3,
    },
  }}
>
  {links.map((item) => (
    <MenuItem
      key={item.href}
      component={Link}
      href={item.href}
      onClick={handleGroupMenuClose}
    >
      {item.label}
    </MenuItem>
  ))}
</Menu>
            </Box>
          ))}

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: { xs: 1, sm: 2 }, borderColor: "divider" }}
          />

          {/* Expandable Submit Menu */}
          <Box>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{
                fontWeight: 600,
                borderRadius: 999,
                px: { xs: 1.5, sm: 2 },
                textTransform: "none",
              }}
              onClick={e => setSubmitAnchorEl(e.currentTarget)}
            >
              Submit <Typography component="span" sx={{ ml: 0.5 }}>▾</Typography>
            </Button>
           <Menu
  anchorEl={submitAnchorEl}
  open={Boolean(submitAnchorEl)}
  onClose={() => setSubmitAnchorEl(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  PaperProps={{
    sx: {
      backgroundColor: "background.paper", // or "#fff"
      boxShadow: 3,
    },
  }}
>
  {submitMenuItems.map((item) => (
    <MenuItem
      key={item.href}
      component={Link}
      href={item.href}
      onClick={() => setSubmitAnchorEl(null)}
    >
      {item.label}
    </MenuItem>
  ))}
</Menu>
          </Box>
        </Stack>
        </Box>
      </Box>

      {/* Page Content */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
    </Box>
  );
}