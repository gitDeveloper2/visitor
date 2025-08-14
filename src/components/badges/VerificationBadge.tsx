import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle, Launch } from '@mui/icons-material';

interface VerificationBadgeProps {
  appName: string;
  appUrl: string;
  variant?: 'default' | 'compact' | 'minimal';
  theme?: 'light' | 'dark';
  className?: string;
}

export default function VerificationBadge({ 
  appName, 
  appUrl, 
  variant = 'default',
  theme = 'light',
  className = ''
}: VerificationBadgeProps) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    padding: variant === 'compact' ? '8px 12px' : '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: variant === 'minimal' ? '12px' : '14px',
    fontWeight: 500,
    border: '1px solid',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }
  };

  const lightTheme = {
    backgroundColor: '#ffffff',
    color: '#2563eb',
    borderColor: '#dbeafe',
    '&:hover': {
      backgroundColor: '#f8fafc',
      borderColor: '#2563eb',
    }
  };

  const darkTheme = {
    backgroundColor: '#1e293b',
    color: '#60a5fa',
    borderColor: '#334155',
    '&:hover': {
      backgroundColor: '#334155',
      borderColor: '#60a5fa',
    }
  };

  const styles = {
    ...baseStyles,
    ...(theme === 'dark' ? darkTheme : lightTheme)
  };

  if (variant === 'minimal') {
    return (
      <a 
        href={appUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          ...styles,
          padding: '6px 10px',
          fontSize: '12px',
          gap: '6px'
        }}
        className={className}
      >
        <CheckCircle style={{ fontSize: '14px' }} />
        <span>Verified on BasicUtils</span>
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <a 
        href={appUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        style={styles}
        className={className}
      >
        <CheckCircle style={{ fontSize: '16px' }} />
        <span>View {appName} on BasicUtils</span>
        <Launch style={{ fontSize: '14px' }} />
      </a>
    );
  }

  return (
    <a 
      href={appUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      style={styles}
      className={className}
    >
      <CheckCircle style={{ fontSize: '18px' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontWeight: 600 }}>Verified App</span>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>View {appName} on BasicUtils</span>
      </Box>
      <Launch style={{ fontSize: '16px' }} />
    </a>
  );
}

// HTML string generator for easy copy-paste
export function generateVerificationBadgeHtml(
  appName: string, 
  appUrl: string, 
  variant: 'default' | 'compact' | 'minimal' = 'default',
  theme: 'light' | 'dark' = 'light'
): string {
  const baseStyles = `
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: ${variant === 'compact' ? '8px 12px' : variant === 'minimal' ? '6px 10px' : '12px 16px'};
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: ${variant === 'minimal' ? '12px' : '14px'};
    font-weight: 500;
    border: 1px solid;
    cursor: pointer;
  `;

  const lightStyles = `
    background-color: #ffffff;
    color: #2563eb;
    border-color: #dbeafe;
  `;

  const darkStyles = `
    background-color: #1e293b;
    color: #60a5fa;
    border-color: #334155;
  `;

  const styles = baseStyles + (theme === 'dark' ? darkStyles : lightStyles);

  if (variant === 'minimal') {
    return `
      <a href="${appUrl}" target="_blank" rel="noopener noreferrer" style="${styles}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <span>Verified on BasicUtils</span>
      </a>
    `;
  }

  if (variant === 'compact') {
    return `
      <a href="${appUrl}" target="_blank" rel="noopener noreferrer" style="${styles}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <span>View ${appName} on BasicUtils</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
      </a>
    `;
  }

  return `
    <a href="${appUrl}" target="_blank" rel="noopener noreferrer" style="${styles}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <span style="font-weight: 600;">Verified App</span>
        <span style="font-size: 12px; opacity: 0.8;">View ${appName} on BasicUtils</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
      </svg>
    </a>
  `;
}
