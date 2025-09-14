"use client"
import { Box, Container, Grid, Typography, Paper, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles, typographyVariants } from "../../utils/themeUtils";

// Define testimonial data
const testimonialData = [
  {
    name: "Ritika S.",
    message:
      "The Pic2Map tool helped me recover GPS data from an old vacation album — super useful and easy to use!",
    position: "Traveler & Hobbyist",
  },
  {
    name: "Marco L.",
    message:
      "I keep coming back for the tutorials — they're clear, straight to the point, and actually useful for real dev work.",
    position: "Full Stack Developer",
  },
  {
    name: "Fatima A.",
    message:
      "Used the image compressor before uploading product shots. Worked great without quality loss.",
    position: "Online Seller",
  },
  {
    name: "Noah P.",
    message:
      "Discovered your blog while debugging a Next.js issue — the article saved me hours. Bookmarked!",
    position: "Indie Dev",
  },
  {
    name: "Chinonso U.",
    message:
      "The geotagger tool helped me fix metadata for my drone footage. Very clean interface too.",
    position: "YouTuber",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 600 : false;

  // Auto-rotate testimonials only when not hovered
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonialData.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonialData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonialData.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box sx={{ 
      py: { xs: 8, sm: 10, md: 12 },
      px: { xs: 2, sm: 3 },
      position: 'relative',
      overflow: 'hidden',
      bgcolor: theme.palette.background.default,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.primary.light}20 0%, transparent 70%)`,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5} sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pr: { md: 4 },
              textAlign: { xs: 'center', md: 'left' },
              mb: { xs: 4, md: 0 },
              position: 'relative'
            }}>
              <Typography 
                variant="h2"
                component="h2"
                sx={{ 
                  ...typographyVariants.heroTitle,
                  mb: 3,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(90deg, #fff, #e0e0ff)' 
                    : 'linear-gradient(90deg, #1a1a2e, #3a3a5e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                What Our Clients Say
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  ...typographyVariants.bodyLarge,
                  color: theme.palette.text.secondary,
                  mb: 3,
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Join thousands of satisfied developers and creators who trust our tools
              </Typography>
              
              {/* Stats */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 3,
                mt: 2,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                {[
                  { value: '10K+', label: 'Active Users' },
                  { value: '4.9', label: 'Rating' },
                  { value: '24/7', label: 'Support' }
                ].map((stat, index) => (
                  <Box key={index}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        color: 'primary.main',
                        lineHeight: 1.2,
                        mb: 0.5
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sx={{ position: 'relative', zIndex: 0 }}>
            <Box 
              sx={{ 
                width: "100%", 
                position: "relative",
                '&:hover': {
                  '& .testimonial-nav-button': {
                    opacity: 1,
                    transform: 'translateY(-50%) scale(1)'
                  }
                },
                minHeight: { xs: 400, sm: 450 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Carousel Container */}
              <Box sx={{ 
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                pl: { md: 2 },
                '& > div': {
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                },
                '&:hover .testimonial-card': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`,
                    height: '100%',
                    gap: 4,
                    '& > *': {
                      flex: '0 0 calc(100% - 32px)',
                      maxWidth: 'calc(100% - 32px)'
                    }
                  }}
                >
                  {testimonialData.map((testimonial, index) => (
                    <Box
                      key={testimonial.name}
                      sx={{
                        position: 'relative',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                      }}
                    >
                      <Paper
                        elevation={0}
                        className="testimonial-card"
                        sx={{
                          p: { xs: 3, sm: 4, md: 4 },
                          textAlign: "center",
                          minHeight: 360,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          background: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          boxShadow: theme.shadows[4],
                          mx: 'auto',
                          width: '100%',
                          maxWidth: 550,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
                          }
                        }}
                      >
                        <Box sx={{ mb: 3, minHeight: 30 }}>
                          {[...Array(5)].map((_, i) => (
                            <Box 
                              key={i} 
                              component="span" 
                              sx={{ 
                                color: '#ffc107',
                                mx: 0.5,
                                fontSize: '1.5rem',
                                lineHeight: 1,
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              ★
                            </Box>
                          ))}
                        </Box>

                        <Typography
                          variant="h3"
                          component="span"
                          sx={{ 
                            display: 'block',
                            lineHeight: 1, 
                            mb: 3,
                            textAlign: 'center', 
                            fontSize: { xs: 48, sm: 72 },
                            color: theme.palette.primary.light,
                            opacity: 0.2,
                            position: 'absolute',
                            top: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 0
                          }}
                        >
                          "
                        </Typography>

                        <Typography 
                          variant="body1"
                          sx={{ 
                            ...typographyVariants.bodyLarge,
                            fontStyle: "italic",
                            mb: 4,
                            color: theme.palette.text.primary,
                            position: 'relative',
                            zIndex: 1,
                            px: { xs: 1, sm: 2 },
                            '&::before, &::after': {
                              fontSize: '4rem',
                              color: theme.palette.primary.light,
                              opacity: 0.2,
                              position: 'absolute',
                              lineHeight: 1,
                              fontFamily: 'serif',
                            },
                            '&::before': {
                              content: '"\u201C"',
                              top: -20,
                              left: 0,
                            },
                            '&::after': {
                              content: '"\u201D"',
                              bottom: -40,
                              right: 0,
                            }
                          }}
                        >
                          {testimonial.message}
                        </Typography>

                        <Box>
                          <Box 
                            sx={{ 
                              width: 60, 
                              height: 4, 
                              background: theme.palette.primary.main,
                              mx: 'auto',
                              mb: 3,
                              borderRadius: 2
                            }} 
                          />
                          
                          <Typography 
                            variant="h6"
                            component="div"
                            sx={{ 
                              color: theme.palette.text.primary,
                              fontWeight: 700,
                              mb: 0.5,
                              fontSize: '1.1rem'
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.95rem',
                              opacity: 0.9,
                              lineHeight: 1.5
                            }}
                          >
                            {testimonial.position}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Navigation Buttons */}
              <IconButton
                onClick={prevTestimonial}
                className="testimonial-nav-button"
                sx={{
                  position: "absolute",
                  left: { xs: 10, sm: 20 },
                  top: "50%",
                  transform: 'translateY(-50%) scale(0.9)',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  zIndex: 2,
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  opacity: { xs: 1, md: 0 },
                  transition: 'all 0.3s ease, opacity 0.3s ease, transform 0.2s ease',
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    transform: 'translateY(-50%) scale(1)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              
              <IconButton
                onClick={nextTestimonial}
                className="testimonial-nav-button"
                sx={{
                  position: "absolute",
                  right: { xs: 10, sm: 20 },
                  top: "50%",
                  transform: 'translateY(-50%) scale(0.9)',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  zIndex: 2,
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  opacity: { xs: 1, md: 0 },
                  transition: 'all 0.3s ease, opacity 0.3s ease, transform 0.2s ease',
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    transform: 'translateY(-50%) scale(1)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <ChevronRight />
              </IconButton>

              {/* Dots Indicator */}
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                mt: 4,
                gap: 1.5,
                position: 'relative',
                zIndex: 1,
                pb: 2
              }}>
                {testimonialData.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      width: index === currentIndex ? 32 : 8,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: index === currentIndex 
                        ? theme.palette.primary.main 
                        : theme.palette.action.hover,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: theme.palette.primary.main,
                        opacity: index === currentIndex ? 1 : 0.7
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials; 