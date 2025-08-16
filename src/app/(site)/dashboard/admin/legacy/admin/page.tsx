'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Toolbar,
  AppBar,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import PageList from '@components/admin/PageList';
import GscInsightsPage from '@components/admin/GscStats';

export default function LegacyAdminPage() {
  const [content, setContent] = useState<'blog' | 'news'>('blog');
  const [selectedSection, setSelectedSection] = useState('pages');

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const handleContentToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.checked ? 'news' : 'blog');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      <AppBar
        position="static"
        color="default"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ccc',
          boxShadow: 'none',
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'flex-start',
            paddingX: 2,
            paddingY: 0.5,
            minHeight: '50px',
          }}
        >
          <List sx={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
            {['pages', 'gsc', 'settings'].map((text) => (
              <ListItem
                key={text}
                button
                onClick={() => handleSectionChange(text.toLowerCase())}
                sx={{
                  textAlign: 'center',
                  paddingX: 3,
                  marginX: 1,
                  borderRadius: 1,
                  fontWeight: selectedSection === text.toLowerCase() ? 'bold' : 'normal',
                  color: selectedSection === text.toLowerCase() ? '#1976d2' : 'inherit',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={text.charAt(0).toUpperCase() + text.slice(1)}
                  sx={{ textAlign: 'center', whiteSpace: 'nowrap', minWidth: '80px' }}
                />
              </ListItem>
            ))}
           

            
          </List>
         
  <FormControlLabel
    label={content === 'blog' ? 'Blog' : 'News'}
    control={
      <Checkbox
        checked={content === 'news'}
        onChange={handleContentToggle}
        color="primary"
      />
    }
    sx={{ marginLeft: 2 }}
  />
          
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, bgcolor: 'background.default', p: 3 }}>
        {selectedSection === 'pages' && <PageList content={content} />}
        {selectedSection === 'gsc' && <GscInsightsPage />}
        {selectedSection === 'settings' && (
          <div>
            <Typography variant="h4">Legacy Admin Settings</Typography>
            <Typography variant="body1">Legacy admin settings and configuration options will be displayed here.</Typography>
          </div>
        )}
      </Box>
    </Box>
  );
}
