'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function RescheduleDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (launchDate: string) => void;
}) {
  const [date, setDate] = useState('');

  const FIXED_TIME = 'T10:00:00'; // You can change this to any fixed time you want

  const handleConfirm = () => {
    if (date) {
      const fullDateTime = `${date}${FIXED_TIME}`; // e.g. '2025-06-12T10:00:00'
      onConfirm(fullDateTime);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reschedule Launch</DialogTitle>
      <DialogContent>
        <TextField
          label="New Launch Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Typography variant="caption" sx={{ mt: 1 }}>
          Launch will be scheduled for <strong>10:00 AM</strong> on the selected day.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} disabled={!date}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
