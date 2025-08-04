import React from 'react';
import { Box, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

type SidebarProps = {
  children: React.ReactNode; // Children allows you to pass any JSX content
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <Box sx={{mt:2}}>
            <Typography variant="h6" gutterBottom>Related Pages</Typography>

    <Box
    sx={{
      overflow:'auto',
      height:'100vh',
    }}
    >
    <Paper elevation={1}
     sx={{
      padding: '1rem', 
     
      position:'sticky',
      top:'40px'
    }}>
      
      {children}
    </Paper>

    </Box>
    </Box>
  );
};

export default Sidebar;
