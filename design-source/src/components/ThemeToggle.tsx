import { IconButton, Tooltip, Box } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {mode === 'light' ? (
          <Moon style={{ width: 20, height: 20 }} />
        ) : (
          <Sun style={{ width: 20, height: 20 }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 