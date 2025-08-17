"use client"

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';

export default function RevalidateForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [indexMessage, setIndexMessage] = useState('');
  const [isRevalidating, setIsRevalidating] = useState(false); // State for revalidation
  const [isIndexing, setIsIndexing] = useState(false); // State for indexing

  const onSubmit = async (data) => {
    setIsRevalidating(true); // Set revalidation state to true
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: data.path }),
      });

      if (res.ok) {
        const result = await res.json();
        setMessage(result.message || 'Revalidated successfully');
      } else {
        const result = await res.json();
        setMessage(result.error || 'Revalidation failed');
      }
    } catch (error) {
      setMessage('Error triggering revalidation');
    } finally {
      setIsRevalidating(false); // Set revalidation state back to false
    }
  };

  const onIndex = async () => {
    setIsIndexing(true); // Set indexing state to true
    try {
      const res = await fetch('/api/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '' }),
      });

      if (res.ok) {
        const result = await res.json();
        setIndexMessage(result.message || 'Indexing triggered successfully');
      } else {
        const result = await res.json();
        setIndexMessage(result.error || 'Indexing failed');
      }
    } catch (error) {
      setIndexMessage('Error triggering indexing');
    } finally {
      setIsIndexing(false); // Set indexing state back to false
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Revalidate a Page
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="path"
          label="Path to Revalidate"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('path', { required: 'Path is required' })}
          error={!!errors.path}
          helperText={errors.path ? errors.path.message.toString() : ''}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isRevalidating}
        >
          {isRevalidating ? 'Revalidating...' : 'Revalidate Page'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onIndex}
          disabled={isIndexing}
          style={{ marginLeft: '10px' }}
        >
          {isIndexing ? 'Indexing...' : 'Index'}
        </Button>
        
        {/* Display the Revalidation Message */}
        {message && (
          <Typography variant="body2" style={{ marginTop: '10px', color: message.includes('Error') || message.includes('failed') ? 'red' : 'green' }}>
            {message}
          </Typography>
        )}

        {/* Display the Indexing Message */}
        {indexMessage && (
          <Typography variant="body2" style={{ marginTop: '10px', color: indexMessage.includes('Error') || indexMessage.includes('failed') ? 'red' : 'green' }}>
            {indexMessage}
          </Typography>
        )}
      </form>
    </Container>
  );
}
