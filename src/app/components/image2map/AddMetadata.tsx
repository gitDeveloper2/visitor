import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { ExifData } from '../../../types/ExifData';
import { ApiResponse } from '../../../types/apiResponse';
import { transformExifData } from '../../../utils/extractors/exifTransformClient';
// Function to update and return the transformed EXIF data

const ImageMetadataModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ExifData | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setMetadata(null);
    setError(null);
    setOpen(false);
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', image);

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/pic2map', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorResponse: ApiResponse<null> = await res.json();
        throw new Error(errorResponse.message);
      }

      const response: ApiResponse<ExifData> = await res.json();
      if (response.success) {
        setMetadata(response.data!);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!metadata || !image) {
      setError('Please upload an image and fetch metadata before saving.');
      return;
    }
    const transfromedExif=transformExifData(metadata)
   


    const formData = new FormData();
    formData.append('file', image);
    formData.append('metadata', JSON.stringify( transfromedExif));

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/pic2map', {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const errorResponse: ApiResponse<null> = await res.json();
        throw new Error(errorResponse.message);
      }

      const response: ApiResponse<{ success: boolean }> = await res.json();
      
       // Get the image response as a Blob
      //  const blob = await res.blob();

      //  // Create a download link for the image
      //  const downloadUrl = URL.createObjectURL(blob);
      //  const link = document.createElement('a');
      //  link.href = downloadUrl;
      //  link.download = 'processed_image.jpg'; // you can dynamically generate this name if needed
      //  link.click();
 
      //  // Clean up URL object after download
      //  URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen}>
        Open Metadata Modal
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Image & Edit Metadata</DialogTitle>
        <DialogContent>
          <Box marginBottom={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!image || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Fetch EXIF Metadata'}
            </Button>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          {metadata && (
            <>
              <TextField
                label="Camera Make"
                value={metadata.cameraMake || ''}
                onChange={(e) => setMetadata({ ...metadata, cameraMake: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Camera Model"
                value={metadata.cameraModel || ''}
                onChange={(e) => setMetadata({ ...metadata, cameraModel: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Exposure Time"
                value={metadata.exposureTime || 'Unknown'}
                onChange={(e) => setMetadata({ ...metadata, exposureTime: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="F Number"
                value={metadata.fNumber || 'Unknown'}
                onChange={(e) => setMetadata({ ...metadata, fNumber: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Focal Length"
                value={metadata.focalLength || 'Unknown'}
                onChange={(e) => setMetadata({ ...metadata, focalLength: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Date & Time"
                value={metadata.dateTime || 'Unknown'}
                onChange={(e) => setMetadata({ ...metadata, dateTime: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Button onClick={handleSave} variant="contained" color="primary">
                Save Metadata
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageMetadataModal;
