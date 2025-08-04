import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { FAQ } from '../faqReducer';

interface FAQFormProps {
  editingFAQ?: FAQ | null;
  onSave: (faq: FAQ) => void;
  onCancel: () => void;
}

const FAQForm: React.FC<FAQFormProps> = ({ editingFAQ, onSave, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (editingFAQ) {
      setQuestion(editingFAQ.question);
      setAnswer(editingFAQ.answer);
    } else {
      setQuestion('');
      setAnswer('');
    }
  }, [editingFAQ]);

  const handleSave = () => {
    if (question.trim() && answer.trim()) {
      onSave({
        id: editingFAQ?.id || `faq-${Date.now()}`,
        question,
        answer,
      });
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <Box>
      <TextField
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSave} variant="contained" color="primary">
        {editingFAQ ? 'Update FAQ' : 'Add FAQ'}
      </Button>
      {editingFAQ && (
        <Button onClick={onCancel} variant="outlined" color="secondary">
          Cancel
        </Button>
      )}
    </Box>
  );
};

export default FAQForm;
