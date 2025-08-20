'use client';

import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EditorHandle } from '../App';
import type { RefObject } from 'react';

const EditorClientWrapper = dynamic(() => import('@features/Editor/EditorWrapper'), { ssr: false });

export default function StepContent({
  editorRef,
  initialHtml,
}: {
  editorRef: RefObject<EditorHandle>;
  initialHtml?: string;
}) {

  const { setValue, watch } = useFormContext();
  const savedContent = watch('content'); // latest content in form

  const htmlToLoad = savedContent || initialHtml; // prefer saved over initial
  useEffect(() => {
    const initialContent = { root: { children: [], type: 'root' } };
    if (!watch('content')) {
      setValue('content', initialContent);
    }
  }, [setValue, watch]);

  return (
    <Box>
 <EditorClientWrapper
        ref={editorRef}
        initialHtml={htmlToLoad}
      />    </Box>
  );
}
