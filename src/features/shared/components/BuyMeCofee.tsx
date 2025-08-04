import React from 'react';
import { Box, useTheme } from '@mui/material';

export function BuyMeCoffee() {
  // const theme = useTheme();

  return (
    <Box
      component="a"
      href="https://www.buymeacoffee.com/basicutils"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        bgcolor: '#d65a00',
        color: '#fff',
        borderRadius: 1,
       px: { xs: 1, md: 1.5 },
py: { xs: 0.5, md: 0.75 },
fontSize: { xs: '0.75rem', md: '0.8125rem' },

        fontWeight: 500,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        textTransform: 'uppercase',
        boxShadow: '0px 1px 1px rgba(0,0,0,0.25)',
        transition: 'all 0.3s ease',
        '&:hover, &:focus': {
          textDecoration: 'underline',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.4)',
          opacity: 0.85,
          color: '#fff',
        },
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component="img"
        src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
        alt="Buy me a coffee"
        sx={{
          height: { xs: 20, md: 16 }, // slightly larger on mobile
          width: 'auto',
          mr: 1,
          verticalAlign: 'middle',
        }}
      />
      <Box component="span" sx={{ verticalAlign: 'middle' }}>
        Donate
      </Box>
    </Box>
  );
}
