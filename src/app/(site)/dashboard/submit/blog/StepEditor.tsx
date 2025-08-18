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
import { Box, Typography, Alert, Chip, Divider, LinearProgress, Tooltip, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Color, TextStyle } from '@tiptap/extension-text-style'

interface StepEditorProps {
  formData: {
    content: string;
  };
  setFormData: (data: Partial<{ content: string }>) => void;
  errorText?: string;
  quality?: {
    breakdown?: {
      wordCount: number;
      headingsScore: number;
      linksScore: number;
      imagesScore: number;
      tagsScore: number;
      total: number;
    };
    hints: string[];
    config: { wordIdealMin: number; wordIdealMax: number };
    tagsCount: number;
    linkCap: number;
  };
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
export default function StepEditor({ formData, setFormData, errorText, quality }: StepEditorProps) {
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

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={9}>
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </Grid>
        {quality?.breakdown && (
          <Grid item xs={12} md={3}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 80 }, alignSelf: 'flex-start', zIndex: 1 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Quality score
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {quality.breakdown.total.toFixed(2)} / {(
                    quality.breakdown.imagesScore * 0 + 1
                  ).toFixed(0)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, quality.breakdown.total * 100))}
                sx={{ height: 8, borderRadius: 999 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Tooltip title={`Words: ${quality.breakdown.wordCount} (ideal ${quality.config.wordIdealMin}-${quality.config.wordIdealMax})`}>
                  <Chip size="small" label={`Words ${quality.breakdown.wordCount}`} />
                </Tooltip>
                <Tooltip title={`Headings score: ${quality.breakdown.headingsScore.toFixed(2)}`}>
                  <Chip size="small" label={`Headings ${quality.breakdown.headingsScore.toFixed(2)}`} />
                </Tooltip>
                <Tooltip title={`Links score: ${quality.breakdown.linksScore.toFixed(2)} (cap ${quality.linkCap})`}>
                  <Chip size="small" label={`Links ${quality.breakdown.linksScore.toFixed(2)}`} />
                </Tooltip>
                <Tooltip title={`Tags score: ${quality.breakdown.tagsScore.toFixed(2)} (you have ${quality.tagsCount})`}>
                  <Chip size="small" label={`Tags ${quality.breakdown.tagsScore.toFixed(2)}`} />
                </Tooltip>
                <Tooltip title={`Images score: ${quality.breakdown.imagesScore.toFixed(2)}`}>
                  <Chip size="small" label={`Images ${quality.breakdown.imagesScore.toFixed(2)}`} />
                </Tooltip>
              </Box>
              {quality.hints.length > 0 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {quality.hints.map((h, i) => (
                      <li key={i}>
                        <Typography variant="caption">{h}</Typography>
                      </li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Paper>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
