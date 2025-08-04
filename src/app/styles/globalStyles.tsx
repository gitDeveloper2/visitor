"use client"
/** @jsxImportSource @emotion/react */
import { Box, List, ListItem, } from '@mui/material';
import { useTheme , styled} from  '@mui/material/styles';
import { Global, css } from '@emotion/react';
import { Theme } from '@mui/material/styles';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, solarizeddark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import customTheme from './customSyntaxTheme';

const GlobalStyles: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Global
      styles={css`
    :root {
    --color-background: #f5f5f9;
    --color-scrollbar: #c1c1c1;
    --color-scrollbar-hover: #a1a1a1;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background: var(--color-background);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background: var(--color-background);
    border-radius: 10px;
  }

        body {
          margin: 0;
          padding: 0;
          font-family: ${theme.typography.fontFamily || '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'};
          background-color: ${theme.palette.background.default || '#fff'};
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        figcaption {
          font-size: ${theme.typography.caption?.fontSize || '0.875rem'};
          color: ${theme.typography.caption?.color || theme.palette.text.secondary};
        }

        /* blog css start */
  /* styles.css */
  .custom-image-blot {
    display: block;
    text-align: center;
    margin: 10px 0;
  }

  .custom-image-blot img {
    max-width: 100%;
    height: auto;
  }

  .custom-image-blot figcaption {
    font-style: italic;
    color: #666;
    font-size: 0.9em;
  }
  .controls {
    display: flex;
    border: 1px solid #ccc;
    border-top: 0;
    padding: 10px;
  }

  .controls-right {
    margin-left: auto;
  }

  .state {
    margin: 10px 0;
    font-family: monospace;
  }

  .state-title {
    color: #999;
    text-transform: uppercase;
  }
  /* Heading 1 */
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #222;
    margin-bottom: 1rem;
    line-height: 1.2;
    letter-spacing: -0.015em;
  }

  /* Heading 2 */
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  /* Heading 3 */
  h3 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #444;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  /* Heading 4 */
  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #555;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    letter-spacing: 0em;
  }

  /* Heading 5 */
  h5 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #666;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    letter-spacing: 0em;
  }

  /* Heading 6 */
  h6 {
    font-size: 1rem;
    font-weight: 700;
    color: #777;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    letter-spacing: 0.015em;
  }

  p{
    font-size: 1.125rem;
    line-height: 1.75;
    color: #333;
    margin-bottom: 1.5rem;
    letter-spacing: 0.015em;
  }

  li{
    font-size: 1rem;
    line-height: 1.75;
    color: #444;
    margin-bottom: 1.5rem;
    letter-spacing: 0.015em; 
  }
  /* styles/code.css */

  code {
    background-color: #f5f5f5; /* Light theme background */
    border-radius: 4px;
    padding: 0.5em;
    font-family: monospace;
    font-size: 0.9em;
    overflow-x: auto;
    display: block; /* Ensure block display for code */
    background-color: #2e2e2e;
    color: #e0e0e0;
  }

  /* For dark theme, if needed */
  .code.dark {
    background-color: #2e2e2e;
    color: #e0e0e0;
  }

  /* Body 1 */
  .body1 {
    font-size: 1.125rem;
    line-height: 1.75;
    color: #333;
    margin-bottom: 1.5rem;
    letter-spacing: 0.015em;
  }

  /* Body 2 */
  .body2 {
    font-size: 1rem;
    line-height: 1.75;
    color: #444;
    margin-bottom: 1.5rem;
    letter-spacing: 0.015em;
  }

         /* blog css end */

  /* quil custom cards start */
  .context-card {
      display: flex;
      align-items: flex-start;
      /* padding: 15px 20px;
      margin: 15px 0; */
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-left: 5px solid;
    }
    
    .context-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    
    .context-card .icon {
      font-size: 24px;
      /* margin-right: 15px; */
    }
    
    .context-card .content {
      flex-grow: 1;
    }
    
    .context-card h4 {
      /* margin: 0 0 5px; */
      font-size: 16px;
      font-weight: bold;
    }
    
    .context-card p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }
    
    /* Info Card */
    .context-card.info {
      background-color: #e3f2fd;
      border-color: #1976d2;
      color: #0d47a1;
    }
    
    .context-card.info .icon {
      color: #1976d2;
    }
    
    /* Warning Card */
    .context-card.warning {
      background-color: #fff3cd;
      border-color: #ffa000;
      color: #795548;
    }
    
    .context-card.warning .icon {
      color: #ffa000;
    }
    
    /* Success Card */
    .context-card.success {
      background-color: #e8f5e9;
      border-color: #43a047;
      color: #1b5e20;
    }
    
    .context-card.success .icon {
      color: #43a047;
    }
    
    /* Error Card */
    .context-card.error {
      background-color: #ffebee;
      border-color: #e53935;
      color: #b71c1c;
    }
    
    .context-card.error .icon {
      color: #e53935;
    }
    .ql-refference {
    color: #0073e6; /* Link color */
    text-decoration: underline;
    text-decoration-color: #ffcc00; /* Custom underline color */
    cursor: pointer; /* Makes it look clickable */
    font-style: italic;
    /* font-weight: bold;  */
  }

  .ql-refference:hover {
    color: #005bb5; /* Slightly darker color on hover */
    text-decoration-color: #ffaa00; /* Change underline color on hover */
  }

  /* quil custom cards end */

         
      `}
    />
  );
};

export default GlobalStyles;

interface CodeBoxProps {
  children: string; // Expecting the code to be passed as a string
  language?: string; // Optional prop to specify the language
  theme?: 'light' | 'dark'; // Optional prop to specify the theme
}

const CodeContainer = styled(Box)({
  background: '#f4f4f4',
  padding: '1rem',
  borderRadius: '4px',
  fontFamily: 'Monospace',
  whiteSpace: 'pre-wrap',
  margin: '16px 0',
  maxWidth: '100%',
  overflowX: 'auto',
  
});

export const CodeBox: React.FC<CodeBoxProps> = ({ children, language = 'javascript', theme = 'light' }) => {
  // const style = theme === 'dark' ? solarizeddark : solarizedlight;
  const style = theme === 'dark' ? customTheme : customTheme;

  return (
    <CodeContainer>
      <SyntaxHighlighter language={language} style={style}>
        {children}
      </SyntaxHighlighter>
    </CodeContainer>
  );
};

// Container for the List component
export const ListContainer = styled(Box)({
  maxWidth: '100%',        // Ensure the container does not exceed the parent width
  overflowX: 'auto',       // Add horizontal scroll if content overflows
  padding: '1rem',
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  margin: '16px 0',
});

// Apply overflow handling to the List
export const StyledList = styled(List)({
  padding: 0,              // Remove default padding
  margin: 0,               // Remove default margin
  overflowX: 'auto',       // Add horizontal scroll if content overflows
});

export const StyledListItem = styled(ListItem)({
  padding: '8px 0',        // Adjust padding if needed
  wordBreak: 'break-word', // Break long words to avoid overflow
});