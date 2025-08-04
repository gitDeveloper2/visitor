import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

interface ContextCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, type: string, cardData: { title: string; content: string; type: string } | null) => void;
  cardData: { title: string; content: string; type: string } | null;
}

const ContextCardDialog: React.FC<ContextCardDialogProps> = ({ open, onClose, onSave, cardData }) => {
  const [title, setTitle] = useState<string>(cardData?.title || "");
  const [content, setContent] = useState<string>(cardData?.content || "");
  const [type, setType] = useState<string>(cardData?.type || "info");

  useEffect(() => {
    if (cardData) {
      setTitle(cardData.title);
      setContent(cardData.content);
      setType(cardData.type);
    }
  }, [cardData]);

  const handleSave = () => {
    onSave(title, content, type, cardData); // Pass cardData for editing
    setTitle("");
    setContent("");
    setType("info");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{cardData ? "Edit Context Card" : "Insert Context Card"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Content"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Card Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Card Type"
          >
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContextCardDialog;
