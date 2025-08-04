import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import DonateButton from "@/components/DonateButton";
import Testimonials from "@/components/Testimonials";
import AboutUs from "@/components/AboutUs";
import { Box } from "@mui/material";

const Index = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <DonateButton />
      <Box component="main">
        <Hero />
        <ToolsSection />
        <Testimonials />
        <AboutUs />
        <BlogSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default Index;
