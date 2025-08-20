// components/EditorOverlay.tsx
'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

export default function EditorOverlay({
  children,
  visible,
}: {
  children: ReactNode;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      zIndex={1} // ✅ Keep it low as you wanted
      bgcolor="background.default"
      sx={{
        overflow: 'auto',
        padding: 3,
      }}
    >
      {children}
    </Box>
  );
}
