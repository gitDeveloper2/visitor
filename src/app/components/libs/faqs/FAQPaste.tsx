import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { FAQ } from '../faqReducer';

interface FAQPasteProps {
  onPaste: (faqs: FAQ[]) => void;
}

const FAQPaste: React.FC<FAQPasteProps> = ({ onPaste }) => {
  const [pasteText, setPasteText] = useState('');

  const handlePaste = () => {
    try {
      const pastedArray = JSON.parse(pasteText);
      if (Array.isArray(pastedArray)) {
        const formattedFAQs = pastedArray.map((item, index) => ({
          id: `faq-${Date.now()}-${index}`,
          question: item.question || '',
          answer: item.answer || '',
        }));
        onPaste(formattedFAQs);
      } else {
        alert('The pasted content is not a valid array.');
      }
    } catch {
      alert('Error parsing the pasted array.');
    }
  };

  return (
    <Box mt={4}>
      <TextField
        label="Paste FAQ Array"
        value={pasteText}
        onChange={(e) => setPasteText(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <Button onClick={handlePaste} variant="outlined" fullWidth>
        Load FAQs from Pasted Array
      </Button>
    </Box>
  );
};

export default FAQPaste;
