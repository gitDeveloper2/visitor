"use client";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { TestimonialData } from "@data/TestimonialData";
import Image from "next/image";
import Slider from "react-slick";

const settings = {
  dots: true,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

export interface TestimonialProps {
  name: string;
  position: string;
  message: string;
  image: string;
}



const Testimonial: React.FC<TestimonialProps> = ({ name, message, position }) => {
  return (
    <Box sx={{ maxWidth: 600, textAlign: "center", px: 2, py: 4 }}>
      <Typography
        variant="h3"
        component={'h3'}
        color="secondary"
        sx={{ fontWeight: "bold", lineHeight: 1, mb: -2,textAlign:'left',fontSize:72 }}
      >
        “
      </Typography>

      <Typography variant="body1" sx={{ fontStyle: "italic", mb: 2 }}>
        {message}
      </Typography>

      <Typography variant="subtitle1" fontWeight="bold">
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }} >
        {position}
      </Typography>
    </Box>
  );
};

const Testimonials = () => {
  return (
    <Box>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="sectionTitle" component="h2">
              What Our Clients Say
            </Typography>
            <Typography  sx={{ color: 'text.secondary' }}  >
              Our clients are happy about our services and we love them back.
              Here are some of their views about our products.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                width: "100%",
                position: "relative",
                "& .slick-dots": {
                  bottom: 0,
                },
                "& .slick-dots li button:before": {
                  color: "#000",
                  fontSize: "10px",
                },
                "& .slick-dots li.slick-active button:before": {
                  color: "primary.main",
                },
                "& .slick-prev, & .slick-next": {
                  zIndex: 2,
                  width: "30px",
                  height: "30px",
                  "&:before": {
                    color: "#000",
                    fontSize: "30px",
                  },
                },
              }}
            >
              <Slider {...settings}>
                {TestimonialData.map((testimonial) => (
                  <Box key={testimonial.name} sx={{ py: 4 }}>
                    <Testimonial {...testimonial} />
                  </Box>
                ))}
              </Slider>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;
