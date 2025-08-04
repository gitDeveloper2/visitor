import ImageDialog from "@components/libs/CustomImageDialog";
import Quill from "quill";
import { useState } from "react";


export const createToolbarHandlers = (
  quillRef: React.MutableRefObject<Quill | null>,
  setHtmlContent: (html: string) => void,
  setIsHtmlMode: React.Dispatch<React.SetStateAction<boolean>>,
  handleSave: () => Promise<void>,
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setOpenImageDialog:React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedCardData: React.Dispatch<React.SetStateAction<{ title: string; content: string; type: string } | null>>,
  // setGenerateToc: (generate: boolean | ((prev: boolean) => boolean)) => void,
  // getSelectionRange: () => { index: number; length: number } | null,
  setSelectionRange:(range: { index: number; length: number })=>void,
  generateTocRef: React.MutableRefObject<boolean>, // MutableRefObject
) => {




  const handlers = {
    'link': function(value) { 
      
      if (value) {
         const href = prompt('Enter the URL:'); 
        const dofollow = confirm('Make this a dofollow link?'); 
        
        const type = dofollow ? 'dofollow' : 'nofollow';
        quillRef.current.format('link', { href, type });
       } 
        else {
          

           quillRef.current.format('link', null); 

        }
        },
  "context-card": () => {
   
    if (quillRef.current) {
      const selection = quillRef.current.getSelection(true);
      
      if (selection) {
        setSelectionRange(selection)
        setSelectedCardData(null); // Clear any existing card data
        setOpenDialog(true); // Open the dialog for context card creation
      }
    }
  },
  "generate-toc": () => {
    if (generateTocRef.current !== undefined) {
      const newState = !generateTocRef.current;
      generateTocRef.current = newState;
      

      // Update toolbar button appearance
      const tocButton = document.querySelector(".ql-generate-toc");
      if (tocButton) {
        tocButton.classList.toggle("active", newState); // Add/remove the 'active' class
        tocButton.innerHTML = newState
          ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path d="M5 5h14v14H5z" fill="currentColor"/>
            </svg>
          ` // Active icon
          : `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <rect x="3" y="5" width="18" height="2" fill="none" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="9" width="18" height="2" fill="none" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="13" width="18" height="2" fill="none" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="17" width="18" height="2" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          `; // Default icon
      }
    }
  },
  "save-content": async () => {
    
    await handleSave();
  },
  "custom-image": () => {
    if (quillRef.current) {
      const selection = quillRef.current.getSelection(true);
  
      if (selection) {
        setSelectionRange(selection)

   setOpenImageDialog((prev)=>!prev)
      }}
  },
  "switch-to-html": () => {
    if (quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML || "";
      setHtmlContent(currentContent);
    }
    setIsHtmlMode((prev) => !prev);
  },
  "table": () => {
      if (quillRef.current) {
        let tableModule = quillRef.current.getModule('better-table') as any
        tableModule.insertTable(3, 3)
      }
    }
}


return{
  handlers:handlers
  };
};