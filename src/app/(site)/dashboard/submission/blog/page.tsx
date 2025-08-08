"use client";

import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles } from "../../../../../utils/themeUtils";
import StepMetadata from "./StepMetadata";
import StepEditor from "./StepEditor";
import StepReview from "./StepReview";

const steps = ["Blog Info", "Write Blog", "Review & Submit"];

export default function BlogSubmitPage() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  // ✅ ADD THIS STATE
  const [formData, setFormData] = React.useState({
    title: "",
    author: "",
    role: "",
    tags: "",
    authorBio: "",
    content: "", // you'll use this in StepEditor
    isFounderStory: false,
    founderUrl: "",
    founderDomainCheck: { status: "unknown", message: "" } as {
      status: "unknown" | "checking" | "ok" | "taken" | "invalid";
      message?: string;
    },
    
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const handleSubmit = async () => {
    console.log("Submitting blog:", formData);

    // try {
    //   // 1) save blog (existing behavior)
    //   const blogRes = await fetch("/api/blogs", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(formData),
    //   });
    //   if (!blogRes.ok) throw new Error("Could not save blog");
  
    //   // 2) if founder story is requested, submit it separately
    //   if (formData.isFounderStory && formData.founderUrl) {
    //     // assume you know the appId (maybe from page context)
    //     const appId = /* fill in app id from props or page context */;
    //     const res = await fetch(`/api/apps/${appId}/founder-story`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ url: formData.founderUrl }),
    //     });
    //     if (!res.ok) {
    //       const j = await res.json().catch(()=>({}));
    //       // show error to user (but blog already created) — handle with toast
    //       console.error("Founder story Failed", j);
    //     } else {
    //       // success: show pending state toast
    //     }
    //   }
  
    //   // success UI
    //   console.log("Blog + founder story submitted");
    // } catch (err) {
    //   console.error(err);
    // }
  };
  
  
  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Submit Your Blog
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            ...getGlassStyles(theme),
            boxShadow: getShadow(theme, "elegant"),
            minHeight: 500,
          }}
        >
          {activeStep === 0 && (
            <StepMetadata formData={formData} setFormData={handleFormDataChange} />


          )}
          {activeStep === 1 && (
           
            <StepEditor formData={formData} setFormData={handleFormDataChange} />
          )}
          {activeStep === 2 && (
    <StepReview metadata={formData} content={formData.content} />
)}
        </Paper>

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
  variant="contained"
  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
>
  {activeStep === steps.length - 1 ? "Submit" : "Next"}
</Button>




        </Box>
      </Container>
    </Box>
  );
}
