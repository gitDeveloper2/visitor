"use client"
import { IconButton, Tooltip } from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        onClick={toggleTheme}
        sx={(theme) => ({
          color: 'inherit',
          '&:hover': {
            backgroundColor: `rgba(0,0,0,${theme.palette.mode === 'dark' ? 0.2 : 0.08})`,
          },
        })}
      >
        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 