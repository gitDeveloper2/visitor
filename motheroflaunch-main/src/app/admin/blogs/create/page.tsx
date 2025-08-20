'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Step, StepLabel, Stepper } from '@mui/material';

import StepBasics from '@features/blog/components/steps/StepBasics';
import StepMetadata from '@features/blog/components/steps/StepMetadata';
import StepContentPortal from '@features/blog/components/steps/StepContentPortal';
import StepContent from '@features/blog/components/steps/StepContent';
import StepReview from '@features/blog/components/steps/StepReview';
import { EditorHandle } from '@features/blog/components/App';
import { BlogFormProvider } from '@features/blog/providers/BlogFormProvider';
import _ from 'lodash';

const steps = ['Basic Info', 'Metadata', 'Content', 'Review'];

function CreateBlogStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const { reset, getValues } = useFormContext();
  const editorRef = useRef<EditorHandle>(null);

  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  // 👉 Fetch and populate draft if editing
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const lastSavedDataRef = useRef<any>(null);

  useEffect(() => {
    if (!draftId) return;
  
    async function loadDraft() {
      const res = await fetch(`/api/blogs/${draftId}`);
      const blog = await res.json();
  
      reset({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        tags: blog.tags,
        tool: blog.tool,
        coverImage: blog.coverImage,
        _id: blog._id,
        originalBlogId: blog.originalBlogId,
        step: blog.step ?? 0,
      });
  
      setActiveStep(blog.step ?? 0);
      setInitialContent(blog.content);
  
      lastSavedDataRef.current = extractComparableFields(blog);
      console.log('💾 Initial draft loaded and snapshot stored:', lastSavedDataRef.current);
    }
  
    loadDraft();
  }, [draftId, reset]);
  

  
  async function saveDraft(contentOverride?: string) {
    const values = getValues();
  
    const payload = extractComparableFields({
      ...values,
      content: contentOverride ?? values.content,
    });
  
    const isExisting = Boolean(values._id);
    const lastSaved = lastSavedDataRef.current;
  
    // 🛑 Skip save on first run or invalid state
    if (!lastSaved) {
      lastSavedDataRef.current = payload;
      console.log('🧠 Skipping first save — stored baseline snapshot:', payload);
      return;
    }
  
    // 🛡️ Protection: React Hook Form reset might not fully sync
    const isEqual = _.isEqual(payload, lastSaved);
    if (isEqual) {
      console.log('⏩ Skipping save — no changes detected');
      return;
    }
  
    console.log('💡 Changes detected. Saving draft...');
    console.log('🆕 Payload:', payload);
    console.log('📦 Previous:', lastSaved);
  
    const res = await fetch(isExisting ? `/api/blogs/${values._id}` : '/api/blogs', {
      method: isExisting ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      console.error('❌ Failed to save blog');
      return;
    }
  
    const saved = await res.json();
    console.log('✅ Draft saved:', saved);
  
    lastSavedDataRef.current = payload;
  
    // Ensure form has updated ID
    if (!isExisting) {
      reset({ ...values, _id: saved._id });
      console.log('🆔 New blog ID saved into form state:', saved._id);
    }
  }
  
  
  
  
  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={activeStep > index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && <StepBasics
  onNext={async () => {
    await saveDraft(); // saves all non-editor fields
    setActiveStep(1);
  }}
/>}
        {activeStep === 1 && (
        <StepMetadata
        onNext={async () => {
          await saveDraft(); // again, saves updated metadata
          setActiveStep(2);
        }}
        onBack={() => setActiveStep(0)}
      />
      
        )}
        {activeStep === 2 && (
          <StepContentPortal
          onBack={async () => {
            const html = await editorRef.current?.getHtmlContent();
            if (html) {
              const current = getValues();
              reset({ ...current, content: html });
            }
          
            setActiveStep(1);
          }}
          
            onSave={async () => {
              const html = await editorRef.current?.getHtmlContent();
              if (!html) return;
              try {
                await saveDraft(html);
              } catch (err) {
                console.error('Save failed', err);
              }
            }}
            
            onNext={async () => {
              const html = await editorRef.current?.getHtmlContent();
              if (!html) {
                alert('No content found');
                return;
              }
            
              // Save into form values for later use
              const current = getValues();
              reset({ ...current, content: html });
            
              await saveDraft(html); // ✅ Persist the content
            
              setActiveStep(3);
            }}
            
            
            onClose={() => setActiveStep(1)}
          >
<StepContent
  editorRef={editorRef}
  initialHtml={initialContent ?? undefined}
/>
          </StepContentPortal>
        )}
        {activeStep === 3 && (
          <StepReview
            data={getValues()}
            onBack={() => setActiveStep(2)}
            onSubmit={async () => {
              const values = getValues();
const html = values.content;
if (!html) {
  alert("No content available for publishing.");
  return;
}

            
            
              const isExisting = Boolean(values._id);
              const isEditingPublished = Boolean(values.originalBlogId);
            
              const payload = {
                ...values,
                content: html,
                isDraft: false,
                published: true,
              };
            
              try {
                if (isEditingPublished) {
                  // 🧠 Editing an already published blog → update original + delete draft
                  await fetch(`/api/blogs/${values.originalBlogId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
            
                  await fetch(`/api/blogs/${values._id}`, {
                    method: 'DELETE',
                  });
            
                  alert('🎉 Blog updated and published!');
                } else if (isExisting) {
                  // 🧠 Finalize draft → mark as published
                  await fetch(`/api/blogs/${values._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
            
                  alert('✅ Blog published!');
                } else {
                  // 🧠 Unlikely, but fallback for no `_id` present
                  const res = await fetch('/api/blogs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
            
                  if (!res.ok) throw new Error('Failed to create blog');
                  const saved = await res.json();
                  alert('✅ Blog created and published!');
                  reset({ ...values, _id: saved._id });
                }
            
                // Optional: Redirect to dashboard or blog page
              } catch (err) {
                console.error('❌ Failed to submit blog:', err);
                alert('Something went wrong while publishing');
              }
            }}
            
          />
        )}
      </Box>
    </>
  );
}

function extractComparableFields(data: any) {
  return {
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    content: data.content ?? '',
    tags: Array.isArray(data.tags) ? [...data.tags].sort() : [],
    featured: data.featured ?? false,
    paidFeature: data.paidFeature ?? false,
    
  };
}

export default function CreateBlogPage() {
  return (
    <BlogFormProvider>
      <Box sx={{ minWidth: 800, mx: 'auto', mt: 4 }}>
        <CreateBlogStepper />
      </Box>
    </BlogFormProvider>
  );
}


