'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Modal,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Skeleton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CoordinateInput from '@/features/map-elevation/components/CoordinateInput';
import ClearPinsButton from '@/features/map-elevation/components/ClearPinsButton';
import { Pin } from '@/features/map-elevation/types';
import { useElevations } from '@/features/map-elevation/hooks/useElevation';
import ElevationFinderPage from './elevationSeoContent';
const ElevationSkeleton = () => (
  <Box
    display="flex"
    flexDirection={{ xs: 'column', md: 'row' }}
    gap={2}
    sx={{ width: '100%' }}
  >
    {/* Map Skeleton */}
    <Box
      sx={{
        width: '100%',
        height: { xs: 400, md: 400 },
        flex: 1,
        borderRadius: 2,
        overflow: 'hidden',
        display: { xs: 'block', md: 'block' }, // ensure visibility
      }}
    >
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>

    {/* Sidebar Skeleton */}
    <Paper
      variant="outlined"
      sx={{
        width: { xs: '100%', md: 300 },
        maxHeight: { xs: 'none', md: 400 },
        overflowY: 'auto',
        p: 2,
      }}
    >
      <Skeleton variant="text" width="50%" height={32} />
      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Box>
    </Paper>
  </Box>
);


const MapView = dynamic(() => import('@/features/map-elevation/components/MapView'), { ssr: false,  loading: () => <ElevationSkeleton />
});

const LOCK_DURATION_MS = 5000;

export  function ElevationPage() {
  const [coords, setCoords] = useState<Omit<Pin, 'elevation' | 'loading' | 'error' | 'locationName'>[]>([]);
  const [queue, setQueue] = useState<Omit<Pin, 'elevation' | 'loading' | 'error' | 'locationName'>[]>([]);
  const [lastAddedPin, setLastAddedPin] = useState<{ lat: number; lng: number } | null>(null);
  const [resetCount, setResetCount] = useState(0);

  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const clickTimestamps = useRef<number[]>([]);
  const [pins, errorMessage, setErrorMessage] = useElevations(coords, resetCount);

  // Queue handling for batch pins
  useEffect(() => {
    if (queue.length === 0) return;
    const timer = setTimeout(() => {
      setCoords((prev) => [...prev, ...queue]);
      setQueue([]);
    }, 1500);
    return () => clearTimeout(timer);
  }, [queue]);

  // Lock countdown
  useEffect(() => {
    if (!isLocked || lockCountdown <= 0) return;

    const interval = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockCountdown]);
  useEffect(() => {
    console.log(errorMessage)
    if (!errorMessage) return;
  
    if (
     
      errorMessage.toLowerCase().includes('rate limit') ||
      errorMessage.toLowerCase().includes('too many requests')
    ) {
      setIsLocked(true);
      setLockCountdown(10); // You can use 10s or any value you want
    }
  }, [errorMessage]);
  useEffect(() => {
    if (!isLocked || lockCountdown <= 0) return;
  
    const interval = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setErrorMessage(null); // ✅ Clear the error so it doesn't retrigger
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [isLocked, lockCountdown]);
  
  const addPin = (pin: { lat: number; lng: number }) => {
    const now = Date.now();

    if (isLocked) return;

    clickTimestamps.current = clickTimestamps.current.filter((t) => now - t < 3000);

    if (clickTimestamps.current.length >= 5) {
      setIsLocked(true);
      setLockCountdown(LOCK_DURATION_MS / 1000);
      return;
    }

    clickTimestamps.current.push(now);
    setQueue((prev) => [...prev, pin]);
    setLastAddedPin(pin);
  };

  const clearPins = () => {
    setCoords([]);
    setQueue([]);
    setLastAddedPin(null);
    setResetCount((prev) => prev + 1);
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
<Box
  display="flex"
  flexDirection={{ xs: 'column', sm: 'row' }}
  alignItems={{ xs: 'stretch', sm: 'flex-end' }}
  justifyContent={{ xs: 'center', sm: 'flex-start' }}
  gap={2}
>
  <CoordinateInput onAddPin={addPin} />
  <ClearPinsButton
    onClear={clearPins}
    disabled={coords.length === 0 && queue.length === 0}
  />
</Box>



      <Box mt={4}>
        <MapView pins={pins} onMapClick={addPin} flyTo={lastAddedPin} />
      </Box>

      <Modal open={isLocked}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              width: 300,
              bgcolor: 'background.paper',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <LockIcon color="error" sx={{ fontSize: 48 }} />
            <Typography variant="h6" fontWeight="bold">
  {errorMessage?.toLowerCase().includes('rate limit')
    ? 'Server Rate Limit'
    : 'Too Many Clicks'}
</Typography>

              <Typography variant="body2" color="text.secondary">
                Please wait before continuing
              </Typography>

              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={(lockCountdown / (LOCK_DURATION_MS / 1000)) * 100}
                  size={80}
                  thickness={4}
                  color="error"
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="h5" fontWeight="bold">
                    {lockCountdown}s
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Modal>
      <ElevationFinderPage/>
    </Container>
  );
}
