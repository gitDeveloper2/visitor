"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common } from 'lowlight';
import { Box, Typography, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Color, TextStyle } from '@tiptap/extension-text-style'

interface StepEditorProps {
  formData: {
    content: string;
  };
  setFormData: (data: Partial<{ content: string }>) => void;
  errorText?: string;
}

// --- Menu Bar ---
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code Block</button>

      {[1, 2, 3, 4, 5, 6].map((level) => (
        <button
          key={level}
          onClick={() =>
            editor.chain().focus().setHeading({ level }).run()
          }
        >
          H{level}
        </button>
      ))}

      <button onClick={() => editor.chain().focus().setParagraph().run()}>
        Paragraph
      </button>

      <button
        onClick={() => {
          const url = window.prompt("Image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        Add Image
      </button>
    </Box>
  );
};

// --- Component ---
export default function StepEditor({ formData, setFormData, errorText }: StepEditorProps) {
  const theme = useTheme();

  const editor = useEditor({
    immediatelyRender:false,
    
    extensions: [
      StarterKit,
      Underline,
       TextStyle, Color,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Image,
    //   CodeBlockLowlight.configure({ lowlight: common }),
      Placeholder.configure({
        placeholder: "Start writing your blog post here...",
      }),
    ],
    content: formData.content,
    editorProps: {
      attributes: {
        style: `
          outline: none;
          padding: 16px;
          min-height: 400px;
          background-color: ${theme.palette.background.paper};
          border-radius: 8px;
          box-shadow: inset 0 0 0 1px ${theme.palette.divider};
        `,
      },
    },
    onCreate({ editor }) {
        // Apply theme color when editor is first ready
        // editor.isActive('textStyle', { color: '#958DF1' }),
        editor.chain().focus().setColor(theme.palette.text.primary).run()
        // editor.chain().focus().setColor(theme.palette.text.primary).run();
      },
    onUpdate({ editor }) {
      setFormData({ content: editor.getHTML() });
      editor.chain().focus().setColor(theme.palette.text.primary).run()

    },
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Blog Content
      </Typography>
      {errorText && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorText}
        </Alert>
      )}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
}
