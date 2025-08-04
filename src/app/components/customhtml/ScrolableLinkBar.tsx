"use client"; // Ensure this runs in the client side

import React from 'react';
import { Box, Link, styled } from '@mui/material';

const ScrollableContainer = styled(Box)`
  display: flex;
  overflow-x: auto;  /* Enables horizontal scrolling */
  white-space: nowrap; /* Prevents links from wrapping */
  padding: 10px 0;  /* Adds some vertical spacing */
  background-color: #f0f0f0; /* Optional background color */
`;

const ScrollableLink = styled(Link)`
  display: inline-block;
  margin-right: 30px; /* Space between links */
  font-size: 16px;
  color: #0070f3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ScrollableLinksBar = ({ links }) => {
  return (
    <ScrollableContainer>
      {links.map((link, index) => (
        <ScrollableLink key={index} href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </ScrollableLink>
      ))}
    </ScrollableContainer>
  );
};

export default ScrollableLinksBar;
