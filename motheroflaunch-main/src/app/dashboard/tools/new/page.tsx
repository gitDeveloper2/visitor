"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

import { Control, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createToolFormSchema, ToolFormData } from "@features/tools/schemas/Tools";
import StepBasicInfo from "@features/tools/components/toolform/StepBasicInfo";
import StepDetailsMedia from "@features/tools/components/toolform/StepDetailsMedia";
import StepLinksSubmit from "@features/tools/components/toolform/StepLinksSubmit";
import { uploadToCloudinary } from "@features/shared/utils/cloudinary";
import { authClient } from "../../../../../auth-client";
import StepFeaturesPricing from "@features/tools/components/toolform/StepFeaturesPricing";
import { useSearchParams } from "next/navigation";
import CustomDayPicker from "@features/booking/components/LaunchCalenda.";

const steps = ["Basic Info", "Details & Media", "Links", "Features & Pricing", "Submit"];

export default function NewToolPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
const [submittedToolId, setSubmittedToolId] = useState<string | null>(null);

  const router = useRouter();

  const searchParams = useSearchParams();
const toolId = searchParams.get("toolId");
  const { data: session} = authClient.useSession();

  const [activeStep, setActiveStep] = useState(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([]);

// Infer the correct TypeScript type directly from the schema

const methods = useForm<ToolFormData>({
  resolver: zodResolver(createToolFormSchema),
  defaultValues: {
    name: "",
    slug: "",
    tagline: "",
    description: "",
    category: "other",
    websiteUrl: "",
    logo: undefined,
    screenshots: [],
    tags: "",
    platforms: [],
    status: "upcoming",
    launchDate: undefined,
    pricing: [],
    features: [],
  },
});

const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting, touchedFields },
  control,
  trigger,
  getValues,
  setValue,
} = methods;


const [initialValues, setInitialValues] = useState<ToolFormData | null>(null);
const [loading, setLoading] = useState(!!toolId);
const [existingScreenshots, setExistingScreenshots] = useState<
  { url: string; public_id?: string }[]
>([]);

const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

useEffect(() => {
  if (!toolId) return;

  const loadTool = async () => {
    try {
      const res = await fetch(`/api/tools/${toolId}`);
      const data = await res.json();

      if (res.ok) {
        if (data.launchDate) {
          data.launchDate = new Date(data.launchDate).toISOString().slice(0, 10);
        }

        // ✅ This will prefill all form fields
        reset(data);

        // ✅ Set existing screenshots for preview
        if (Array.isArray(data.screenshots)) {
          setExistingScreenshots(data.screenshots);
        }

        // ✅ Make sure logo is inside the expected format
        // so getValues("logo.url") works later
        if (data.logo && typeof data.logo.url === "string") {
          setValue("logo", {
            url: data.logo.url,
            public_id: data.logo.public_id,
          });
        }
      } else {
        console.error("Failed to fetch tool", data);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  loadTool();
}, [toolId, reset, setValue]);



  
if (!session) {
  return <div>Loading...</div>;
}

if (!session.user?.id) {
  return <div>You must be signed in to submit a tool.</div>;
}

  const next = async () => {
    let currentStepFields: (keyof ToolFormData)[] = [];

    if (activeStep === 0) {
      currentStepFields = ["name", "slug", "tagline"];
    } else if (activeStep === 1) {
      currentStepFields = ["description", "logo", "screenshots"];
    } else if (activeStep === 2) {
      currentStepFields = ["websiteUrl", "tags", "platforms"];
    }else if (activeStep === 3) {
      currentStepFields = ["features", "pricing"];
    }
    

    const isValid = await trigger(currentStepFields);
    if (isValid && activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (activeStep > 0) {
      setActiveStep((s) => s - 1);
    }
  };

  /**
   * On final submit, transform comma‐separated values into arrays,
   * inject ownerId from the session, then POST to /tools.
   */
  const onSubmit = async (data: ToolFormData) => {
    const uploadedAssets: string[] = [];
  // ✅ Automatically clean old logo if user uploaded a new one
const previousLogo = getValues("logo");
if (logoFile && previousLogo?.public_id) {
  removedPublicIds.push(previousLogo.public_id);
}

    try {
      // Upload logo and screenshots concurrently
      const uploadPromises: Promise<any>[] = [];
  
      if (logoFile) {
        uploadPromises.push(uploadToCloudinary(logoFile));
      }
  
      for (const file of screenshotFiles) {
        uploadPromises.push(uploadToCloudinary(file));
      }
  
      const uploadResults = await Promise.all(uploadPromises);
  console.log(uploadResults)
      // Extract uploaded assets
      const [logoResult, ...screenshotResults] = logoFile ? uploadResults : [undefined, ...uploadResults];
  

      // Validate all uploads
      const allUploadsValid = uploadResults.every(res => res?.public_id);
      if (!allUploadsValid) throw new Error("One or more uploads failed.");
  
      // Track all public_ids for cleanup if needed
      uploadedAssets.push(
        ...uploadResults.map((res) => res.public_id).filter(Boolean)
      );
  
      // Submit tool to backend
      const payload = {
        name: data.name,
        slug: data.slug,
        tagline: data.tagline || "",
        description: data.description,
        category: data.category || "",
        websiteUrl: data.websiteUrl,
        logo: logoResult,
        screenshots: [...existingScreenshots, ...screenshotResults],
        tags: data.tags,
        platforms: data.platforms || [],
        status: "upcoming",
        launchDate: data.launchDate,
        pricing: data.pricing,
        features: data.features,
        ownerId: session?.user?.id,
      };
      
  
      const method = toolId ? "PATCH" : "POST";
      const endpoint = toolId ? `/api/tools/${toolId}` : "/api/tools";
      
      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      
  
      if (!res.ok) {
        throw new Error("Failed to create tool.");
      }
      const created = await res.json();
      
          // ✅ Clean up removed assets even on success
    if (removedPublicIds.length > 0) {
      console.log("Cleaning up removed assets:", removedPublicIds);
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_ids: removedPublicIds }),
      });
    }setHasSubmitted(true);
    setSubmittedToolId(created._id); // From the response
    
      // router.push(`/${created.slug}`);
    } catch (err) {
      console.error(err);
      alert("Upload or submission failed. Cleaning up uploaded files...");
  
      // Clean up successful uploads
      if (removedPublicIds.length > 0) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_ids: removedPublicIds }),
        });
      }
      
    }
  };
  
  

  return (
    <FormProvider {...methods}>
    <Box p={{ xs: 2, md: 4 }} maxWidth="md" mx="auto">
     <Typography variant="h4" mb={3}>
  {toolId ? "Edit Tool" : "Add a New Tool"}
</Typography>

     
      {Object.entries(errors).map(([k, v]) => (
  <div key={k}>{k}: {(v as any)?.message}</div>
))}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card variant="outlined">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/** ── STEP 0: BASIC INFO ──────────────────────────────────────────────── */}
              {activeStep === 0 && (
                <>
                 <StepBasicInfo register={register} errors={errors} />
                </>
              )}

              {/** ── STEP 1: DETAILS & MEDIA ─────────────────────────────────────────── */}
              {activeStep === 1 && (
            <StepDetailsMedia
            register={register}
            errors={errors}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            screenshotFiles={screenshotFiles}
            setScreenshotFiles={setScreenshotFiles}
            existingScreenshots={existingScreenshots}
            setExistingScreenshots={setExistingScreenshots}
            setRemovedPublicIds={setRemovedPublicIds}
          />
          
                
                     

                
              )}
{activeStep === 3 && (
  <StepFeaturesPricing />

)}

              {/** ── STEP 2: LINKS & SUBMIT ──────────────────────────────────────────── */}
              {activeStep === 2 && (
         <StepLinksSubmit
         register={register}
         errors={errors}
         touchedFields={touchedFields as Partial<Record<keyof ToolFormData, boolean>>}
         control={control}
       />
       
        
              )}  

              {/** ── NAVIGATION BUTTONS ──────────────────────────────────────────────── */}
              <Grid size={{ xs: 12 }} display="flex" justifyContent="space-between">
                {activeStep > 0 && (
                  <Button onClick={prev} variant="outlined">
                    Back
                  </Button>
                )}

                {activeStep < steps.length - 1 ? (
                  <Button onClick={next} variant="contained">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Tool"}
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
          {hasSubmitted && submittedToolId && (
  <Box mt={4}>
    <Typography variant="h6" color="primary">
      🎉 Tool submitted successfully!
    </Typography>
    <Typography variant="body1" mb={2}>
      Now select your preferred launch date below.
    </Typography>

    <CustomDayPicker
      value={undefined}
      onChange={async (date) => {
        if (!date) return;

        const formatted = date.toISOString().split("T")[0];
        try {
          const res = await fetch(`/api/tools/${submittedToolId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ launchDate: formatted }),
          });

          if (!res.ok) throw new Error("Failed to save launch date");

          alert("Launch date reserved successfully!");
        } catch (err) {
          alert((err as Error)?.message || "Could not reserve date.");
        }
      }}
      productId={submittedToolId}
    />
  </Box>
)}

        </CardContent>
      </Card>
    </Box>
    </FormProvider>
  );
}
