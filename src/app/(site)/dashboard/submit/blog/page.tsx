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
  Card,
  CardContent,
  Divider,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles } from "../../../../../utils/themeUtils";
import StepMetadata from "./StepMetadata";
import StepEditor from "./StepEditor";
import StepReview from "./StepReview";
import { useState, useEffect, useCallback } from "react";
import PremiumBlogSubscription from "../../../../../components/premium/PremiumBlogSubscription";
import { Clock, AlertTriangle, Check, Star, DollarSign } from "lucide-react";
import { computeBlogQuality, finalizeBlogQualityScore, type BlogQualityBreakdown } from '@/features/ranking/quality';
import { BLOG_QUALITY_CONFIG } from '@/features/ranking/config';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthState } from '@/hooks/useAuth';
import { adRegistry } from '@/app/components/adds/google/AdRegistry';

const steps = ["Blog Info", "Write Blog", "Choose Plan", "Review & Submit"];

function BlogSubmitPageContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { user } = useAuthState();
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    title: "",
    author: "",
    role: "",
    category: "",
    subcategories: [] as string[],
    tags: [] as string[],
    authorBio: "",
    excerpt: "",
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [qualityBreakdown, setQualityBreakdown] = useState<BlogQualityBreakdown | null>(null);
  const [qualityHints, setQualityHints] = useState<string[]>([]);
  const [selectedPremiumPlan, setSelectedPremiumPlan] = useState<string | null>(null);

  // Content limits (adjust as needed)
  const BLOG_LIMITS = {
    titleMin: 5,
    authorBioMin: 30,
    excerptMin: 60,
    contentWordsMin: 900,
    contentWordsMax: 2000,
    tagsMin: 3,
    tagsMax: 8,
  } as const;

  // Debug: Log form data changes
  useEffect(() => {
    console.log('📋 Form data updated:', formData);
  }, [formData]);

  // Live quality analysis (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const contentHtml = formData.content || '';
        const parts = computeBlogQuality(contentHtml, { maxLinks: BLOG_QUALITY_CONFIG.maxLinks });
        const hasImage = Boolean(formData.imageUrl || formData.imageFile);
        const tagsCount = Array.isArray(formData.tags) ? formData.tags.length : 0;
        const breakdown = finalizeBlogQualityScore({
          wordCount: parts.wordCount,
          headingsScore: parts.headingsScore,
          linksScore: parts.linksScore,
          hasImage,
          tagsCount,
        });

        // Derive human hints
        const hints: string[] = [];
        const minW = BLOG_QUALITY_CONFIG.wordIdealMin;
        const maxW = BLOG_QUALITY_CONFIG.wordIdealMax;
        if (parts.wordCount < minW) hints.push(`Add ${minW - parts.wordCount} more words to reach the minimum of ${minW}.`);
        if (parts.wordCount > maxW) hints.push(`Trim ~${parts.wordCount - maxW} words to stay under the maximum of ${maxW}.`);

        // Heading checks
        const hMatches = Array.from(String(contentHtml || '').matchAll(/<h([1-6])[^>]*>/gi));
        let hasH1 = false;
        let lastLevel = 0;
        let badJumps = 0;
        for (const m of hMatches) {
          const level = parseInt(m[1], 10);
          if (level === 1) hasH1 = true;
          if (lastLevel > 0 && level > lastLevel + 1) badJumps += 1;
          lastLevel = level;
        }
        if (!hasH1) hints.push('Add an H1 heading at the top for better structure.');
        if (badJumps > 0) hints.push(`Avoid skipping heading levels (found ${badJumps} jump${badJumps > 1 ? 's' : ''}).`);

        // Links
        const linkCount = (contentHtml.match(/<a\s+[^>]*href=/gi) || []).length;
        if (linkCount > BLOG_QUALITY_CONFIG.maxLinks) {
          hints.push(`Reduce links: ${linkCount}/${BLOG_QUALITY_CONFIG.maxLinks} (soft cap).`);
        }

        // Image
        if (!hasImage) hints.push('Add an image for a small quality boost.');

        // Tags
        if (tagsCount < 3 || tagsCount > 8) hints.push('Use 3–8 relevant tags.');

        setQualityBreakdown(breakdown);
        setQualityHints(hints);
      } catch (e) {
        console.warn('Quality analysis failed:', e);
        setQualityBreakdown(null);
        setQualityHints([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [formData.content, formData.tags, formData.imageFile, formData.imageUrl]);

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
        const formDataToSet: typeof formData = {
          title: draft.title || '',
          author: draft.author || '',
          role: draft.role || '',
          category: draft.category || '',
          subcategories: Array.isArray(draft.subcategories) ? draft.subcategories : [],
          tags: Array.isArray(draft.tags) ? draft.tags : [],
          authorBio: draft.authorBio || '',
          excerpt: draft.excerpt || '',
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

  const validateMetadata = () => {
    const errors: Record<string, string> = {};
    if (!formData.title?.trim()) errors.title = "Title is required";
    else if (formData.title.trim().length < BLOG_LIMITS.titleMin) errors.title = `Title must be at least ${BLOG_LIMITS.titleMin} characters`;
    if (!formData.author?.trim()) errors.author = "Author name is required";
    if (!formData.role?.trim()) errors.role = "Author role is required";
    if (!formData.category?.toString().trim()) errors.category = "Category is required";
    if (!formData.authorBio?.trim()) errors.authorBio = "Author bio is required";
    else if (formData.authorBio.trim().length < BLOG_LIMITS.authorBioMin) errors.authorBio = `Author bio must be at least ${BLOG_LIMITS.authorBioMin} characters`;
    if (!Array.isArray(formData.tags) || formData.tags.length === 0) errors.tags = "At least one tag is required";
    else if (formData.tags.length < BLOG_LIMITS.tagsMin || formData.tags.length > BLOG_LIMITS.tagsMax) errors.tags = `Use between ${BLOG_LIMITS.tagsMin}-${BLOG_LIMITS.tagsMax} tags`;
    if (!formData.excerpt?.trim()) errors.excerpt = "Excerpt is required";
    else if (formData.excerpt.trim().length < BLOG_LIMITS.excerptMin) errors.excerpt = `Excerpt must be at least ${BLOG_LIMITS.excerptMin} characters`;
    if (formData.isFounderStory) {
      const status = formData.founderDomainCheck?.status;
      if (!formData.founderUrl?.trim()) {
        errors.founderUrl = "Founder story URL is required";
      } else if (status === "invalid" || status === "taken") {
        errors.founderUrl = formData.founderDomainCheck?.message || "Invalid founder story URL";
      } else if (status === "checking") {
        errors.founderUrl = "Please wait for domain check to complete";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  const validateContent = () => {
    const errors: Record<string, string> = {};
    const text = stripHtml(formData.content || "").trim();
    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
    if (!text || wordCount < BLOG_LIMITS.contentWordsMin) {
      errors.content = `Please write at least ${BLOG_LIMITS.contentWordsMin} words (current: ${wordCount})`;
    } else if (wordCount > BLOG_LIMITS.contentWordsMax) {
      errors.content = `Please keep the blog under ${BLOG_LIMITS.contentWordsMax} words (current: ${wordCount})`;
    }
    setValidationErrors(prev => ({ ...prev, ...errors }));
    return !errors.content;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateMetadata()) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }
    if (activeStep === 1 && !validateContent()) {
      setError("Please add more content before continuing.");
      return;
    }
    if (activeStep === 1) {
      // Enforce minimum quality before proceeding to review
      if (!qualityBreakdown || qualityBreakdown.total < BLOG_QUALITY_CONFIG.minProceedThreshold) {
        setError(`Please improve quality score to at least ${BLOG_QUALITY_CONFIG.minProceedThreshold.toFixed(2)} to proceed.`);
        return;
      }
    }
    if (activeStep === 2 && !selectedPremiumPlan) {
      setError("Please select a plan before continuing.");
      return;
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    console.log('🔄 Form data change requested:', data);
    console.log('📋 Current form data before change:', formData);
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log('📋 New form data after change:', newData);

      // Optimistically clear validation errors for fields that just became valid
      setValidationErrors((prevErrs) => {
        const nextErrs = { ...prevErrs };

        const stripHtml = (html: string) => {
          const tmp = document.createElement('div');
          tmp.innerHTML = html || '';
          return tmp.textContent || tmp.innerText || '';
        };

        if (Object.prototype.hasOwnProperty.call(data, 'title')) {
          if (newData.title && newData.title.trim().length >= BLOG_LIMITS.titleMin) delete nextErrs.title;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'author')) {
          if (newData.author && newData.author.trim()) delete nextErrs.author;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'role')) {
          if (newData.role && newData.role.trim()) delete nextErrs.role;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'category')) {
          if (newData.category && String(newData.category).trim()) delete nextErrs.category;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'authorBio')) {
          if (newData.authorBio && newData.authorBio.trim().length >= BLOG_LIMITS.authorBioMin) delete nextErrs.authorBio;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'tags') || Object.prototype.hasOwnProperty.call(data as any, 'tagsInput')) {
          const count = Array.isArray(newData.tags) ? newData.tags.length : 0;
          if (count >= BLOG_LIMITS.tagsMin && count <= BLOG_LIMITS.tagsMax) delete nextErrs.tags;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'excerpt')) {
          if (newData.excerpt && newData.excerpt.trim().length >= BLOG_LIMITS.excerptMin) delete nextErrs.excerpt;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'content')) {
          const text = stripHtml(newData.content || '').trim();
          const wc = text ? text.split(/\s+/).filter(Boolean).length : 0;
          if (wc >= BLOG_LIMITS.contentWordsMin && wc <= BLOG_LIMITS.contentWordsMax) delete nextErrs.content;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'founderUrl') || Object.prototype.hasOwnProperty.call(data, 'founderDomainCheck') || Object.prototype.hasOwnProperty.call(data, 'isFounderStory')) {
          const status = newData.founderDomainCheck?.status;
          if (!newData.isFounderStory) {
            delete nextErrs.founderUrl;
          } else if (newData.founderUrl && status === 'ok') {
            delete nextErrs.founderUrl;
          }
        }
        return nextErrs;
      });

      return newData;
    });
  };

  // Prefill author fields from session for new submissions only (do not override drafts/edits)
  useEffect(() => {
    if (!user) return;
    const hasDraftParam = Boolean(searchParams.get('draftId') || searchParams.get('draft'));
    if (hasDraftParam) return; // editing/restoring
    setFormData(prev => ({
      ...prev,
      author: prev.author || (user as any)?.name || "",
      role: prev.role || ((user as any)?.jobTitle || "Author"),
      authorBio: prev.authorBio || (user as any)?.bio || "",
    }));
  }, [user, searchParams]);

  const handleSubmit = async () => {
    // Final validation before submit
    const metaOk = validateMetadata();
    const contentOk = validateContent();
    if (!metaOk) {
      setActiveStep(0);
      setError("Please complete required blog info.");
      return;
    }
    if (!contentOk) {
      setActiveStep(1);
      setError("Please complete the blog content.");
      return;
    }
    if (!selectedPremiumPlan) {
      setActiveStep(2);
      setError("Please select a plan before submitting.");
      return;
    }
    // Block submission if below threshold as a final guard
    if (!qualityBreakdown || qualityBreakdown.total < BLOG_QUALITY_CONFIG.minProceedThreshold) {
      setError(`Quality score must be ≥ ${BLOG_QUALITY_CONFIG.minProceedThreshold.toFixed(2)} before submitting.`);
      setActiveStep(1);
      return;
    }
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
        excerpt: formData.excerpt,
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
      
      const result = await res.json();
      
      // If premium was selected, redirect to checkout
      if (selectedPremiumPlan === 'premium' && result.blog?._id) {
        try {
          const checkoutRes = await fetch("/api/lemonsqueezy/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_BLOG_VARIANT_ID,
              custom: {
                subscription_type: "premium_blog",
                blog_id: result.blog._id,
                blog_title: formData.title,
                return_url: `${window.location.origin}/dashboard/submit/blog?payment_success=true&blog_id=${result.blog._id}`,
              },
            }),
          });

          if (checkoutRes.ok) {
            const { checkoutUrl } = await checkoutRes.json();
            window.location.href = checkoutUrl;
            return;
          } else {
            const errorData = await checkoutRes.json().catch(() => ({}));
            throw new Error(`Failed to create checkout: ${errorData.error || 'Unknown error'}`);
          }
        } catch (checkoutError: any) {
          console.error('Checkout error:', checkoutError);
          setError(`Payment setup failed: ${checkoutError.message}. Your blog was saved but premium features are not active.`);
          setSuccess(true);
          return;
        }
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

      // Sync author profile changes if user edited their author fields
      try {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.author,
            bio: formData.authorBio,
            jobTitle: formData.role,
          })
        });
      } catch (e) {
        console.warn('Failed to sync profile after blog submit', e);
      }
      setActiveStep(0);
      setFormData({
        title: "",
        author: "",
        role: "",
        category: "",
        subcategories: [],
        tags: [],
        authorBio: "",
        excerpt: "",
        content: "",
        isFounderStory: false,
        founderUrl: "",
        founderDomainCheck: { status: "unknown", message: "" },
        imageFile: undefined,
        imageUrl: "",
      });
      setDraftId(null);
      setSelectedPremiumPlan(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumSelection = (plan: string | null) => {
    setSelectedPremiumPlan(plan);
  };

  const premiumFeatures = [
    'Access to all premium blog content',
    'Exclusive founder stories',
    'Early access to new content',
    'Premium community access',
    'Priority support',
    'Cancel anytime',
  ];

  const freeFeatures = [
    'Standard blog listing',
    'Community review process',
    'Basic analytics',
    'Founder story submissions',
  ];
  
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
      <Container maxWidth="lg">
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


        <Box sx={{ display: 'flex', gap: 3 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              ...getGlassStyles(theme),
              boxShadow: getShadow(theme, "elegant"),
              minHeight: 500,
              flex: 1,
            }}
          >
          {activeStep === 0 && (
            <StepMetadata 
              formData={formData as any}
              setFormData={handleFormDataChange}
              errors={{
                title: validationErrors.title,
                author: validationErrors.author,
                role: validationErrors.role,
                category: validationErrors.category,
                authorBio: validationErrors.authorBio,
                founderUrl: validationErrors.founderUrl,
                tags: validationErrors.tags,
                excerpt: validationErrors.excerpt,
              }}
            />
          )}
          {activeStep === 1 && (
            <StepEditor 
              formData={formData} 
              setFormData={handleFormDataChange}
              errorText={validationErrors.content}
              quality={{
                breakdown: qualityBreakdown || undefined,
                hints: qualityHints,
                config: BLOG_QUALITY_CONFIG,
                tagsCount: Array.isArray(formData.tags) ? formData.tags.length : 0,
                linkCap: BLOG_QUALITY_CONFIG.maxLinks,
              }}
            />
          )}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                <DollarSign size={24} color={theme.palette.primary.main} />
                Choose Your Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select how you'd like to submit your blog. Premium plans offer enhanced features and priority processing.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: selectedPremiumPlan === 'premium' ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                      backgroundColor: selectedPremiumPlan === 'premium' ? `${theme.palette.primary.main}08` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: `${theme.palette.primary.main}04`,
                      }
                    }}
                    onClick={() => handlePremiumSelection(selectedPremiumPlan === 'premium' ? null : 'premium')}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        {selectedPremiumPlan === 'premium' && (
                          <Check 
                            size={24} 
                            color={theme.palette.primary.main} 
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Star size={32} color={theme.palette.primary.main} />
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Premium Blog Access
                      </Typography>
                      <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
                        $9.99
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Monthly subscription • Cancel anytime
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ textAlign: 'left' }}>
                        {premiumFeatures.slice(0, 4).map((feature, index) => (
                          <Box key={index} display="flex" alignItems="center" mb={1}>
                            <Check 
                              size={16} 
                              color={theme.palette.success.main} 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" fontSize="0.875rem">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: selectedPremiumPlan === 'free' ? `2px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`,
                      backgroundColor: selectedPremiumPlan === 'free' ? `${theme.palette.success.main}08` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: theme.palette.success.main,
                        backgroundColor: `${theme.palette.success.main}04`,
                      }
                    }}
                    onClick={() => handlePremiumSelection(selectedPremiumPlan === 'free' ? null : 'free')}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        {selectedPremiumPlan === 'free' && (
                          <Check 
                            size={24} 
                            color={theme.palette.success.main} 
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Typography variant="h4" color="success.main">🎉</Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Free Submission
                      </Typography>
                      <Typography variant="h4" fontWeight={800} color="success.main" gutterBottom>
                        $0
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        For founder stories only • No additional cost
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ textAlign: 'left' }}>
                        {freeFeatures.map((feature, index) => (
                          <Box key={index} display="flex" alignItems="center" mb={1}>
                            <Check 
                              size={16} 
                              color={theme.palette.success.main} 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" fontSize="0.875rem">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {selectedPremiumPlan === 'premium' && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: `${theme.palette.primary.main}08`, borderRadius: 2, border: `1px solid ${theme.palette.primary.main}20` }}>
                  <Typography variant="body2" color="primary" fontWeight={500}>
                    ⭐ Premium selected! You'll be redirected to payment after submission.
                  </Typography>
                </Box>
              )}
              
              {selectedPremiumPlan === 'free' && !formData.isFounderStory && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: `${theme.palette.warning.main}08`, borderRadius: 2, border: `1px solid ${theme.palette.warning.main}20` }}>
                  <Typography variant="body2" color="warning.main" fontWeight={500}>
                    ⚠️ Free submissions are only available for founder stories. Please go back to step 1 and check "This submission is a Founder Story".
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 3, p: 2, backgroundColor: `${theme.palette.info.main}08`, borderRadius: 2, border: `1px solid ${theme.palette.info.main}20` }}>
                <Typography variant="body2" color="info.main" fontWeight={500} gutterBottom>
                  💡 Having payment issues?
                </Typography>
                <Typography variant="body2" color="info.main">
                  If you've already paid but your premium access isn't working, you can{' '}
                  <Link href="/dashboard/payment-verification" style={{ color: theme.palette.info.main, textDecoration: 'underline' }}>
                    verify your payment status here
                  </Link>
                  .
                </Typography>
              </Box>
            </Box>
          )}
          {activeStep === 3 && (
            <>
              {/* Show countdown timer if editing a draft */}
              {draftExpiryDate && <DraftCountdownTimer />}
              
              <StepReview metadata={formData} content={formData.content} qualityBreakdown={qualityBreakdown || undefined} />
              
              <Box mt={4}>
                <Alert severity="info">
                  <Typography variant="body2">
                    {selectedPremiumPlan === 'premium' 
                      ? "✅ Premium plan selected! You'll be redirected to payment after submission."
                      : selectedPremiumPlan === 'free' && formData.isFounderStory
                      ? "✅ Free submission selected for founder story."
                      : "Please review your blog before submitting."
                    }
                  </Typography>
                </Alert>
              </Box>
            </>
          )}
        </Paper>
        

      </Box>
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
            disabled={loading || (activeStep === steps.length - 1 && !selectedPremiumPlan)}
            sx={{
              backgroundColor: activeStep === steps.length - 1 && !selectedPremiumPlan ? 'grey.400' : undefined
            }}
          >
            {loading ? "Submitting..." : 
             activeStep === steps.length - 1 ? 
               (selectedPremiumPlan ? "Submit Blog" : "Select Plan First") : 
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
