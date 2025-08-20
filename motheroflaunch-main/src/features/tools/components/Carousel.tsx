'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Box, Paper, IconButton, MobileStepper, Button } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

type Props = {
  screenshots: { url: string; public_id: string }[];
};

export default function Carousel({ screenshots }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: false });
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = screenshots.length;

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleBack = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleStepChange = useCallback(() => {
    if (emblaApi) {
      setActiveStep(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', handleStepChange);
    handleStepChange(); // Set initial
  }, [emblaApi, handleStepChange]);

  if (maxSteps === 0) return null;

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1 }}>
      <Paper
        elevation={1}
        sx={{
          position: 'relative',
          height: { xs: 200, sm: 350 },
          mb: 1,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box ref={emblaRef} sx={{ overflow: 'hidden', width: '100%', height: '100%' }}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            {screenshots.map((step) => (
              <Box
                key={step.public_id}
                sx={{
                  flex: '0 0 100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <img
                  src={step.url}
                  alt="Screenshot"
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Overlay Arrow Buttons */}
        <IconButton
          onClick={handleBack}
          disabled={activeStep === 0}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 8,
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(0,0,0,0.4)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 8,
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(0,0,0,0.4)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Paper>

      {/* Bottom Stepper */}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
}
