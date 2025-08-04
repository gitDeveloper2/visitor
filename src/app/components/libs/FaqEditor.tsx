import React, { useReducer, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { FAQ, faqReducer } from './faqReducer';
import FAQForm from './faqs/FAQForm';
import FAQList from './faqs/FAQList';
import FAQPaste from './faqs/FAQPaste';

interface FAQEditorProps {
  initialFAQs?: FAQ[];
  onStateChange?: (faqs: FAQ[]) => void;
}

const FAQEditor: React.FC<FAQEditorProps> = ({ initialFAQs = [], onStateChange }) => {
  const [state, dispatch] = useReducer(faqReducer, initialFAQs);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  // Notify parent when state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state]);

  // Initialize state with initialFAQs when they change
  useEffect(() => {
    if (initialFAQs.length > 0) {
      dispatch({ type: 'SET_FAQS', payload: initialFAQs });
    }
  }, [initialFAQs]);

  const handleEditFAQ = (faq: FAQ) => setEditingFAQ(faq);

  return (
    <Box>
      <Typography variant="h4">FAQ Editor</Typography>
      <FAQForm
        editingFAQ={editingFAQ}
        onSave={(faq) => {
          const actionType = editingFAQ ? 'UPDATE_FAQ' : 'ADD_FAQ';
          dispatch({ type: actionType, payload: faq });
          setEditingFAQ(null);
        }}
        onCancel={() => setEditingFAQ(null)}
      />
      <FAQList
        faqs={state}
        onEdit={handleEditFAQ}
        onDelete={(id) => dispatch({ type: 'DELETE_FAQ', payload: id })}
      />
      <FAQPaste
        onPaste={(faqs) => dispatch({ type: 'SET_FAQS', payload: faqs })}
      />
    </Box>
  );
};

export default React.memo(FAQEditor);
