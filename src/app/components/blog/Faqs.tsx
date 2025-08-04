import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FAQ } from '@components/libs/faqReducer';

interface FAQProps {
  faqData: FAQ[];
}

const SemanticFAQComponent: React.FC<FAQProps> = ({ faqData }) => {
  if (!faqData || faqData.length === 0) {
    return null; // If faqData is empty or undefined, render nothing
  }
  return (
    <section>
      
      <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
  Frequently Asked Questions
</Typography>
      {faqData.map((faq) => (
        <Accordion
          key={faq.id}
          sx={{
            marginBottom: 3,
            borderRadius: '8px',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6, // Slight shadow on hover for better interactivity
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${faq.id}-content`}
            id={`panel-${faq.id}-header`}
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
              padding: '12px 16px', // Increased padding for a better clickable area
            }}
          >
            <Typography component={'h3'} variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              {faq.question}
            </Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              backgroundColor: '#fafafa',
              padding: '16px',
              borderTop: '1px solid #ddd', // Adds separation between the question and the answer
            }}
          >
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6 }}>
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </section>
  );
};

export default SemanticFAQComponent;
