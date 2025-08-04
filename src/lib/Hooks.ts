"use client"
// navigationUtils.js
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'
export const useHandleLinkClick = () => {
  const navigate = useNavigate();

  const handleLinkClick = (url:string, sectionId:string):void => {
    // navigate(url, { replace: true });
    setTimeout(() => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // delay to ensure the DOM is updated
  };

  return handleLinkClick;
};
