"use client"
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';

type FormData = {
  file: FileList | null;
};

const FileUpload = () => {
  const { handleSubmit, control, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    if (!data.file) {
      setUploadError('No file selected');
      return;
    }

    const file = data.file[0];
    setLoading(true);
    setUploadSuccess(null);
    setUploadError(null);

    try {
      // Simulate an API call to upload the file to Google Drive
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadSuccess(`File uploaded successfully! URL: ${result.path}`);
        reset();
      } else {
        setUploadError(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setUploadError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 4,
        border: '1px solid #ccc',
        borderRadius: 4,
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        bgcolor: '#f9f9f9',
      }}
    >
      <Typography variant="h6">Upload a File</Typography>

      <Controller
        name="file"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <TextField
            type="file"
            variant="outlined"
            fullWidth
            inputProps={{ accept: 'image/*,application/pdf' }}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              field.onChange(target.files);
            }}
            sx={{ mt: 2 }}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{
          mt: 2,
          position: 'relative',
        }}
      >
        {loading ? (
          <>
            <CircularProgress
              size={24}
              sx={{
                color: 'white',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
            Uploading...
          </>
        ) : (
          'Upload'
        )}
      </Button>

      {uploadSuccess && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
          {uploadSuccess}
        </Typography>
      )}

      {uploadError && (
        <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
          {uploadError}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
