import { getAdminDashboardData } from '@features/dashboard/service/adminDashboardService';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import Link from 'next/link';

export default async function AdminPage() {
  const { stats, recentUsers, recentTools } = await getAdminDashboardData();

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={2} mb={4}>
        {[
          ['Total Users', stats.totalUsers],
          ['Suspended Users', stats.suspendedUsers],
          ['Total Tools', stats.totalTools],
          ['Votes (7d)', stats.votesThisWeek],
          ['Launched Today', stats.launchedToday],
          ['Draft Tools', stats.draftCount],
          ['Upcoming Tools', stats.upcomingCount],
          ['Launched Tools', stats.launchedCount],
          ['Suspended Tools', stats.suspendedTools],
        ].map(([label, value]) => (
          <Grid size={{xs:6,sm:4,md:3}} key={label}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {label}
                </Typography>
                <Typography variant="h6">{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Tools */}
      <Typography variant="h6" gutterBottom>
        Recently Created Tools
      </Typography>
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Stack divider={<Divider />} spacing={2}>
            {recentTools.map((tool) => (
              <Box
                key={tool._id.toString()}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Link href={`/tool/${tool.slug}`} passHref>
                    <Typography variant="subtitle1" sx={{ cursor: 'pointer' }} color="primary">
                      {tool.name}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="text.secondary">
  {(tool.ownerId?.toString() || 'Unknown')} • {tool.status}
</Typography>

                </Box>
                {tool.launchDate && (
                  <Chip
                    label={`Launch: ${new Date(tool.launchDate).toLocaleDateString()}`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Typography variant="h6" gutterBottom>
        Recently Registered Users
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack divider={<Divider />} spacing={2}>
            {recentUsers.map((user) => (
              <Box
                key={user._id.toString()}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle1">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label={user.role} size="small" />
                  {user.suspended && (
                    <Chip label="Suspended" size="small" color="error" variant="outlined" />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
