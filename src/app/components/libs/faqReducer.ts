export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

type FAQAction =
  | { type: 'ADD_FAQ'; payload: FAQ }
  | { type: 'UPDATE_FAQ'; payload: FAQ }
  | { type: 'DELETE_FAQ'; payload: string }
  | { type: 'SET_FAQS'; payload: FAQ[] };

type FAQState = FAQ[];

// Reducer to handle FAQ actions
export const faqReducer = (state: FAQ[], action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'ADD_FAQ':
      return [...state, action.payload];
    case 'UPDATE_FAQ':
      return state.map((faq) =>
        faq.id === action.payload.id
          ? { ...faq, question: action.payload.question, answer: action.payload.answer }
          : faq
      );
    case 'DELETE_FAQ':
      return state.filter((faq) => faq.id !== action.payload);
    case 'SET_FAQS':
      return [...action.payload];
    default:
      return state;
  }
};
