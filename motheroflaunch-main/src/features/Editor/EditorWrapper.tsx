'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { SettingsContext } from '@features/Editor/context/SettingsContext';
import { FlashMessageContext } from '@features/Editor/context/FlashMessageContext';
import { App, EditorProps, type EditorHandle } from '@features/blog/components/App'; // Ensure EditorHandle is exported
import 'app/blogindex.css';

const EditorClientWrapper = forwardRef<EditorHandle,EditorProps>(({ initialHtml }, ref) => {
  const appRef = useRef<EditorHandle>(null);

  useImperativeHandle(ref, () => ({
    async getHtmlContent() {
      // Always return a string or throw
      const html = await appRef.current?.getHtmlContent?.();
      if (html === undefined) throw new Error('getHtmlContent is not available');
      return html;
    },
  }));

  return (
    <SettingsContext>
      <FlashMessageContext>
        <App ref={appRef} initialHtml={initialHtml}/>
      </FlashMessageContext>
    </SettingsContext>
  );
});

export default EditorClientWrapper;
