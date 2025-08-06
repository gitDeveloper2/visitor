import { Box, AppBar, Toolbar, Button, Divider, Stack } from "@mui/material";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
            py: 1.5,
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Button
              component={Link}
              href="/dashboard"
              variant="text"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              Dashboard
            </Button>
            <Button
              component={Link}
              href="/dashboard/apps"
              variant="text"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              Apps
            </Button>
            <Button
              component={Link}
              href="/dashboard/blogs"
              variant="text"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              Blogs
            </Button>

            {/* Divider for separation */}
            <Divider orientation="vertical" flexItem sx={{ borderColor: "divider" }} />

            {/* Submission links */}
            <Button
              component={Link}
              href="/dashboard/submission/app"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Submit App
            </Button>
            <Button
              component={Link}
              href="/dashboard/submission/blog"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Submit Blog
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
    </Box>
  );
}
