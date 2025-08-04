// useReferenceHandlers.ts
import { useState } from "react";
import Quill from "quill";
// import { Delta } from "quill";

import { BibliographyState, useBibliography } from "./useBibliography";
import { Reference } from "../types/Bibliography";

export const useReferenceHandlers = (quillInstance: Quill | null,refs:BibliographyState) => {
  const [referenceToEdit, setReferenceToEdit] = useState<Reference | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    state: bibliographyState, // Alias state from useBibliography
    stateRef,
    addReference,
    editReference,
    deleteReference,
  } = useBibliography(refs);
  const state = bibliographyState; // Explicitly initialize state


  const openModal = (reference?: Reference) => {
    setReferenceToEdit(reference || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReferenceToEdit(null);
  };

  const handleInsertReference = (referenceData: Reference, addToBibliography: boolean) => {
    
    if (addToBibliography) {
      addReference(referenceData, false); // Add to background references
      return;
    }
  
    if (quillInstance) {
      const range = quillInstance.getSelection(true);
  
      if (range) {
        // Define the text to display and the custom attributes
        const referenceAttributes = { reference: referenceData }; // Custom attributes for the blot
        const reference=referenceAttributes

        // Create the Delta operation
        const newOps = [
          { retain: range.index }, // Retain everything up to the current cursor position
          {
            insert: referenceData.linkText,
            attributes: referenceAttributes,
          },
        ];
  
        // Apply the operations as a Delta
        const Delta = Quill.import("delta");
        const delta = new Delta(newOps);
        quillInstance.updateContents(delta);
  
        // Move the cursor to the end of the inserted text
        quillInstance.setSelection(range.index + referenceData.linkText.length);
      }
    }
  
    addReference(referenceData, true); // Add to inline references
  };
  
  

  const handleUpdateReference = (updatedReference: Reference) => {
    if (quillInstance && referenceToEdit) {
      const referenceNode = quillInstance.root.querySelector(`[data-ref-id='${referenceToEdit.id}']`);
      if (referenceNode) {
        // Update the reference attributes with the new data
        referenceNode.setAttribute("data-author-firstname", updatedReference.authorFirstName);
        referenceNode.setAttribute("data-author-lastname", updatedReference.authorLastName);
        referenceNode.setAttribute("data-title", updatedReference.title);
        referenceNode.setAttribute("data-publisher", updatedReference.publisher);
        referenceNode.setAttribute("data-date", updatedReference.date);
        referenceNode.setAttribute("data-url", updatedReference.url || "");
        referenceNode.setAttribute("data-linktext", updatedReference.linkText || "");
        referenceNode.setAttribute("data-type", updatedReference.type);
        referenceNode.setAttribute("data-kind", updatedReference.kind);
  
        // Add the new fields to the attributes
        if (updatedReference.journalName) {
          referenceNode.setAttribute("data-journal-name", updatedReference.journalName);
        }
        if (updatedReference.volume) {
          referenceNode.setAttribute("data-volume", updatedReference.volume);
        }
        if (updatedReference.issue) {
          referenceNode.setAttribute("data-issue", updatedReference.issue);
        }
        if (updatedReference.pageRange) {
          referenceNode.setAttribute("data-page-range", updatedReference.pageRange);
        }
        if (updatedReference.doi) {
          referenceNode.setAttribute("data-doi", updatedReference.doi);
        }
        if (updatedReference.websiteName) {
          referenceNode.setAttribute("data-website-name", updatedReference.websiteName);
        }
  
        // Update the display text with the new reference information
        // referenceNode.innerHTML = updatedReference.linkText
        // Optionally, you can include more fields in the display text
        // const displayText = `${updatedReference.authorFirstName}, ${updatedReference.title}, (${updatedReference.date})`;
        referenceNode.innerHTML = updatedReference.linkText
      }
  
      // Update the reference in the background data
      editReference(referenceToEdit.id, updatedReference);
    }
  
    closeModal();
  };
  

  const handleReferenceClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
 
    // Check if the clicked element is a reference span

    if (target.tagName === "SPAN" && target.hasAttribute("data-ref-id")) {
      const referenceData: Reference = {
        id: target.getAttribute("data-ref-id") || "",
        authorFirstName:target.getAttribute("data-author-firstname") || "",
        authorLastName:target.getAttribute("data-author-lastname") || "",
        title: target.getAttribute("data-title") || "",
        publisher: target.getAttribute("data-publisher") || "",
        date: target.getAttribute("data-date") || "",
        url: target.getAttribute("data-url") || undefined,
        linkText:target.getAttribute("data-linktext") || undefined,
        type: (target.getAttribute("data-type") || "book") as Reference["type"],
        journalName: target.getAttribute("data-journal-name") || undefined,
        volume: target.getAttribute("data-volume") || undefined,
        issue: target.getAttribute("data-issue") || undefined,
        pageRange: target.getAttribute("data-page-range") || undefined,
        doi: target.getAttribute("data-doi") || undefined,
        websiteName: target.getAttribute("data-website-name") || undefined,
        kind: target.getAttribute("data-kind") || undefined,
      };
      
  
      openModal(referenceData); // Open the modal with the reference data
    }
  };
  

  const handleDeleteReference = (id: string) => {
    deleteReference(id);
  };

  return {
   state,
   stateRef,
    referenceToEdit,
    isModalOpen,
    openModal,
    closeModal,
    handleInsertReference,
    handleUpdateReference,
    handleReferenceClick,
    handleDeleteReference,
    editReference
  };
};
