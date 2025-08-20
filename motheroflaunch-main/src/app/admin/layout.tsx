"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Container, Drawer, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

const drawerWidth = 240;

const navItems = [
  { href: "/admin", label: "Admin Home" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/tools", label: "Tools" },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <Container>
      <Box display="flex">
        {/* Sidebar Drawer */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              mt: 8, // offset for top navbar if any
              height: "calc(100% - 140px)",
              boxSizing: "border-box",
              backgroundColor: "#f9f9fb",
              borderRight: "1px solid #e0e0e0",
              paddingTop: 2,
            },
          }}

          
        >
          <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 2 }}>
            Admin Panel
          </Typography>
          <List>
            {navItems.map(({ href, label }) => {
              // Mark active if pathname starts with href, so /admin/users/123 works too
              const active = pathname === href || pathname.startsWith(href + "/");

              return (
                <ListItemButton
                  key={label}
                  component={Link}
                  href={href}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: active ? "#e0f7fa" : "transparent",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 400,
                      color: active ? "primary.main" : "text.primary",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 3,
            py: 4,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  );
}
