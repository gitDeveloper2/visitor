'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';

export default function SaveBlogPlugin() {
  const [editor] = useLexicalComposerContext();

  const handleSave = useCallback(() => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor, null); // export as HTML string
console.log(html)
      fetch('/api/blog', {
        method: 'POST',
        body: JSON.stringify({
          title: 'My second blog!',
          content: html, // store as HTML string
          published: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(res => {
          if (res?.success) {
            console.log('Saved blog with ID:', res.blogId);
          } else {
            console.error('Failed to save blog');
          }
        });
    });
  }, [editor]);

  return (
    <button
      onClick={handleSave}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
    >
      Save
    </button>
  );
}
