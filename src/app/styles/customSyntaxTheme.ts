import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// Define a custom theme with more vibrant colors
const customTheme = {
  'code[class*="language-"]': {
    color: '#f8f8f2',
    background: '#272822',
  },
  'pre[class*="language-"]': {
    color: '#f8f8f2',
    background: '#272822',
    overflow: 'auto',
    padding: '1em',
    borderRadius: '0.3em',
  },
  'pre[class*="language-"]::-webkit-scrollbar': {
    width: '1em',
  },
  'pre[class*="language-"]::-webkit-scrollbar-thumb': {
    background: '#444',
    borderRadius: '1em',
  },
  'a': {
    color: '#f92672',
  },
  'code': {
    color: '#f8f8f2',
  },
  'comment': {
    color: '#75715e',
  },
  'keyword': {
    color: '#66d9ef',
  },
  'string': {
    color: '#e6db74',
  },
  'variable': {
    color: '#f8f8f2',
  },
  'number': {
    color: '#ae81ff',
  },
  'function': {
    color: '#a6e22e',
  },
  // Add more styles for different syntax elements as needed
};

export default customTheme;
