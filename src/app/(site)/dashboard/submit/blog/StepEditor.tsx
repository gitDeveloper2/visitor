"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common } from 'lowlight';
import { Box, Typography, Alert, Chip, Divider, LinearProgress, Tooltip, Grid, Paper, ButtonGroup, Button, Fade } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { 
  FormatBold, 
  FormatItalic, 
  FormatUnderlined, 
  FormatListBulleted, 
  FormatListNumbered, 
  Code, 
  Image as ImageIcon,
  Title,
  TextFields
} from '@mui/icons-material';
import type { Theme } from "@mui/material/styles"; // add near your other imports if needed

const getButtonStyles = (
  theme: Theme,
  isActive: boolean,
  isSuggested: boolean,
  palette: 'primary' | 'secondary' = 'primary'
) => {
  return {
    ...(isSuggested && {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette[palette].main
          : `${theme.palette[palette].main}15`,
      color:
        theme.palette.mode === 'dark'
          ? theme.palette[palette].contrastText
          : theme.palette[palette].main,
    }),
    '&.MuiButton-contained': {
      backgroundColor: theme.palette[palette].main,
      color: theme.palette[palette].contrastText,
    },
    '&.MuiButton-outlined': {
      borderColor: isSuggested ? theme.palette[palette].main : undefined,
      color: isSuggested
        ? theme.palette.mode === 'dark'
          ? theme.palette[palette].contrastText
          : theme.palette[palette].main
        : undefined,
    },
  };
};

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

// --- Contextual Menu Bar ---
const ContextualMenuBar = ({ editor }: { editor: any }) => {
  const theme = useTheme();
  const [cursorContext, setCursorContext] = useState<{
    isHeading: boolean;
    headingLevel?: number;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isList: boolean;
    isCodeBlock: boolean;
    canAddHeading: boolean;
    suggestedActions: string[];
  }>({
    isHeading: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isList: false,
    isCodeBlock: false,
    canAddHeading: true,
    suggestedActions: []
  });

  const updateCursorContext = useCallback(() => {
    if (!editor) return;

    const { state } = editor;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to);
    const currentNode = state.selection.$from.parent;
    
    // Analyze current context
    const isHeading = editor.isActive('heading');
    const headingLevel = isHeading ? editor.getAttributes('heading').level : undefined;
    const isBold = editor.isActive('bold');
    const isItalic = editor.isActive('italic');
    const isUnderline = editor.isActive('underline');
    const isList = editor.isActive('bulletList') || editor.isActive('orderedList');
    const isCodeBlock = editor.isActive('codeBlock');
    
    // Determine suggested actions based on context
    const suggestedActions: string[] = [];
    
    // If at start of line or empty line, suggest headings
    const isAtLineStart = state.selection.$from.parentOffset === 0;
    const isEmptyLine = currentNode.textContent.trim() === '';
    
    if (isAtLineStart || isEmptyLine) {
      suggestedActions.push('heading');
    }
    
    // If text is selected, suggest formatting
    if (selectedText.length > 0) {
      if (!isBold) suggestedActions.push('bold');
      if (!isItalic) suggestedActions.push('italic');
      if (!isUnderline) suggestedActions.push('underline');
    }
    
    // If in paragraph, suggest lists
    if (!isHeading && !isList && !isCodeBlock) {
      suggestedActions.push('list');
    }
    
    // If typing code-like content, suggest code block
    const nearbyText = state.doc.textBetween(Math.max(0, from - 20), Math.min(state.doc.content.size, to + 20));
    if (/[{}();\[\]<>]/.test(nearbyText) && !isCodeBlock) {
      suggestedActions.push('code');
    }

    setCursorContext({
      isHeading,
      headingLevel,
      isBold,
      isItalic,
      isUnderline,
      isList,
      isCodeBlock,
      canAddHeading: !isHeading,
      suggestedActions
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    // Update context on selection change
    const handleSelectionUpdate = () => {
      updateCursorContext();
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('transaction', handleSelectionUpdate);
    
    // Initial update
    updateCursorContext();

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('transaction', handleSelectionUpdate);
    };
  }, [editor, updateCursorContext]);

  if (!editor) return null;

  const getButtonVariant = (action: string, isActive: boolean) => {
    if (isActive) return 'contained';
    if (cursorContext.suggestedActions.includes(action)) return 'contained';
    return 'text';
  };

  const getButtonColor = (action: string, isActive: boolean) => {
    if (isActive) return 'primary';
    if (cursorContext.suggestedActions.includes(action)) return 'secondary';
    return 'inherit';
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Contextual suggestions */}
      {cursorContext.suggestedActions.length > 0 && (
        <Fade in={true}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2, 
              backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.primary.main}25` : `${theme.palette.primary.main}08`,
              border: `1px solid ${theme.palette.primary.main}${theme.palette.mode === 'dark' ? '60' : '20'}`
            }}
          >
            <Typography variant="body2">
              💡 Suggested: {cursorContext.suggestedActions.includes('heading') && 'Add heading'}
              {cursorContext.suggestedActions.includes('bold') && ' • Bold text'}
              {cursorContext.suggestedActions.includes('italic') && ' • Italic text'}
              {cursorContext.suggestedActions.includes('list') && ' • Create list'}
              {cursorContext.suggestedActions.includes('code') && ' • Code block'}
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Main toolbar */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Text formatting */}
        <ButtonGroup variant="outlined" size="small">
        <Button
  variant={getButtonVariant('bold', cursorContext.isBold)}
  color={getButtonColor('bold', cursorContext.isBold) as any}
  onClick={() => editor.chain().focus().toggleBold().run()}
  startIcon={<FormatBold />}
  sx={getButtonStyles(
    theme,
    cursorContext.isBold,
    cursorContext.suggestedActions.includes('bold'),
    'secondary'
  )}
>
  Bold
</Button>

<Button
  variant={getButtonVariant('italic', cursorContext.isItalic)}
  color={getButtonColor('italic', cursorContext.isItalic) as any}
  onClick={() => editor.chain().focus().toggleItalic().run()}
  startIcon={<FormatItalic />}
  sx={getButtonStyles(
    theme,
    cursorContext.isItalic,
    cursorContext.suggestedActions.includes('italic'),
    'secondary'
  )}
>
  Italic
</Button>

          <Button
  variant={getButtonVariant('underline', cursorContext.isUnderline)}
  color={getButtonColor('underline', cursorContext.isUnderline) as any}
  onClick={() => editor.chain().focus().toggleUnderline().run()}
  startIcon={<FormatUnderlined />}
  sx={getButtonStyles(
    theme,
    cursorContext.isUnderline,
    cursorContext.suggestedActions.includes('underline'),
    'secondary'
  )}
>
  Underline
</Button>

        </ButtonGroup>

        {/* Headings */}
        <ButtonGroup variant="outlined" size="small">
  {[1, 2, 3, 4].map((level) => {
    const isActive = cursorContext.isHeading && cursorContext.headingLevel === level;
    const isSuggested = cursorContext.suggestedActions.includes('heading');

    return (
      <Button
        key={level}
        variant={isActive ? 'contained' : isSuggested ? 'outlined' : 'text'}
        color={isActive ? 'primary' : isSuggested ? 'secondary' : 'inherit'}
        onClick={() => editor.chain().focus().setHeading({ level }).run()}
        startIcon={<Title />}
        sx={{
          ...(isSuggested && {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.secondary.main
                : `${theme.palette.secondary.main}15`,
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.secondary.contrastText
                : theme.palette.secondary.main,
          }),
          '&.MuiButton-contained': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText, // force readable text
          },
          '&.MuiButton-outlined': {
            borderColor: isSuggested ? theme.palette.secondary.main : undefined,
            color: isSuggested
              ? theme.palette.mode === 'dark'
                ? theme.palette.secondary.contrastText
                : theme.palette.secondary.main
              : undefined,
          },
        }}
      >
        H{level}
      </Button>
    );
  })}

  <Button
    variant={!cursorContext.isHeading && !cursorContext.isList ? 'contained' : 'text'}
    color={!cursorContext.isHeading && !cursorContext.isList ? 'primary' : 'inherit'}
    onClick={() => editor.chain().focus().setParagraph().run()}
    startIcon={<TextFields />}
    sx={{
      '&.MuiButton-contained': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    }}
  >
    P
  </Button>
</ButtonGroup>


        {/* Lists */}
        <ButtonGroup variant="outlined" size="small">
  <Button
    variant={editor.isActive('bulletList') ? 'contained' : cursorContext.suggestedActions.includes('list') ? 'outlined' : 'text'}
    color={editor.isActive('bulletList') ? 'primary' : cursorContext.suggestedActions.includes('list') ? 'secondary' : 'inherit'}
    onClick={() => editor.chain().focus().toggleBulletList().run()}
    startIcon={<FormatListBulleted />}
    sx={getButtonStyles(
      theme,
      editor.isActive('bulletList'),
      cursorContext.suggestedActions.includes('list'),
      'secondary'
    )}
  >
    Bullets
  </Button>

  <Button
    variant={editor.isActive('orderedList') ? 'contained' : cursorContext.suggestedActions.includes('list') ? 'outlined' : 'text'}
    color={editor.isActive('orderedList') ? 'primary' : cursorContext.suggestedActions.includes('list') ? 'secondary' : 'inherit'}
    onClick={() => editor.chain().focus().toggleOrderedList().run()}
    startIcon={<FormatListNumbered />}
    sx={getButtonStyles(
      theme,
      editor.isActive('orderedList'),
      cursorContext.suggestedActions.includes('list'),
      'secondary'
    )}
  >
    Numbers
  </Button>
</ButtonGroup>


        {/* Code and Image */}
        <ButtonGroup variant="outlined" size="small">
  <Button
    variant={cursorContext.isCodeBlock ? 'contained' : cursorContext.suggestedActions.includes('code') ? 'outlined' : 'text'}
    color={cursorContext.isCodeBlock ? 'primary' : cursorContext.suggestedActions.includes('code') ? 'secondary' : 'inherit'}
    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    startIcon={<Code />}
    sx={getButtonStyles(
      theme,
      cursorContext.isCodeBlock,
      cursorContext.suggestedActions.includes('code'),
      'secondary'
    )}
  >
    Code
  </Button>

  <Button
    variant="text"
    onClick={() => {
      const url = window.prompt("Image URL");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }}
    startIcon={<ImageIcon />}
  >
    Image
  </Button>
</ButtonGroup>

      </Box>
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
          <ContextualMenuBar editor={editor} />
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
