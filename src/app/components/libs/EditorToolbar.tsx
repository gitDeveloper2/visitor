import React from "react";
import Button from "@mui/material/Button";
import Quill from "quill";

interface EditorToolbarProps {
  quillRef: React.RefObject<Quill>;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ quillRef }) => {
  const insertImageBlot = () => {
    const url = prompt("Enter image URL:");
    if (!url) return;
    const range = quillRef.current?.getSelection();
    if (range) {
      quillRef.current?.insertEmbed(range.index, "image", { src: url });
    }
  };

  return (
    <Button variant="contained" onClick={insertImageBlot}>
      Insert Image
    </Button>
  );
};
