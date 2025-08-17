"use client";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

import React, { Suspense } from "react";
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
import { useState, useEffect, useCallback } from "react";
import PremiumBlogSubscription from "../../../../../components/premium/PremiumBlogSubscription";
import { Clock, AlertTriangle } from "lucide-react";

import { useSearchParams } from 'next/navigation';

const steps = ["Blog Info", "Write Blog", "Review & Submit"];

function BlogSubmitPageContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    title: "",
    author: "",
    role: "",
    category: "",
    tags: [] as string[],
    authorBio: "",
    content: "",
    isFounderStory: false,
    founderUrl: "",
    founderDomainCheck: { status: "unknown", message: "" } as {
      status: "unknown" | "checking" | "ok" | "taken" | "invalid";
      message?: string;
    },
    imageFile: undefined as any,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [draftExpiryDate, setDraftExpiryDate] = useState<Date | null>(null);

  // Debug: Log form data changes
  useEffect(() => {
    console.log('📋 Form data updated:', formData);
  }, [formData]);

  // Check if user is returning from payment with a draft ID or continuing editing
  useEffect(() => {
    const draftIdParam = searchParams.get('draftId');
    const draftParam = searchParams.get('draft');
    const paymentSuccess = searchParams.get('payment_success');
    
    console.log('🔍 URL params detected:', { draftIdParam, draftParam, paymentSuccess });
    
    // Use either draftId (from payment return) or draft (from continue editing)
    const draftId = draftIdParam || draftParam;
    
    if (draftId) {
      console.log('📝 Draft ID found in URL, initiating restoration...');
      if (paymentSuccess === 'true') {
        // User returned from successful payment, restore their draft
        console.log('💳 Payment success detected, restoring draft...');
        restoreDraft(draftId);
      } else {
        // User clicked "Continue Writing" on a draft, restore it
        console.log('✏️ Continue Writing detected, restoring draft...');
        restoreDraft(draftId);
      }
    } else {
      console.log('📝 No draft ID in URL');
    }
  }, [searchParams]);

  // Debug: Log when draftId changes
  useEffect(() => {
    console.log('📝 Draft ID updated:', draftId);
  }, [draftId]);

  const restoreDraft = useCallback(async (draftId: string) => {
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
          category: draft.category || '',
          tags: Array.isArray(draft.tags) ? draft.tags : [],
          authorBio: draft.authorBio || '',
          content: draft.content || '',
          isFounderStory: draft.isFounderStory || false,
          founderUrl: draft.founderUrl || '',
          founderDomainCheck: draft.founderDomainCheck || { status: "unknown", message: "" },
          imageFile: draft.imageFile || undefined,
          imageUrl: draft.imageUrl || '',
        };
        
        console.log('📋 Setting form data:', formDataToSet);
        console.log('📋 Current form data before update:', formData);
        setFormData(formDataToSet);
        console.log('📋 Form data state updated, new value should be:', formDataToSet);
        setDraftId(draft._id || draftId);
        
        // Calculate draft expiry date
        if (draft.createdAt) {
          const createdAt = new Date(draft.createdAt);
          const expiryDate = new Date(createdAt.getTime() + (7 * 24 * 60 * 60 * 1000));
          setDraftExpiryDate(expiryDate);
        }
        
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
  }, []);

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
      // First, upload image if present
      let imageUrl = "";
      let imagePublicId = "";
      
      if (formData.imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', formData.imageFile.file);
        
        const imageRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: formDataImage,
        });
        
        if (imageRes.status === 503) {
          // Image upload service not configured, continue without image
          console.warn('Image upload service not configured, proceeding without image');
        } else if (!imageRes.ok) {
          throw new Error('Failed to upload image');
        } else {
          const imageData = await imageRes.json();
          imageUrl = imageData.url;
          imagePublicId = imageData.publicId;
        }
      }

      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        isInternal: formData.isFounderStory || false,
        // Additional metadata fields
        author: formData.author,
        role: formData.role,
        authorBio: formData.authorBio,
        founderUrl: formData.founderUrl,
        isFounderStory: formData.isFounderStory,
        imageUrl,
        imagePublicId,
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
        category: "",
        tags: [],
        authorBio: "",
        content: "",
        isFounderStory: false,
        founderUrl: "",
        founderDomainCheck: { status: "unknown", message: "" },
        imageFile: undefined,
        imageUrl: "",
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
  
  // Draft countdown timer component
  const DraftCountdownTimer = () => {
    const [remainingTime, setRemainingTime] = useState<{
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
      if (!draftExpiryDate) return;

      const calculateRemainingTime = () => {
        const now = new Date().getTime();
        const expiry = draftExpiryDate.getTime();
        const difference = expiry - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setRemainingTime({ days, hours, minutes, seconds });
        } else {
          setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      calculateRemainingTime();
      const timer = setInterval(calculateRemainingTime, 1000);

      return () => clearInterval(timer);
    }, [draftExpiryDate]);

    if (!draftExpiryDate) return null;

    const isExpired = remainingTime.days === 0 && remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds === 0;
    const isExpiringSoon = remainingTime.days === 0 && remainingTime.hours < 24;

    if (isExpired) {
      return (
        <Alert severity="error" icon={<AlertTriangle />} sx={{ mb: 2 }}>
          <Typography variant="body2">
            ⚠️ This draft has expired and can no longer be used. Please create a new blog submission.
          </Typography>
        </Alert>
      );
    }

    return (
      <Alert 
        severity={isExpiringSoon ? "warning" : "info"} 
        icon={<Clock />} 
        sx={{ mb: 2 }}
      >
        <Typography variant="body2">
          ⏰ <strong>Draft expires in:</strong> {remainingTime.days > 0 && `${remainingTime.days}d `}
          {remainingTime.hours.toString().padStart(2, '0')}h {remainingTime.minutes.toString().padStart(2, '0')}m {remainingTime.seconds.toString().padStart(2, '0')}s
          {isExpiringSoon && ' - Complete your submission soon!'}
        </Typography>
      </Alert>
    );
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
          
          {/* Debug: Show current form data */}
          <Box sx={{ fontSize: '12px', color: 'text.secondary', maxWidth: 200 }}>
            <div>Title: {formData.title || 'empty'}</div>
            <div>Author: {formData.author || 'empty'}</div>
            <div>Content length: {formData.content?.length || 0}</div>
            <div>Draft ID: {draftId || 'none'}</div>
          </Box>
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
              {/* Show countdown timer if editing a draft */}
              {draftExpiryDate && <DraftCountdownTimer />}
              
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

export default function BlogSubmitPage() {
  return (
    <Suspense fallback={<div />}>
      <BlogSubmitPageContent />
    </Suspense>
  );
}
