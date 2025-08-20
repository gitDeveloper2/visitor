'use client';

import { Box, Typography, Avatar, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
// import { UITool } from '@features/tools/models/Tools';

type Props = {
  tools: any[];
};

export default function ToolsNeedingLove({ tools }: Props) {
  if (!tools.length) return null;

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        ❤️ Tools Needing Love
      </Typography>

      {tools.map((tool) => (
        <Box key={tool._id} display="flex" alignItems="center" mb={1.5}>
          {tool.logo?.url && (
            <Avatar src={tool.logo.url} alt={tool.name} sx={{ width: 32, height: 32, borderRadius: 1, mr: 1 }} />
          )}
          <Box>
            <MuiLink component={Link} href={`/public/tools/${tool._id}`} underline="hover">
              <Typography variant="body2" fontWeight={500}>{tool.name}</Typography>
            </MuiLink>
            <Typography variant="caption" color="text.secondary">
              {tool.stats.votes} votes • {tool.stats.comments || 0} comments
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
