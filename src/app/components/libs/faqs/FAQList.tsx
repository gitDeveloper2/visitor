import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FAQ } from '../faqReducer';

interface FAQListProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
}

const FAQList: React.FC<FAQListProps> = ({ faqs, onEdit, onDelete }) => (
  <Box mt={4}>
    {faqs.map((faq) => (
      <Box key={faq.id} mb={2} display="flex" alignItems="center">
        <Box flex={1}>
          <Typography variant="h6">{faq.question}</Typography>
          <Typography variant="body2">{faq.answer}</Typography>
        </Box>
        <IconButton onClick={() => onEdit(faq)} color="primary">
          Edit
        </IconButton>
        <IconButton onClick={() => onDelete(faq.id)} color="secondary">
          <DeleteIcon />
        </IconButton>
      </Box>
    ))}
  </Box>
);

export default FAQList;
