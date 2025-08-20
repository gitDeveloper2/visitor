'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Tooltip,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { useEditorOverlay } from '@features/providers/providers';

interface StepContentPortalProps {
  children: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function StepContentPortal({
  children,
  onClose,
  onSave,
  onNext,
  onBack,
}: StepContentPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setOpen } = useEditorOverlay(); // ✅ use context

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setMounted(true);
    setOpen(true); // ✅ Editor is active

    return () => setOpen(false); // ✅ Cleanup on unmount
  }, [setOpen]);
  if (!mounted) return null;

  const portalRoot = document.getElementById('step-content-portal-root');
  if (!portalRoot) return null;

  return createPortal(
    <Box
  position="fixed"
  top={60}
  left={0}
  width="100vw"
  height="100vh"
  bgcolor="rgba(0,0,0,0.3)"
  zIndex={1} // MUI's default modal z-index is 1300
  display="flex"
  justifyContent="center"
  alignItems="center"
>

      <Paper
        elevation={4}
        sx={{
          width: isFullscreen ? '95vw' : '80vw',
          height: isFullscreen ? '90vh' : '70vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.default',
          zIndex: 1, // Keep modal content below dropdowns

        }}
      >
        {/* Top Bar */}
        <Box
          px={2}
          py={1}
          borderBottom="1px solid"
          borderColor="divider"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="background.paper"
        >
          {/* Left: Title + Buttons */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Blog Editor
            </Typography>
            {onBack && (
              <Button size="small" onClick={onBack} variant="outlined">
                Back
              </Button>
            )}
            {onSave && (
              <Button size="small" onClick={onSave} variant="contained" color="primary">
                Save
              </Button>
            )}
            {onNext && (
              <Button size="small" onClick={onNext} variant="contained" color="secondary">
                Next
              </Button>
            )}
          </Box>

          {/* Right: Icon Buttons */}
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
              <IconButton
                size="small"
                onClick={() => setIsFullscreen((prev) => !prev)}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Minimize">
              <IconButton size="small" onClick={onClose}>
                <MinimizeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close Editor">
              <IconButton
                size="small"
                onClick={() => {
                  console.log('Closing portal');
                  onClose(); // ✅ ensure this is being called
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Editor Area */}
        <Box
          flex={1}
          overflow="auto"
          // p={3}
          sx={{
            backgroundColor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>,
    portalRoot
  );
}
