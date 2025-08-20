"use client";

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Chip, Stack, Button, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getGlassStyles, getShadow } from '@/utils/themeUtils';

type Slot = { date: string; cap: number; bookings?: Array<{ appId: string; isPremium: boolean; bookedAt: string }>; numNonPremium?: number };

export default function AdminLaunchPage() {
  const theme = useTheme();
  const [from, setFrom] = useState<string>(() => {
    const d = new Date();
    const y = d.getUTCFullYear(); const m = String(d.getUTCMonth() + 1).padStart(2, '0'); const da = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  });
  const [to, setTo] = useState<string>(() => {
    const d = new Date(); d.setUTCDate(d.getUTCDate() + 21);
    const y = d.getUTCFullYear(); const m = String(d.getUTCMonth() + 1).padStart(2, '0'); const da = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/launch/admin/slots?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Failed to load slots');
      const j = await res.json();
      setSlots(j.slots || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const updateCap = async (date: string, cap: number) => {
    await fetch('/api/launch/admin/slots', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, cap }) });
    fetchSlots();
  };

  return (
    <Box component="main" sx={{ bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Launch Scheduling
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Set daily caps, inspect bookings, and manage schedule.
        </Typography>

        <Paper sx={{ p: 2, mb: 3, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant'), borderRadius: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <TextField type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            <Button variant="contained" onClick={fetchSlots} disabled={loading}>Load</Button>
          </Stack>
        </Paper>

        <Grid container spacing={2}>
          {slots.map((s) => (
            <Grid item xs={12} md={6} lg={4} key={s.date}>
              <Paper sx={{ p: 2, borderRadius: 3, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant') }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">{new Date(s.date + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                  <Chip label={`Cap: ${s.cap}`} size="small" />
                </Stack>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip label={`Bookings: ${s.bookings?.length || 0}`} size="small" />
                  <Chip label={`Non-premium: ${s.numNonPremium || 0}`} size="small" />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" onClick={() => updateCap(s.date, Math.max(0, (s.cap || 0) - 1))}>- Cap</Button>
                  <Button size="small" variant="outlined" onClick={() => updateCap(s.date, (s.cap || 0) + 1)}>+ Cap</Button>
                </Stack>
                {s.bookings && s.bookings.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">Bookings</Typography>
                    <Stack spacing={0.5} mt={1}>
                      {s.bookings.map((b, i) => (
                        <Box key={i} sx={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip size="small" label={b.isPremium ? 'Premium' : 'Free'} />
                          <span>App: {String(b.appId)}</span>
                          <span>at {new Date(b.bookedAt).toLocaleString()}</span>
                          <Button size="small" variant="outlined" onClick={async () => {
                            const newDate = prompt('Reschedule to (YYYY-MM-DD)');
                            if (!newDate) return;
                            const res = await fetch('/api/launch/admin/reschedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ appId: String(b.appId), newDate }) });
                            const j = await res.json().catch(() => ({}));
                            if (!res.ok) {
                              alert(j.error || 'Failed to reschedule');
                            } else {
                              fetchSlots();
                            }
                          }}>Reschedule</Button>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

