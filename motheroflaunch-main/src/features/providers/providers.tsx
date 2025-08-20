'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}




export const EditorOverlayContext = createContext({
  open: false,
  setOpen: (_: boolean) => {},
});

export function EditorOverlayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <EditorOverlayContext.Provider value={{ open, setOpen }}>
      {children}
    </EditorOverlayContext.Provider>
  );
}

export function useEditorOverlay() {
  return useContext(EditorOverlayContext);
}


