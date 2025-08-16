"use client"; // Mark this file as a client component

import { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { useForm, SubmitHandler, Controller, FormProvider } from "react-hook-form";
import { FormData } from "./types";
import DomainFlagsSection from "./DomainFlagsSection";
import ImageSection from "./ImageSection";
import MainContentSection from "./MainContentSection";
import SeoRelatedSection from "./SeoRelatedSection";


async function handleFormSubmission(formData: FormData, authHeader: string) {
  try {
    const isNews=formData.news
    const api=isNews?"news":"articles"
    const relatedPages = formData.relatedPages
    ? formData.relatedPages.split(',').map(item => item.trim())
    : [];

    const dataToSend = {
      ...formData,
      relatedPages, // Include the converted array
    };
    const response = await fetch(`/api/${api}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: authHeader, // Include basic auth header
      },
      body: JSON.stringify(dataToSend),
    });

    // Ensure response is parsed as JSON
    const result = await response.json();

    if (!response.ok) {
      // If the response is not ok, throw an error with the message
      throw new Error(result.message || "Something went wrong");
    }

    return {
      message: result.message,
      id: result.id,
      insertedDocument: result.insertedDocument,
    };
  } catch (error) {
    return {
      message: (error as Error).message,
      error: (error as Error).message,
    };
  }
}

export default function Page() {
  
  const methods = useForm<FormData>({
    defaultValues:{
      isPublished:true
    }
  });
  const { handleSubmit,control, reset, formState: { isSubmitting, isSubmitSuccessful, errors } } = methods;

  const [authHeader, setAuthHeader] = useState<string>("");
  const [result, setResult] = useState<{
    message: string;
    id?: string;
    error?: string;
  }>({ message: "" });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {


    const result = await handleFormSubmission(formData, authHeader);
    setResult(result);
    if (result.message === "Content inserted successfully") {
      reset(); // Reset the form if submission is successful
    }
  };

  return (
    <FormProvider {...methods}>
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Submit Your Data
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        sx={{ mt: 2 }}
      >
     
       <DomainFlagsSection control={control} errors={errors}/>
       


       <MainContentSection control={control} errors={errors} />
<SeoRelatedSection control={control} errors={errors}/>

<ImageSection control={control} errors={errors} />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
      {result.message && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color={result.error ? "error" : "success"}>
            {result.message}
          </Typography>
          {result.id && (
            <Typography variant="body1">
              Inserted Document ID: {result.id}
            </Typography>
          )}
          {result.error && (
            <Typography variant="body1" color="error">
              Error: {result.error}
            </Typography>
          )}
        </Box>
      )}
    </Container>
    </FormProvider>
  );
}
