'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import Logo from './header/logo';
import Nav from './header/nav';
import Auth from './header/Auth';

const Header = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Container maxWidth="lg" >
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Logo />

            {isMobile ? (
              <>
                <IconButton onClick={toggleDrawer} edge="end" size="large">
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Nav />
                <Auth />
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            
            p: 2,
            width: 250,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Nav />
            <Box sx={{ mt: 2 }}>
              <Auth />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
