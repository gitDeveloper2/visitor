import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (details: {
    url: string;
    alt: string;
    caption: string;
    attributionText: string;
    attributionLink: string;
  }) => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ open, onClose, onInsert }) => {
  const [details, setDetails] = useState({
    url: "",
    alt: "",
    caption: "",
    attributionText: "",
    attributionLink: "",
  });

  const handleChange = (field: keyof typeof details) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetails((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleInsert = () => {
    onInsert(details);
    setDetails({
      url: "",
      alt: "",
      caption: "",
      attributionText: "",
      attributionLink: "",
    });
    onClose(); // Close dialog after insertion
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Insert Image</DialogTitle>
      <DialogContent>
        <TextField
          label="Image URL"
          fullWidth
          margin="dense"
          value={details.url}
          onChange={handleChange("url")}
        />
        <TextField
          label="Alt Text"
          fullWidth
          margin="dense"
          value={details.alt}
          onChange={handleChange("alt")}
        />
        <TextField
          label="Caption"
          fullWidth
          margin="dense"
          value={details.caption}
          onChange={handleChange("caption")}
        />
        <TextField
          label="Attribution Text"
          fullWidth
          margin="dense"
          value={details.attributionText}
          onChange={handleChange("attributionText")}
        />
        <TextField
          label="Attribution Link"
          fullWidth
          margin="dense"
          value={details.attributionLink}
          onChange={handleChange("attributionLink")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleInsert} variant="contained" color="primary">
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
