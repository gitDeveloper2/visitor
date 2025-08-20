'use client';

import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type Props = {
  tips: string[];
};

export default function LaunchTips({ tips }: Props) {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        💡 Launch Tips
      </Typography>

      <List dense disablePadding>
        {tips.map((tip, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText
              primary={tip}
              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
