import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

interface PageData {
  _id?: string; // `_id` is included but permanently uneditable
  domain: string;
  slug: string;
  title: string;
  content: string;
  keywords?: string;
  meta_description?: string;
  canonical_url?: string;
  image_url?: string;
  image_attribution?: string;
  image_caption?: string;
  relatedPages?: string;
}

interface EditMetadataModalProps {
  open: boolean;
  onClose: () => void;
  initialData: PageData | null;
}

const EditMetadataModal: React.FC<EditMetadataModalProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const [modalContent, setModalContent] = useState<PageData>({
    domain: "",
    slug: "",
    title: "",
    content: "",
    keywords: "",
    meta_description: "",
    canonical_url: "",
    image_url: "",
    image_attribution: "",
    image_caption: "",
    relatedPages: "",
  });

  const [loading, setLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [editableFields, setEditableFields] = useState({
    domain: false,
    slug: false,
  });
  const router = useRouter();
  useEffect(() => {
    if (initialData) {
      setModalContent(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof PageData, value: string) => {
    setModalContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Remove `_id` before sending to the API
    const { _id, ...dataToSend } = modalContent;
   
const section =     modalContent.canonical_url?.split("/")[1]; // "learn"

let api="/api/articles";
if(section=="news"){
api="/api/news"
}



    try {
      const response = await fetch(api, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to update the article");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleClose = () => {
    setCloseLoading(true);
    setTimeout(() => {
      setCloseLoading(false);
      onClose();
    }, 100); // Optional delay for smoother UX
  };

  const toggleEditable = (field: "domain" | "slug") => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md" // Increase modal width
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Update MetadataTR</DialogTitle>
      <DialogContent sx={{ paddingTop: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Permanently display `_id` */}
          {modalContent._id && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                ID:
              </Typography>
              <Typography variant="body2" color="textPrimary">
                {modalContent._id}
              </Typography>
            </Box>
          )}

          {/* Editable fields */}
          {Object.keys(modalContent)
            .filter((key) => key !== "_id") // Exclude `_id` from editable fields
            .map((key) => {
              const isEditableField = key === "domain" || key === "slug";
              return (
                <Box key={key} display="flex" alignItems="center" gap={1}>
                  <TextField
                    label={key
                      .replace(/_/g, " ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                    value={modalContent[key as keyof PageData] || ""}
                    onChange={(e) => handleChange(key as keyof PageData, e.target.value)}
                    disabled={isEditableField && !editableFields[key as "domain" | "slug"]}
                    fullWidth
                    required={["domain", "slug", "title", "content"].includes(key)}
                  />
                  {isEditableField && (
                    <Button
                      size="small"
                      onClick={() => toggleEditable(key as "domain" | "slug")}
                      variant="outlined"
                    >
                      {editableFields[key as "domain" | "slug"]
                        ? "Lock"
                        : "Unlock"}
                    </Button>
                  )}
                </Box>
              );
            })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit"}
        </Button>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="secondary"
          disabled={closeLoading}
        >
          {closeLoading ? "Closing..." : "Close"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMetadataModal;
