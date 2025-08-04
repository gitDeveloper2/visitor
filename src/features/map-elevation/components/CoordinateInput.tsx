'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Tooltip } from '@mui/material';

interface Props {
  onAddPin: (pin: { lat: number; lng: number }) => void;
}

export default function CoordinateInput({ onAddPin }: Props) {
  const [inputMode, setInputMode] = useState<'split' | 'single'>('split');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [rawInput, setRawInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let latitude: number, longitude: number;

    if (inputMode === 'split') {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    } else {
      const match = rawInput.trim().match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
      if (!match) {
        alert('Please enter coordinates in "lat, lng" or "lat lng" format.');
        return;
      }
      latitude = parseFloat(match[1]);
      longitude = parseFloat(match[3]);
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      alert('Invalid coordinates.');
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      alert('Latitude must be between -90 and 90, and longitude between -180 and 180.');
      return;
    }

    onAddPin({ lat: latitude, lng: longitude });

    setLat('');
    setLng('');
    setRawInput('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={2}>
      <Stack spacing={1}>
        <ToggleButtonGroup
          value={inputMode}
          exclusive
          onChange={(_, mode) => mode && setInputMode(mode)}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            bgcolor: '#f5f5f5',
            borderRadius: 1,
          }}
        >
           <Tooltip title="Enter latitude and longitude separately. E.g., 48.8584 and 2.2945" arrow>
    <ToggleButton value="split">Lat / Lng</ToggleButton>
  </Tooltip>
  <Tooltip title='Enter coordinates as one string. E.g., "48.8584 2.2945" or "48.8584, 2.2945"' arrow>
    <ToggleButton value="single">Single Field</ToggleButton>
  </Tooltip>
        </ToggleButtonGroup>

        {inputMode === 'split' ? (
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="Lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
              sx={{ width: 100 }}
            />
            <TextField
              size="small"
              label="Lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
              sx={{ width: 100 }}
            />
          </Stack>
        ) : (
          <TextField
            size="small"
            label="Lat Lng"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="48.8584 2.2945"
            required
            sx={{ minWidth: 200 }}
          />
        )}

        <Button type="submit" variant="contained" size="small" sx={{ alignSelf: 'flex-start' }}>
          Add Pin
        </Button>
      </Stack>
    </Box>
  );
}
