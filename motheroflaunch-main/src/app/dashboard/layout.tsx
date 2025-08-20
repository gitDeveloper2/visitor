"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { PropsWithChildren } from "react";
import { useEditorOverlay } from "@features/providers/providers";
import { authClient } from "../../../auth-client";

const drawerWidth = 240;

export default function DashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { open: editorOpen } = useEditorOverlay();
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;

const isAdmin = role === "admin";

const navItems = [
  { href: isAdmin ? "/dashboard/admin" : "/dashboard", label: "Home" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/tools", label: "My Tools" },
  { href: isAdmin ? "/dashboard/admin/blogs" : "/dashboard/blogs", label: isAdmin ? "Blogs" : "My Blogs" },
  { href: "/dashboard/upvotes", label: "Upvoted Tools" },
  { href: "/dashboard/categories", label: "Categories", roles: ["admin"] },
  { href: "/dashboard/users", label: "Users", roles: ["admin"] },
  { href: "/dashboard/categories", label: "Categories", roles: ["admin"] },
];


  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

  return (
    <Box>
      <Box display="flex">
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#f9f9fb",
              pt: 8,
            },
          }}
        >
          <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 2 }}>
            Dashboard
          </Typography>
          <List>
            {visibleNavItems.map(({ href, label }) => {
              const active = pathname === href;
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
    </Box>
  );
}
