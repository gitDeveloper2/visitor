import React, { useState } from 'react';
import {
  Box,
  Modal,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

interface SocialMediaPostModalProps {
  open: boolean;
  onClose: () => void;
  onPost: (data: { message: string; link: string; platforms: string[] }) => void;
}

const SocialMediaPostModal: React.FC<SocialMediaPostModalProps> = ({
  open,
  onClose,
  onPost,
}) => {
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'facebook',
    'twitter',
  ]); // Default platforms, can be adjusted

  const handlePost = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    // Pass the message, link, and selected platforms
    try {
      await onPost({ message, link, platforms: selectedPlatforms });
      setSuccess('Posts have been successfully submitted!');
      setMessage('');
      setLink('');
      setSelectedPlatforms([]);
    } catch (err: any) {
      setError('Failed to post to selected platforms.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setLink('');
    setLoading(false);
    setSuccess(null);
    setError(null);
    setSelectedPlatforms([]);
    onClose();
  };

  const handlePlatformChange = (platform: string) => {
    
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create a Post for Multiple Platforms
        </Typography>
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Link (Optional)"
          variant="outlined"
          fullWidth
          value={link}
          onChange={(e) => setLink(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPlatforms.includes('facebook')}
                onChange={() => handlePlatformChange('facebook')}
              />
            }
            label="Facebook"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPlatforms.includes('twitter')}
                onChange={() => handlePlatformChange('twitter')}
              />
            }
            label="Twitter"
          />
          {/* Add more platforms as needed */}
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePost}
            fullWidth
            disabled={!message.trim()}
          >
            Post to Selected Platforms
          </Button>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Modal>
  );
};

export default SocialMediaPostModal;
