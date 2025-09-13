"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { Box, Typography, Alert, Chip, Divider, LinearProgress, Tooltip, Grid, Paper, ButtonGroup, Button, Fade } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
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

// Custom extension to handle paste events and normalize content
const createPasteHandler = (theme: Theme) => Extension.create({
  name: 'pasteHandler',
  
  addProseMirrorPlugins() {
    const { Plugin } = require('prosemirror-state');
    return [
      new Plugin({
        key: new (require('prosemirror-state').PluginKey)('pasteHandler'),
        props: {
          handlePaste: (view, event, slice) => {
            // Get the pasted content
            const { state, dispatch } = view;
            const { tr } = state;
            
            // Apply consistent styling to pasted content
            const from = tr.selection.from;
            const to = from + slice.size;
            
            // Insert the content first
            tr.replaceSelection(slice);
            
            // Clear all formatting marks from pasted content to ensure consistency
            if (dispatch) {
              // Use the current theme's text color
              const textColor = theme.palette.text.primary;
              
              // Remove all existing marks first
              state.schema.marks && Object.keys(state.schema.marks).forEach(markName => {
                if (markName !== 'textStyle') {
                  tr.removeMark(from, to, state.schema.marks[markName]);
                }
              });
              
              // Apply consistent text color
              if (state.schema.marks.textStyle) {
                tr.addMark(from, to, state.schema.marks.textStyle.create({ color: textColor }));
              }
              
              dispatch(tr);
              
              // Force update of contextual menu after paste
              setTimeout(() => {
                view.dispatch(view.state.tr.setSelection(view.state.selection));
              }, 10);
            }
            
            return true;
          },
        },
      }),
    ];
  },
});

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
// --- Contextual Menu Bar (fixed) ---
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
    suggestedActions: string[];
  }>({
    isHeading: false,
    headingLevel: undefined,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isList: false,
    isCodeBlock: false,
    suggestedActions: [],
  });

  // Utility to check a mark across the selection
  const checkMarkAcrossSelection = (markType: string) => {
    if (!editor) return false;
    const { from, to } = editor.state.selection;
  
    if (from === to) return false; // cursor only, no selection
  
    let allHaveMark = true;
  
    editor.state.doc.nodesBetween(from, to, (node) => {
      if (!node.isText) return;
      const marks = node.marks.map(m => m.type.name);
      if (!marks.includes(markType)) allHaveMark = false;
    });
  
    return allHaveMark;
  };
  

  // Utility to check if selection is entirely a list
  const checkListAcrossSelection = (listType: 'bulletList' | 'orderedList') => {
    if (!editor) return false;
    const { from, to } = editor.state.selection;
    let allInList = true;

    editor.state.doc.nodesBetween(from, to, (node) => {
      if (!node.isBlock) return;
      const nodeType = node.type.name;
      if (listType === 'bulletList' && nodeType !== 'listItem' && nodeType !== 'bulletList') {
        allInList = false;
      }
      if (listType === 'orderedList' && nodeType !== 'listItem' && nodeType !== 'orderedList') {
        allInList = false;
      }
    });

    return allInList;
  };

  const updateCursorContext = useCallback(() => {
    if (!editor) return;

    const { state } = editor;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to);

    // Marks
    const isBold = checkMarkAcrossSelection('bold');
    const isItalic = checkMarkAcrossSelection('italic');
    const isUnderline = checkMarkAcrossSelection('underline');

    // Headings
    const isHeading = editor.isActive('heading');
    const headingLevel = isHeading ? editor.getAttributes('heading').level : undefined;

    // Lists
    const isBulletList = checkListAcrossSelection('bulletList');
    const isOrderedList = checkListAcrossSelection('orderedList');
    const isList = isBulletList || isOrderedList;

    // Code blocks
    const isCodeBlock = editor.isActive('codeBlock');

    // Suggested actions
    const suggestedActions: string[] = [];

    // Only suggest if selection is non-empty
    if (selectedText.length > 0) {
      if (!isBold) suggestedActions.push('bold');
      if (!isItalic) suggestedActions.push('italic');
      if (!isUnderline) suggestedActions.push('underline');
    }

    // Suggest heading if cursor at start of empty line
    const currentNode = state.selection.$from.parent;
    const isAtLineStart = state.selection.$from.parentOffset === 0;
    if (!isHeading && isAtLineStart && currentNode.textContent.trim() === '') {
      suggestedActions.push('heading');
    }

    // Suggest list if not in list and enough content
    const wordCount = state.doc.textContent.trim().split(/\s+/).filter(Boolean).length;
    if (!isList && wordCount > 5) suggestedActions.push('list');

    // Suggest code if nearby text looks code-like
    const nearbyText = state.doc.textBetween(Math.max(0, from - 20), Math.min(state.doc.content.size, to + 20));
    if (!isCodeBlock && /[{}();\[\]<>]/.test(nearbyText) && nearbyText.trim().length > 3) {
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
      suggestedActions,
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => updateCursorContext();

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    editor.on('update', handleUpdate);

    updateCursorContext();

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
      editor.off('update', handleUpdate);
    };
  }, [editor, updateCursorContext]);

  if (!editor) return null;

  const getButtonVariant = (isActive: boolean, isSuggested: boolean) => {
    if (isActive) return 'contained';
    if (isSuggested) return 'outlined';
    return 'text';
  };
  
  const getButtonColor = (isActive: boolean, isSuggested: boolean) => {
    if (isActive) return 'primary';
    if (isSuggested) return 'info'; // switch to info for visual differentiation
    return 'inherit';
  };
  

  return (
    <Box sx={{ mb: 2 }}>
      {/* Suggested actions alert */}
      {cursorContext.suggestedActions.length > 0 && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.primary.main}25` : `${theme.palette.primary.main}08`,
            border: `1px solid ${theme.palette.primary.main}${theme.palette.mode === 'dark' ? '60' : '20'}`,
          }}
        >
          <Typography variant="body2">
            💡 Suggested: {cursorContext.suggestedActions.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(' • ')}
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Text formatting */}
        <ButtonGroup variant="outlined" size="small">
          <Button
            variant={getButtonVariant(cursorContext.isBold, cursorContext.suggestedActions.includes('bold'))}
            color={getButtonColor(cursorContext.isBold, cursorContext.suggestedActions.includes('bold')) as any}
            onClick={() => editor.chain().focus().toggleBold().run()}
            startIcon={<FormatBold />}
          >
            Bold
          </Button>

          <Button
            variant={getButtonVariant(cursorContext.isItalic, cursorContext.suggestedActions.includes('italic'))}
            color={getButtonColor(cursorContext.isItalic, cursorContext.suggestedActions.includes('italic')) as any}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            startIcon={<FormatItalic />}
          >
            Italic
          </Button>

          <Button
            variant={getButtonVariant(cursorContext.isUnderline, cursorContext.suggestedActions.includes('underline'))}
            color={getButtonColor(cursorContext.isUnderline, cursorContext.suggestedActions.includes('underline')) as any}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            startIcon={<FormatUnderlined />}
          >
            Underline
          </Button>
        </ButtonGroup>

        {/* Headings */}
        <ButtonGroup variant="outlined" size="small">
          {[1, 2, 3, 4].map(level => {
            const isActive = cursorContext.isHeading && cursorContext.headingLevel === level;
            const isSuggested = cursorContext.suggestedActions.includes('heading');
            return (
              <Button
                key={level}
                variant={getButtonVariant(isActive, isSuggested)}
                color={getButtonColor(isActive, isSuggested) as any}
                onClick={() => editor.chain().focus().setHeading({ level }).run()}
                startIcon={<Title />}
              >
                H{level}
              </Button>
            );
          })}
        </ButtonGroup>

        {/* Paragraph */}
        <ButtonGroup variant="outlined" size="small">
          <Button
            variant={!cursorContext.isHeading && !cursorContext.isList && !cursorContext.isCodeBlock ? 'contained' : 'text'}
            color={!cursorContext.isHeading && !cursorContext.isList && !cursorContext.isCodeBlock ? 'primary' : 'inherit'}
            onClick={() => editor.chain().focus().setParagraph().run()}
            startIcon={<TextFields />}
          >
            P
          </Button>
        </ButtonGroup>

        {/* Lists */}
        <ButtonGroup variant="outlined" size="small">
          <Button
            variant={getButtonVariant(editor.isActive('bulletList'), cursorContext.suggestedActions.includes('list'))}
            color={getButtonColor(editor.isActive('bulletList'), cursorContext.suggestedActions.includes('list')) as any}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            startIcon={<FormatListBulleted />}
          >
            Bullets
          </Button>

          <Button
            variant={getButtonVariant(editor.isActive('orderedList'), cursorContext.suggestedActions.includes('list'))}
            color={getButtonColor(editor.isActive('orderedList'), cursorContext.suggestedActions.includes('list')) as any}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            startIcon={<FormatListNumbered />}
          >
            Numbers
          </Button>
        </ButtonGroup>

        {/* Code & Image */}
        <ButtonGroup variant="outlined" size="small">
          <Button
            variant={getButtonVariant(cursorContext.isCodeBlock, cursorContext.suggestedActions.includes('code'))}
            color={getButtonColor(cursorContext.isCodeBlock, cursorContext.suggestedActions.includes('code')) as any}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            startIcon={<Code />}
          >
            Code
          </Button>

          <Button
            variant="text"
            color="inherit"
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
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Underline,
      TextStyle, 
      Color,
      Image,
      createPasteHandler(theme),
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
        const content = editor.getHTML();
        setFormData({ content });
      
        // Only update cursor context, do NOT modify all text
        setTimeout(() => {
          editor.emit('selectionUpdate', { editor, transaction: editor.state.tr });
        }, 0);
      },
      
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Blog Content
      </Typography>
      {errorText && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Content Issue:
          </Typography>
          <Typography variant="body2">
            {errorText}
          </Typography>
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
