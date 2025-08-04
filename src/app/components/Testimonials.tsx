"use client"
import { Box, Container, Grid, Typography, Paper, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { commonStyles, getGlassStyles } from "../../utils/themeUtils";

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
  const theme = useTheme();

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonialData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

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

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid xs={12} md={5}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
              What Our Clients Say
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              Our clients are happy about our services and we love them back.
              Here are some of their views about our products.
            </Typography>
          </Grid>
          <Grid xs={12} md={7}>
            <Box sx={{ width: "100%", position: "relative" }}>
              {/* Carousel Container */}
              <Box sx={{ position: "relative", overflow: "hidden", minHeight: 300 }}>
                <Box
                  sx={{
                    display: "flex",
                    transition: "transform 0.5s ease-in-out",
                    transform: `translateX(-${currentIndex * 100}%)`,
                    height: "100%",
                  }}
                >
                  {testimonialData.map((testimonial, index) => (
                    <Box
                      key={testimonial.name}
                      sx={{
                        minWidth: "100%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          ...getGlassStyles(theme),
                          width: "100%",
                          maxWidth: 500,
                          mx: "auto",
                        }}
                      >
                        <Typography
                          variant="h3"
                          component={'h3'}
                          color="secondary"
                          sx={{ 
                            fontWeight: "bold", 
                            lineHeight: 1, 
                            mb: -2, 
                            textAlign: 'left', 
                            fontSize: 72,
                            color: theme.palette.primary.main
                          }}
                        >
                          "
                        </Typography>

                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontStyle: "italic", 
                            mb: 3,
                            fontSize: "1.1rem",
                            lineHeight: 1.6,
                            color: theme.palette.text.primary
                          }}
                        >
                          {testimonial.message}
                        </Typography>

                        <Typography 
                          variant="subtitle1" 
                          fontWeight="bold"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            mt: 0.5
                          }}
                        >
                          {testimonial.position}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Navigation Buttons */}
              <IconButton
                onClick={prevTestimonial}
                sx={{
                  position: "absolute",
                  left: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.custom.glass.border}`,
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              
              <IconButton
                onClick={nextTestimonial}
                sx={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.custom.glass.border}`,
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>

              {/* Dots Indicator */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
                {testimonialData.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: index === currentIndex ? theme.palette.primary.main : theme.palette.grey[400],
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        bgcolor: index === currentIndex ? theme.palette.primary.dark : theme.palette.grey[500],
                      },
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