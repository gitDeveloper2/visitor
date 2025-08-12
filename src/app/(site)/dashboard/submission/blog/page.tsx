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
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles } from "../../../../../utils/themeUtils";
import StepMetadata from "./StepMetadata";
import StepEditor from "./StepEditor";
import StepReview from "./StepReview";
import { useState, useEffect } from "react";
import PremiumBlogSubscription from "../../../../../components/premium/PremiumBlogSubscription";

import { useSearchParams } from 'next/navigation';

const steps = ["Blog Info", "Write Blog", "Review & Submit"];

export default function BlogSubmitPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    title: "",
    author: "",
    role: "",
    tags: "",
    authorBio: "",
    content: "",
    isFounderStory: false,
    founderUrl: "",
    founderDomainCheck: { status: "unknown", message: "" } as {
      status: "unknown" | "checking" | "ok" | "taken" | "invalid";
      message?: string;
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Debug: Log form data changes
  useEffect(() => {
    console.log('📋 Form data updated:', formData);
  }, [formData]);

  // Check if user is returning from payment with a draft ID
  useEffect(() => {
    const draftIdParam = searchParams.get('draftId');
    const paymentSuccess = searchParams.get('payment_success');
    
    console.log('🔍 URL params detected:', { draftIdParam, paymentSuccess });
    
    if (draftIdParam) {
      console.log('📝 Draft ID found in URL, initiating restoration...');
      if (paymentSuccess === 'true') {
        // User returned from successful payment, restore their draft
        console.log('💳 Payment success detected, restoring draft...');
        restoreDraft(draftIdParam);
      } else {
        // User clicked "Continue Writing" on a draft, restore it
        console.log('✏️ Continue Writing detected, restoring draft...');
        restoreDraft(draftIdParam);
      }
    } else {
      console.log('📝 No draft ID in URL');
    }
  }, [searchParams]);

  // Check if user has premium access
  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const res = await fetch('/api/user-blogs/check-premium');
      if (res.ok) {
        const { hasPremium } = await res.json();
        setIsPremiumUser(hasPremium);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const restoreDraft = async (draftId: string) => {
    try {
      console.log('🔄 Restoring draft with ID:', draftId);
      const res = await fetch(`/api/user-blogs/draft/${draftId}`);
      if (res.ok) {
        const draft = await res.json();
        console.log('📝 Draft data received:', draft);
        
        // Map draft data to form structure
        const formDataToSet = {
          title: draft.title || '',
          author: draft.author || '',
          role: draft.role || '',
          tags: Array.isArray(draft.tags) ? draft.tags.join(', ') : draft.tags || '',
          authorBio: draft.authorBio || '',
          content: draft.content || '',
          isFounderStory: draft.isFounderStory || false,
          founderUrl: draft.founderUrl || '',
          founderDomainCheck: draft.founderDomainCheck || { status: "unknown", message: "" },
        };
        
        console.log('📋 Setting form data:', formDataToSet);
        setFormData(formDataToSet);
        setDraftId(draft._id || draftId);
        
        // If draft is premium-ready, user can submit directly
        if (draft.premiumReady) {
          setIsPremiumUser(true);
        }
        
        setActiveStep(2); // Go to review step
        setError(null);
        
        console.log('✅ Draft restored successfully');
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ Failed to restore draft:', errorData);
        setError(`Failed to restore draft: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error restoring draft:', error);
      setError('Failed to restore your draft. Please try again.');
    }
  };

  const saveDraft = async () => {
    try {
      const res = await fetch('/api/user-blogs/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const { draftId: newDraftId } = await res.json();
        setDraftId(newDraftId);
        return newDraftId;
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
    return null;
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    console.log('🔄 Form data change requested:', data);
    console.log('📋 Current form data before change:', formData);
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log('📋 New form data after change:', newData);
      return newData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isInternal: formData.isFounderStory || false,
        // Additional metadata fields
        author: formData.author,
        role: formData.role,
        authorBio: formData.authorBio,
        founderUrl: formData.founderUrl,
        isFounderStory: formData.isFounderStory,
      };

      const res = await fetch("/api/user-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Could not save blog");
      }

      // If there was a draft, clean it up
      if (draftId) {
        try {
          await fetch(`/api/user-blogs/draft/${draftId}`, { method: 'DELETE' });
        } catch (error) {
          console.error('Error cleaning up draft:', error);
        }
      }

      setSuccess(true);
      setActiveStep(0);
      setFormData({
        title: "",
        author: "",
        role: "",
        tags: "",
        authorBio: "",
        content: "",
        isFounderStory: false,
        founderUrl: "",
        founderDomainCheck: { status: "unknown", message: "" },
      });
      setDraftId(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumSubscribe = async (variantId: string) => {
    console.log('🚀 Starting premium subscription flow for variant:', variantId);
    
    // Save draft before redirecting to payment
    const savedDraftId = await saveDraft();
    
    if (savedDraftId) {
      console.log('📝 Draft saved successfully with ID:', savedDraftId);
      
      // Redirect to payment with draft ID in custom data
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          custom: {
            subscription_type: "premium_blog",
            draft_id: savedDraftId,
            return_url: `${window.location.origin}/dashboard/submission/blog?draftId=${savedDraftId}&payment_success=true`,
          },
        }),
      });

      if (res.ok) {
        const { checkoutUrl } = await res.json();
        console.log('💳 Redirecting to checkout:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ Checkout creation failed:', errorData);
        setError(`Failed to create checkout: ${errorData.error || 'Unknown error'}`);
      }
    } else {
      console.error('❌ Failed to save draft');
      setError('Failed to save your draft. Please try again.');
    }
  };
  
  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Submit Your Blog
          </Typography>
          {error && <Typography color="error" align="center">{error}</Typography>}
          {success && <Typography color="success.main" align="center">Blog submitted successfully!</Typography>}
          
          {/* Debug: Test draft restoration */}
          {draftId && (
            <Button 
              variant="outlined" 
              onClick={() => {
                console.log('🧪 Testing draft restoration for:', draftId);
                restoreDraft(draftId);
              }}
              size="small"
            >
              🧪 Test Restore Draft
            </Button>
          )}
        </Box>
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
            <>
              <StepReview metadata={formData} content={formData.content} />
              {!formData.isFounderStory && !isPremiumUser && (
                <Box mt={4}>
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      ⚠️ Premium Blog Access Required
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Publishing non-Founder Story submissions requires an active Premium Blog subscription.
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      To submit this blog, either:
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                      <li>Check "This submission is a Founder Story" in step 1, OR</li>
                      <li>Subscribe to Premium Blog Access below</li>
                    </Box>
                  </Alert>
                  
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setActiveStep(0)}
                      sx={{ mr: 2 }}
                    >
                      ← Go Back to Step 1 (Change Founder Story Setting)
                    </Button>
                  </Box>
                  
                  <PremiumBlogSubscription onSubscribe={handlePremiumSubscribe} />
                </Box>
              )}
              {formData.isFounderStory && (
                <Box mt={4}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      ✅ Founder Story detected! This submission will be free and doesn't require premium access.
                    </Typography>
                  </Alert>
                </Box>
              )}
              {!formData.isFounderStory && isPremiumUser && (
                <Box mt={4}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      ✅ Premium access confirmed! You can submit this blog.
                    </Typography>
                  </Alert>
                </Box>
              )}
            </>
          )}
        </Paper>
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={loading || (activeStep === steps.length - 1 && !formData.isFounderStory && !isPremiumUser)}
            sx={{
              backgroundColor: activeStep === steps.length - 1 && !formData.isFounderStory && !isPremiumUser ? 'grey.400' : undefined
            }}
          >
            {loading ? "Submitting..." : 
             activeStep === steps.length - 1 ? 
               (formData.isFounderStory || isPremiumUser ? "Submit Blog" : "Premium Required") : 
               "Next"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
