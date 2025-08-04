"use client";

import React, { forwardRef, useCallback, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import useEditorHeight from "../../../hooks/useDynamicHeight";
import useQuillEditor from "../../../hooks/useQuillSetup";
import { HtmlEditor } from "./QuilHTMLEditor";
import { ContextCardBlot } from "@components/blots/ContextCardBlot";
import ContextCardDialog from "./ContextDialog";
import { Bibliography } from "./Biography";
import { useReferenceHandlers } from "../../../hooks/useReferenceHandlers";
import { BibliographyState } from "../../../hooks/useBibliography";
import ReferenceModal from "./ReferenceModal";
import { Reference } from "../../../types/Bibliography";
import FAQEditor from "./FaqEditor";
import { FAQ } from "./faqReducer";


interface EditorProps {
  readOnly?: boolean;
  initialContent?: string;
  slug: string;
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
  refs:BibliographyState,
  faqs:FAQ[],
  content:"blog"|"news";
}

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, initialContent, slug, onTextChange, onSelectionChange,refs,faqs,content }, ref) => {
    
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHtmlMode, setIsHtmlMode] = useState<boolean>(false);
    const [htmlContent, setHtmlContent] = useState<string>(initialContent || "");
    const [isContentSaving, setIsContentSaving] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [generateToc, setGenerateToc] = useState<boolean>(false);
    const [wordCount, setWordCount] = useState<number>(0); // Word count state
    // Custom Hook for initializing Quill editor
    const {openDialog,quillRef,selectedCardData,setOpenDialog,setSelectedCardData,getSelectionRange,setSelectionRange,ImageDialogComponent,
      handleUpdateReference,
    isModalOpen,
    closeModal,
    handleInsertReference,
    referenceToEdit,
    state,
    editReference,
    handleDeleteReference,
    faqState,
    handleFAQsChange
    } = useQuillEditor({
      refs,
      containerRef,
      initialContent,
      readOnly,
      onTextChange: (semanticHTML) => {
        setHtmlContent(semanticHTML); // Update the HTML content
        const plainText = quillRef.current?.getText() || ""; // Extract plain text
        setWordCount(plainText.trim().split(/\s+/).filter(Boolean).length); // Update word count
      },
      onSelectionChange,
      ref,
      setHtmlContent,
      // generateToc,
      htmlContent,
      slug,
      isHtmlMode,
      setIsHtmlMode,
      wordCount,
      content
    });

    
    

    const handleSaveCard = (
      title: string,
      content: string,
      type: string,
      cardData: { title: string; content: string; type: string } | null
    ) => {
    
      // Check if the ref is valid and points to a Quill instance
      if (!quillRef || typeof quillRef === "function" || !quillRef.current) {
        console.error("Quill instance is not available.");
        return;
      }
  
      const quill = quillRef.current; 
      const range = getSelectionRange(); // Get current selection range
  
      
  
      if (cardData) {
        // Editing existing card
        const card = quill.root.querySelector(`[data-title="${cardData.title}"]`);
        if (card) {
          card.setAttribute("data-title", title);
          card.setAttribute("data-content", content);
          card.setAttribute("data-type", type);
          const icon = ContextCardBlot.getIcon(type);
          card.innerHTML = `<div class="icon">${icon}</div><div class="content"><h4>${title}</h4><p>${content}</p></div>`;
        }
      } else {
        // Inserting new card at the cursor position
        const id = Date.now().toString(); // Unique ID
        quill.insertEmbed(range.index, "contextCard", { title, content, type });
  
        // Move the cursor to the position after the inserted card
        quill.setSelection(range.index + 1);
      }
    };
  
    // Custom Hook for dynamic editor height
    const editorHeight = useEditorHeight();
    
 
   
    return (
      <div>
        <HtmlEditor
          editorHeight={editorHeight}
          containerRef={containerRef}
        />
         <ContextCardDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveCard}
        cardData={selectedCardData}
      />
      {ImageDialogComponent}
      {isModalOpen && (
        <ReferenceModal
          onClose={() => closeModal()}
          onSubmit={handleInsertReference}
          referenceToEdit={referenceToEdit}
          onUpdate={handleUpdateReference}
        />
      )}

      <Bibliography
      inlineReferences={Object.values(state?.inline || {})}
      backgroundReferences={Object.values(state?.background || {})}
      onEdit={(id: string, reference: Reference) => editReference(id, reference)}
      onDelete={handleDeleteReference}
    />
    
    <FAQEditor
      initialFAQs={faqs || []}
      onStateChange={handleFAQsChange}
    />
    


      </div>
    );
  }
);

Editor.displayName = "Editor";
export default Editor;
